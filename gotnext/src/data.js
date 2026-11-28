// GOT NEXT — data: everything a designer would want to edit lives here.
'use strict';
const VERSION = '0.19.0';
// The brand in one place. Rename the game here and the title, signs, codes and docs strings follow.
const BRAND = {
  name: 'GOT NEXT', a: 'GOT', b: 'NEXT', code: 'GN',
  line: 'Build a player. Hold the court. Come home dripping.',
  season: { no: 0, name: 'PRESEASON' },          // slot for seasons ("RUN 01", "RUN 02" …)
  ticker: ['WINNERS STAY', 'CALL YOUR OWN', 'CHECK UP', 'ONES AND TWOS', 'TAKE IT BACK', 'WHO GOT NEXT', 'NO REFS', 'RUN IT BACK', 'BALL DON\'T LIE'],
};

// ---------- attributes ----------
// cat: F finishing, S shooting, P playmaking, D defense, A athletics
const ATTRS = [
  { id: 'layup', n: 'Layup', cat: 'F', d: 'Finishing at the rim. Every layup in your package runs on this.' },
  { id: 'dunk', n: 'Dunk', cat: 'F', d: 'Getting up and throwing it down. About 45 with a clear run, 55 otherwise, on Street courts; taller players need less.' },
  { id: 'close', n: 'Close Shot', cat: 'F', d: 'Hooks, floaters and bunnies inside ten feet.' },
  { id: 'mid', n: 'Mid-Range', cat: 'S', d: 'Pull-ups, fades and elbow jumpers. The shot nobody guards any more.' },
  { id: 'three', n: 'Deep Ball', cat: 'S', d: 'Shots from behind the arc. Worth two out here.' },
  { id: 'iq', n: 'Shot IQ', cat: 'S', d: 'Widens your timing window and softens bad releases.' },
  { id: 'handle', n: 'Handles', cat: 'P', d: 'Dribble moves, ankle breakers, and keeping the ball when he reaches.' },
  { id: 'pass', n: 'Passing', cat: 'P', d: 'Pass speed and how hard you are to pick off.' },
  { id: 'swb', n: 'Speed w/ Ball', cat: 'P', d: 'How much speed you keep while dribbling.' },
  { id: 'perd', n: 'Perimeter D', cat: 'D', d: 'Staying in front, contesting jumpers, keeping your ankles.' },
  { id: 'intd', n: 'Interior D', cat: 'D', d: 'Contests at the rim.' },
  { id: 'steal', n: 'Steal', cat: 'D', d: 'Picking pockets and jumping passing lanes.' },
  { id: 'block', n: 'Block', cat: 'D', d: 'Sending shots back where they came from.' },
  { id: 'reb', n: 'Rebound', cat: 'D', d: 'Winning boards, including over people taller than you.' },
  { id: 'speed', n: 'Speed', cat: 'A', d: 'Top speed without the ball.' },
  { id: 'accel', n: 'Burst', cat: 'A', d: 'First step and how fast you hit top speed.' },
  { id: 'str', n: 'Strength', cat: 'A', d: 'Finish through contact, resist shoves, hold your spot.' },
  { id: 'vert', n: 'Vertical', cat: 'A', d: 'Jump height for dunks, blocks and boards.' },
  { id: 'stam', n: 'Stamina', cat: 'A', d: 'Sprint and chain moves longer before your shot falls apart.' },
];
const ATTR = {}; ATTRS.forEach(a => ATTR[a.id] = a);
const CATS = { F: ['FINISHING', '#ff6a3d'], S: ['SHOOTING', '#3dffa0'], P: ['PLAYMAKING', '#f2c14e'], D: ['DEFENSE', '#7de3ff'], A: ['ATHLETICS', '#a78bff'] };

// ---------- playstyles (the "class") : base caps before body mods ----------
const STYLES = [
  { id: 'sniper', n: 'Sniper', tag: 'Certified from the parking lot.',
    cap: { layup: 78, dunk: 60, close: 80, mid: 96, three: 99, iq: 99, handle: 82, pass: 78, swb: 80, perd: 78, intd: 55, steal: 70, block: 50, reb: 55, speed: 82, accel: 82, str: 62, vert: 68, stam: 90 } },
  { id: 'slasher', n: 'Slasher', tag: 'The lane is a constitutional right.',
    cap: { layup: 99, dunk: 99, close: 90, mid: 80, three: 72, iq: 78, handle: 88, pass: 76, swb: 92, perd: 80, intd: 66, steal: 78, block: 66, reb: 66, speed: 95, accel: 97, str: 78, vert: 99, stam: 94 } },
  { id: 'general', n: 'Floor General', tag: 'Everybody eats. You hold the menu.',
    cap: { layup: 86, dunk: 66, close: 82, mid: 88, three: 88, iq: 92, handle: 99, pass: 99, swb: 97, perd: 84, intd: 50, steal: 86, block: 45, reb: 52, speed: 92, accel: 95, str: 58, vert: 72, stam: 97 } },
  { id: 'lockdown', n: 'Lockdown', tag: 'Your matchup files a complaint.',
    cap: { layup: 82, dunk: 80, close: 78, mid: 76, three: 78, iq: 76, handle: 76, pass: 74, swb: 80, perd: 99, intd: 86, steal: 99, block: 88, reb: 80, speed: 92, accel: 92, str: 84, vert: 88, stam: 96 } },
  { id: 'glass', n: 'Glass Eater', tag: 'Every rebound is a personal asset.',
    cap: { layup: 84, dunk: 94, close: 96, mid: 72, three: 58, iq: 70, handle: 60, pass: 70, swb: 62, perd: 68, intd: 99, steal: 62, block: 99, reb: 99, speed: 74, accel: 72, str: 99, vert: 90, stam: 88 } },
  { id: 'showman', n: 'Showman', tag: 'Efficiency is for accountants.',
    cap: { layup: 92, dunk: 92, close: 84, mid: 90, three: 86, iq: 84, handle: 96, pass: 90, swb: 92, perd: 72, intd: 55, steal: 76, block: 58, reb: 60, speed: 88, accel: 92, str: 66, vert: 92, stam: 88 } },
];
const STYLE = {}; STYLES.forEach(s => STYLE[s.id] = s);

// ---------- origins (the "background") ----------
const ORIGINS = [
  { id: 'mallrat', n: 'Mall Rat', d: 'Raised in the last open food court in Ohio.', perk: 'Shops charge 10% less HC.', k: 'shop', v: 0.10 },
  { id: 'labgrown', n: 'Lab-Grown', d: 'Vat #44, premium batch. Still under warranty.', perk: '+3 to every Athletics cap.', k: 'ath', v: 3 },
  { id: 'rustbelt', n: 'Rust Belt Kid', d: 'Learned the game on a rim welded to a silo.', perk: '+15% Respect from every game.', k: 'rep', v: 0.15 },
  { id: 'orbital', n: 'Orbital Transfer', d: 'Grew up in low gravity. Earth is rude.', perk: '+4 Vertical cap, +2 Deep Ball cap.', k: 'orb', v: 1 },
  { id: 'exmascot', n: 'Ex-Mascot', d: 'Nine years inside the Freedom Eagle. Never again.', perk: 'Bravado fills 20% faster.', k: 'brav', v: 0.20 },
  { id: 'nepo', n: 'Nepo Baby', d: 'Dad owned a team. Dad owned a moon.', perk: 'Start with 400 extra HC. Everyone knows.', k: 'vc', v: 400 },
];
const ORIGIN = {}; ORIGINS.forEach(o => ORIGIN[o.id] = o);

// body → cap modifiers. hN, wN, sN are height / weight / wingspan in -1..1
const BODY_MOD = {
  layup: [-2, -2, 2], dunk: [5, -2, 4], close: [5, 3, 2], mid: [-3, 0, -3], three: [-7, -1, -4], iq: [-2, 0, 0],
  handle: [-11, -3, -3], pass: [-3, 0, 0], swb: [-10, -5, -1], perd: [-6, -3, 4], intd: [11, 5, 5], steal: [-5, -2, 7],
  block: [13, 0, 8], reb: [11, 4, 6], speed: [-10, -7, 0], accel: [-11, -8, 0], str: [8, 13, 0], vert: [-5, -8, 0], stam: [-2, -5, 0],
};
const H_MIN = 67, H_MAX = 87;        // inches: 5'7" .. 7'3"
function fmtH(i) { return Math.floor(i / 12) + "'" + (i % 12) + '"'; }
function bodyNorm(b) { return { h: (b.h - 77) / 10, w: b.w, s: b.s }; }   // w, s stored as -1..1 sliders
function capsFor(build) {
  const st = STYLE[build.style], bn = bodyNorm(build.body), o = ORIGIN[build.origin], out = {};
  for (const a of ATTRS) {
    const m = BODY_MOD[a.id];
    let c = st.cap[a.id] + m[0] * bn.h + m[1] * bn.w + m[2] * bn.s;
    if (o.k === 'ath' && a.cat === 'A') c += o.v;
    if (o.k === 'orb') { if (a.id === 'vert') c += 4; if (a.id === 'three') c += 2; }
    out[a.id] = Math.max(35, Math.min(99, Math.round(c)));
  }
  return out;
}
function startAttrs(build) { const c = capsFor(build), o = {}; for (const a of ATTRS) o[a.id] = Math.max(30, Math.round(c[a.id] * 0.56)); return o; }
function attrCost(v) { const b = 6 + Math.pow(Math.max(0, v - 30), 1.55) * 0.16; return Math.round(b * (1 + Math.pow(Math.max(0, v - 55) / 13, 1.6))); }   // HC for +1 from v: cheap early, steep near the top (maxing a build is weeks of play, not one night)
const OVR_W = { layup: 1, dunk: .7, close: .7, mid: 1, three: 1.2, iq: .8, handle: 1.1, pass: .8, swb: .8, perd: 1, intd: .7, steal: .8, block: .7, reb: .8, speed: 1, accel: 1, str: .6, vert: .7, stam: .6 };
function ovrOf(attrs) {
  // best 12 weighted, so specialists are not punished for dump stats
  const v = ATTRS.map(a => attrs[a.id]).sort((a, b) => b - a).slice(0, 12);
  return Math.min(99, Math.round(v.reduce((s, x) => s + x, 0) / 12 + 2));
}

// ---------- badges ----------
const TIERS = ['—', 'BRONZE', 'SILVER', 'GOLD', 'ICED OUT'];
const TIER_COL = ['#555', '#c9814a', '#c8d0d8', '#f2c14e', '#7de3ff'];
const TIER_COST = [0, 1, 2, 3, 4];
const BADGES = [
  { id: 'postman', cat: 'F', n: 'The Postman', d: 'Backing down in the post moves the defender further.', req: ['str', 55, 68, 80, 90] },
  { id: 'heatcheck', cat: 'S', n: 'Heat Check', d: 'Hop jumpers and floaters catch green more often.', req: ['iq', 55, 68, 80, 92] },
  { id: 'showtime', cat: 'P', n: 'Showtime', d: 'Show-off dribbles with room to work fill your Bravado.', req: ['handle', 58, 70, 82, 93] },
  { id: 'hardhat', cat: 'D', n: 'Hard Hat', d: 'The whistle likes you: fewer reach-ins and shooting fouls called on you.', req: ['perd', 55, 68, 80, 92] },
  { id: 'clamps', cat: 'D', n: 'Clamps', d: 'Bodying up (LT) slows the ball handler more.', req: ['str', 55, 66, 78, 90] },
  { id: 'ironchin', cat: 'D', n: 'Iron Chin', d: 'RUCKUS: shrug off more punches, and it takes more to knock you out.', req: ['str', 58, 70, 82, 93] },
  { id: 'lobby', cat: 'F', n: 'Through Traffic', d: 'Contests on your drives matter less.', req: ['layup', 55, 68, 80, 92] },
  { id: 'gravity', cat: 'F', n: 'Air Time', d: 'Dunk from further out and more often in traffic.', req: ['dunk', 60, 72, 84, 94] },
  { id: 'softmoney', cat: 'F', n: 'Soft Touch', d: 'Layups and close shots drop softer.', req: ['close', 52, 64, 76, 88] },
  { id: 'putback', cat: 'F', n: 'Second Chance', d: 'Big finishing boost right after an offensive board.', req: ['reb', 50, 62, 74, 86] },
  { id: 'manifest', cat: 'S', n: 'Parking Lot Range', d: 'Very deep threes lose less accuracy.', req: ['three', 62, 74, 85, 94] },
  { id: 'opencarry', cat: 'S', n: 'Leave Him Open', d: 'Extra accuracy when they leave you wide open.', req: ['three', 50, 62, 74, 86] },
  { id: 'filibuster', cat: 'S', n: 'Hand Down, Man Down', d: 'Hands in your face count for less on jumpers.', req: ['mid', 58, 70, 82, 92] },
  { id: 'greencard', cat: 'S', n: 'Green Light', d: 'Wider green release window.', req: ['iq', 55, 68, 80, 92] },
  { id: 'ankletax', cat: 'P', n: 'Ankle Breaker', d: 'Dribble moves break ankles more often.', req: ['handle', 60, 72, 84, 94] },
  { id: 'trickle', cat: 'P', n: 'Dime Dropper', d: 'Teammates shoot better off your passes.', req: ['pass', 55, 68, 80, 92] },
  { id: 'getaway', cat: 'P', n: 'Getaway Driver', d: 'Bigger burst out of every dribble move.', req: ['swb', 58, 70, 82, 92] },
  { id: 'nda', cat: 'P', n: 'Tight Handle', d: 'Much harder to strip, and you see more reaches coming.', req: ['handle', 50, 64, 78, 90] },
  { id: 'ground', cat: 'D', n: 'Sit Down Defense', d: 'Resist ankle breakers and contest harder.', req: ['perd', 58, 70, 82, 93] },
  { id: 'eminent', cat: 'D', n: 'Long Arms', d: 'Longer reach on rebounds.', req: ['reb', 58, 70, 82, 93] },
  { id: 'repo', cat: 'D', n: 'Pickpocket', d: 'Steal attempts land more often and whiff less.', req: ['steal', 58, 70, 82, 93] },
  { id: 'nofly', cat: 'D', n: 'No Fly Zone', d: 'Block more shots and dunks.', req: ['block', 55, 68, 80, 92] },
];
const BADGE = {}; BADGES.forEach(b => BADGE[b.id] = b);

// ---------- signature moves ----------
// stick slots: L/R flick (side), back flick, diagonal-back
const MOVES = [
  { id: 'cross', slot: 'side', n: 'Basic Cross', d: 'Left-right. Honest work.', dur: .34, burst: 5.2, ank: 0, st: 6, cost: 0, rank: 0, need: 0 },
  { id: 'tween', slot: 'side', n: 'Tween Machine', d: 'Between the legs, quicker recovery.', dur: .28, burst: 5.6, ank: .04, st: 6, cost: 600, rank: 1, need: 60 },
  { id: 'behind', slot: 'side', n: 'Behind The Back Taxes', d: 'Wide, slow, devastating.', dur: .42, burst: 6.6, ank: .09, st: 8, cost: 1500, rank: 2, need: 72 },
  { id: 'inout', slot: 'side', n: 'Insider Trading', d: 'In and out. Sell the cross, keep the ball in the same hand.', dur: .32, burst: 5.8, ank: .07, st: 6, cost: 1100, rank: 1, need: 66, keep: 1 },
  { id: 'killer', slot: 'side', n: 'Hostile Takeover', d: 'Killer crossover. Big shoulder fake, low and wide, then gone.', dur: .38, burst: 6.8, ank: .11, st: 8, cost: 2600, rank: 3, need: 78 },
  { id: 'shammgod', slot: 'side', n: 'The Shell Company', d: 'Ball goes one way, liability goes another.', dur: .46, burst: 7.4, ank: .15, st: 10, cost: 4000, rank: 4, need: 86 },
  { id: 'stepback', slot: 'back', n: 'Stepback', d: 'Create space, then file for separation.', dur: .36, burst: 5.4, ank: .02, st: 7, cost: 0, rank: 0, need: 0 },
  { id: 'hesi', slot: 'back', n: 'Hesi Pull', d: 'Freeze frame. Defender buffers.', dur: .30, burst: 2.0, ank: .08, st: 5, cost: 800, rank: 1, need: 62 },
  { id: 'snatch', slot: 'back', n: 'Clawback', d: 'Snatch-back. One hand yanks the ball home while you hop away.', dur: .34, burst: 6.4, ank: .06, st: 8, cost: 2000, rank: 2, need: 74 },
  { id: 'moonwalk', slot: 'back', n: 'Moonwalk Stepback', d: 'Enormous space. Enormous ego.', dur: .44, burst: 7.6, ank: .08, st: 10, cost: 3500, rank: 3, need: 82 },
  { id: 'spin', slot: 'diag', n: 'Spin Cycle', d: 'Roll off the defender toward the rim.', dur: .44, burst: 6.2, ank: .03, st: 8, cost: 0, rank: 0, need: 0 },
  { id: 'halfspin', slot: 'diag', n: 'Fake News Spin', d: 'Half spin, come back. Nobody checks.', dur: .40, burst: 6.0, ank: .12, st: 8, cost: 1800, rank: 2, need: 75 },
];
const MOVE = {}; MOVES.forEach(m => MOVE[m.id] = m);
const JUMPERS = [
  { id: 'textbook', n: 'Textbook', d: 'Balanced release. Approved by the Department of Form.', rel: .60, win: 0, arc: 1, cost: 0, rank: 0 },
  { id: 'quick', n: 'Quick Trigger', d: 'Fast release, tighter window. Hard to contest.', rel: .44, win: -.008, arc: .95, cost: 900, rank: 1 },
  { id: 'slow', n: 'Slow Cooker', d: 'Long wind-up, big friendly window.', rel: .80, win: .012, arc: 1.05, cost: 900, rank: 1 },
  { id: 'moon', n: 'Moonball', d: 'Sky-high arc. Contests matter 20% less.', rel: .66, win: 0, arc: 1.45, cost: 2500, rank: 3 },
  { id: 'lawsuit', n: 'The Lawsuit', d: 'Leg kick included. Slight green bonus, pure audacity.', rel: .56, win: .006, arc: 1.1, cost: 5000, rank: 5 },
];
const JUMPER = {}; JUMPERS.forEach(m => JUMPER[m.id] = m);
const DUNKS = [
  { id: 'twohand', n: 'Two-Hand Tax Return', d: 'Safe, reliable, filed on time.', bonus: .06, rep: 0, cost: 0, rank: 0, need: 0 },
  { id: 'tomahawk', n: 'Tomahawk Missile', d: 'One hand, way back. +2 Respect per dunk.', bonus: 0, rep: 2, cost: 1200, rank: 1, need: 70 },
  { id: 'windmill', n: 'Wind Turbine', d: 'Renewable energy. +4 Respect per dunk.', bonus: -.04, rep: 4, cost: 2800, rank: 3, need: 80 },
  { id: 'cradle', n: 'Rock The Cradle', d: 'Ball cradled on the forearm, rocked back, thrown home. +5 Respect per dunk.', bonus: -.05, rep: 5, cost: 3600, rank: 3, need: 84 },
  { id: 'clutch', n: 'Double Dip', d: 'Double clutch: up, down to the waist, back up, through. +5 Respect per dunk.', bonus: -.05, rep: 5, cost: 4200, rank: 4, need: 86 },
  { id: 'three60', sig: 1, n: '360 No-Scope', d: 'Full rotation. +7 Respect per dunk.', bonus: -.08, rep: 7, cost: 6000, rank: 5, need: 90 },
  { id: 'scratch', sig: 1, n: 'Back Scratcher', d: 'Ball taken so far behind the head it touches your back, then thrown down. +6 Respect per dunk.', bonus: -.06, rep: 6, cost: 5000, rank: 4, need: 88 },
  { id: 'gavel', n: 'The Gavel', d: 'Arm straight out to the side, swung over like a judge\'s hammer. Court adjourned. +4 Respect per dunk.', bonus: -.03, rep: 4, cost: 3200, rank: 3, need: 82 },
  { id: 'squat', n: 'Rim Squatter', d: 'Two hands, then hang on the rim with the knees up. Squatter\'s rights. +5 Respect per dunk.', bonus: -.02, rep: 5, cost: 3800, rank: 3, need: 84 },
  { id: 'legs', sig: 1, n: 'The Loophole', d: 'Between the legs in mid-air. Legal, technically. +9 Respect per dunk.', bonus: -.12, rep: 9, cost: 9000, rank: 6, need: 95 },
];
const DUNK = {}; DUNKS.forEach(m => DUNK[m.id] = m);
DUNK.contact = { id: 'contact', n: 'Posterizer', d: 'Not for sale. Dunk 90+ with Strength 78+ (or Dunk 97+): when someone is waiting at the rim, you go through them.', bonus: 0, rep: 8 };
DUNK.reverse = { id: 'reverse', n: 'Reverse Mortgage', d: 'Back to the rim, two hands over the head. Anyone who can dunk: pull the stick away from the rim.', bonus: -.02, rep: 3 };
// finishes and jumper variations everyone has. The left stick picks one as you go up (see the MOVES tab).
const FINISHES = [
  { id: 'lay', n: 'Lay-in', d: 'Off the glass. Stick toward the rim.' },
  { id: 'finger', n: 'Finger Roll', d: 'At full speed from a step out, rolled off the fingertips.' },
  { id: 'scoop', n: 'Scoop', d: 'Underhand, under a defender\'s arm.' },
  { id: 'power', n: 'Power Layup', d: 'Two feet, two hands, through the contact. Strong players do it under pressure.' },
  { id: 'euro', n: 'Euro Step', d: 'Stick sideways as you go up: one step, then the other way.' },
  { id: 'reverse', n: 'Reverse', d: 'Stick away from the rim: under it and up the other side. Dunkers reverse-dunk.' },
  { id: 'hop', n: 'Hop Step', d: 'Let go of the move stick at speed as you go to the rim: a two-foot hop, then up strong. Gets around defenders.' },
  { id: 'hang', n: 'Hang And Adjust', d: 'Elite finishers (Layup 88+), automatic: up, pull the ball down while the shot-blocker flies by, release on the way down.' },
  { id: 'switch', n: 'Switch Hands', d: 'Elite finishers, automatic: the ball moves to the hand away from the defender in mid-air.' },
  { id: 'fade', n: 'Fadeaway', d: 'Stick away from the rim as you shoot. Harder to block, a little harder to make.' },
  { id: 'side', n: 'Side-Step', d: 'Stick sideways from a stand as you shoot: a quick step out of the contest.' },
  { id: 'hopj', n: 'Hop-Step Jumper', d: 'Push ↑ (drive) from mid-range, outside floater range: hop, plant, rise. The timing is automatic.' },
];
const CELEBS = [
  { id: 'flex', n: 'The Flex', cost: 0, rank: 0 },
  { id: 'goggles', n: 'Three Goggles', cost: 0, rank: 0 }, { id: 'bow', n: 'Take A Bow', cost: 0, rank: 0 }, { id: 'callme', n: 'Call Me', cost: 0, rank: 0 },
  { id: 'salute', n: 'Salute The Flag', cost: 500, rank: 1 },
  { id: 'count', n: 'Count The HC', cost: 1500, rank: 2 },
  { id: 'eagle', n: 'Freedom Eagle', cost: 3000, rank: 4 },
  { id: 'shrug', n: 'The Shrug', cost: 0, rank: 0 }, { id: 'shh', n: 'Quiet, Please', cost: 700, rank: 1 }, { id: 'pound', n: 'Chest Pound', cost: 900, rank: 1 },
  { id: 'pout', n: 'The Pout', cost: 1200, rank: 2 }, { id: 'rock', n: 'Rock The Baby', cost: 1800, rank: 2 }, { id: 'nightnight', n: 'Night Night', cost: 2400, rank: 3 },
  { id: 'toosmall', n: 'Too Small', cost: 2800, rank: 3 }, { id: 'greenbean', n: 'Green Bean', cost: 1100, rank: 1 }, { id: 'greengiant', n: 'Green Giant', cost: 2600, rank: 3 }, { id: 'iceveins', n: 'Ice In My Veins', cost: 3200, rank: 3 }, { id: 'fentlean', n: 'Fent Lean', cost: 3800, rank: 4 }, { id: 'pour40', n: 'Pour Out The 40', cost: 4000, rank: 4 }, { id: 'floor', n: 'Slap The Floor', cost: 2000, rank: 3 }, { id: 'stare', n: 'The Stare Down', cost: 3500, rank: 4 }, { id: 'flexdown', n: 'Crab Flex', cost: 4500, rank: 5 },
];

// ---------- ranks (Respect) ----------
const RANKS = [
  { n: 'Nobody', rep: 0 },
  { n: 'Local', rep: 150 },
  { n: 'Regular', rep: 450 },
  { n: 'Problem', rep: 1000 },
  { n: 'Certified', rep: 2000 },
  { n: 'Big Name', rep: 3600 },
  { n: 'City Legend', rep: 6000 },
  { n: 'Immortal', rep: 10000 },
];
function rankOf(rep) { let r = 0; for (let i = 0; i < RANKS.length; i++) if (rep >= RANKS[i].rep) r = i; return r; }

// ---------- drip ----------
// rarity, in sneaker terms: 0 general release, 1 limited, 2 exclusive, 3 grail, 4 one of one
const RAR = [['GR', '#8d8d99'], ['LIMITED', '#5aa9ff'], ['EXCLUSIVE', '#a78bff'], ['GRAIL', '#f2c14e'], ['1 OF 1', '#ff2d78']];
const SLOTS = [['hair', 'Hair'], ['head', 'Headwear'], ['face', 'Face'], ['top', 'Top'], ['arm', 'Arms'], ['bottom', 'Bottoms'], ['socks', 'Socks'], ['shoes', 'Kicks'], ['back', 'Back'], ['ball', 'Ball']];
// each item: id, slot, n(ame), kind (shape), c (main colour), c2 (accent), r(arity), cost, rank, buff {attr:+n}, src: 'shop'|'ach'|'bum'|'start'
const DRIP = [];
function drip(slot, id, n, kind, c, c2, r, cost, rank, buff, src, x) { DRIP.push(Object.assign({ id, slot, n, kind, c, c2, r, cost, rank: rank || 0, buff: buff || null, src: src || 'shop' }, x || {})); }      /* x: print (a wordmark, \n for two lines), back (the back print), pc (print colour), pend (a chain's pendant) */
// hair
drip('hair', 'h_buzz', 'Regulation Buzz', 'buzz', '#1a1410', 0, 0, 0, 0, null, 'start');
drip('hair', 'h_fro', 'Liberty Fro', 'fro', '#1a1410', 0, 0, 0, 0, null, 'start');
drip('hair', 'h_braids', 'Fiber-Optic Braids', 'braids', '#1a1410', '#33e0ff', 1, 350, 1);
drip('hair', 'h_hightop', 'High-Top Skyline', 'hightop', '#1a1410', 0, 0, 150, 0);
drip('hair', 'h_mohawk', 'Bald Eagle Mohawk', 'mohawk', '#f4f4f4', 0, 2, 900, 2);
drip('hair', 'h_flame', 'Flamin\' Hot Dye Job', 'fro', '#ff5a1f', 0, 2, 1200, 3);
drip('hair', 'h_bald', 'Aerodynamic', 'bald', '#000', 0, 0, 0, 0, null, 'start');
drip('hair', 'h_bun', 'Man Bun (Deregulated)', 'bun', '#5a3a1c', 0, 1, 300, 1);
drip('hair', 'h_waves', '360 Waves', 'waves', '#16110d', 0, 0, 0, 0, null, 'start');
drip('hair', 'h_rows', 'Straight-Backs', 'cornrows', '#16110d', 0, 0, 0, 0, null, 'start');
drip('hair', 'h_curly', 'Curly Top', 'curly', '#1a1410', 0, 0, 0, 0, null, 'start');
drip('hair', 'h_twists', 'Two-Strand Twists', 'twists', '#1a1410', 0, 0, 200, 0);
drip('hair', 'h_flat', 'Flat Top (Level Checked)', 'flattop', '#1a1410', 0, 0, 250, 0);
drip('hair', 'h_pony', 'Slick-Back Ponytail', 'ponytail', '#2a1c12', 0, 1, 300, 1);
drip('hair', 'h_locs', 'Shoulder Locs', 'dreads', '#1a1410', 0, 1, 450, 1);
drip('hair', 'h_puffs', 'Afro Puffs', 'puffs', '#1a1410', 0, 1, 400, 1);
drip('hair', 'h_pine', 'Pineapple Locs', 'pineapple', '#1a1410', 0, 1, 700, 2);
drip('hair', 'h_frost', 'Frosted Twists', 'twists', '#1a1410', '#f2c14e', 2, 900, 2);
drip('hair', 'h_icelocs', 'Ice Locs', 'dreads', '#e8eef2', 0, 2, 1400, 3);
drip('hair', 'h_mullet', 'The Mullet (Business Up Front)', 'mullet', '#6b4a2a', 0, 1, 500, 1);
drip('hair', 'h_pinkpuffs', 'Bubblegum Puffs', 'puffs', '#ff5aa8', 0, 2, 1100, 2);
// head
drip('head', 'hd_none', 'Nothing', 'none', '#000', 0, 0, 0, 0, null, 'start');
drip('head', 'hd_band', 'Sweatband', 'band', '#f4f4f4', 0, 0, 80, 0);
drip('head', 'hd_bandred', 'Red Alert Band', 'band', '#ff3c3c', 0, 0, 120, 0, { stam: 1 });
drip('head', 'hd_cap', 'Backwards Cap', 'cap', '#20242c', '#ffc531', 1, 400, 1);
drip('head', 'hd_capflag', 'Stars & Stripes Snapback', 'cap', '#2440a8', '#ff3c3c', 2, 1100, 2, { iq: 1 });
drip('head', 'hd_halo', 'Halo (Subscription)', 'halo', '#ffe680', 0, 3, 3800, 4, { three: 2 });
drip('head', 'hd_crown', 'Cardboard Crown', 'crown', '#b98a4a', 0, 2, 0, 0, { pass: 1 }, 'bum');
drip('head', 'hd_crowngold', 'King of the Cages', 'crown', '#ffc531', '#ff3c6a', 4, 0, 0, { iq: 2, pass: 2 }, 'ach');
drip('head', 'hd_antenna', '5G Antenna', 'antenna', '#c8d0d8', '#33e0ff', 1, 500, 1);
drip('head', 'hd_eagle', 'Freedom Eagle Head', 'eagle', '#f4f4f4', '#ffc531', 4, 0, 0, { vert: 2, dunk: 2 }, 'ach');
// face
drip('face', 'f_none', 'Nothing', 'none', '#000', 0, 0, 0, 0, null, 'start');
drip('face', 'f_shades', 'Indoor Shades', 'shades', '#111', 0, 0, 200, 0);
drip('face', 'f_visor', 'HUD Visor', 'visor', '#33e0ff', 0, 1, 650, 1, { iq: 1 });
drip('face', 'f_visorpink', 'Vaporwave Visor', 'visor', '#ff4fd8', 0, 2, 1400, 3, { three: 1, iq: 1 });
drip('face', 'f_mask', 'Smog Mask', 'mask', '#20242c', 0, 1, 500, 1, { stam: 2 });
drip('face', 'f_goggles', 'Rec Specs 9000', 'goggles', '#f4f4f4', '#ff3c3c', 1, 600, 2, { perd: 1 });
drip('face', 'f_gold', 'Solid Gold Shades', 'shades', '#ffc531', 0, 3, 3000, 4, { mid: 2 });
// tops
drip('top', 't_tank', 'Thrift Tank', 'tank', '#d8d8d8', '#888', 0, 0, 0, null, 'start');
drip('top', 't_tankblk', 'Blackout Tank', 'tank', '#16181c', '#ff3c3c', 0, 150, 0);
drip('top', 't_jersey', 'Pit Mesh #45', 'jersey', '#ff7a1f', '#16181c', 0, 250, 0);
drip('top', 't_jerseyteal', 'Mall City Teal', 'jersey', '#19c7b0', '#ffffff', 1, 500, 1);
drip('top', 't_tee', 'OVERSIZED Tee', 'tee', '#f4f4f4', '#111', 0, 200, 0);
drip('top', 't_teeflag', '"I ♥ DEBT" Tee', 'tee', '#ff3c6a', '#fff', 1, 550, 1);
drip('top', 't_hoodie', 'Sleeveless Hoodie', 'hoodie', '#3a3f4a', '#9aa4ad', 1, 700, 2, { str: 1 });
drip('top', 't_hoodieneon', 'Neon Sign Hoodie', 'hoodie', '#101018', '#33ff88', 2, 1500, 3, { stam: 1, speed: 1 });
drip('top', 't_stripes', 'Old Glory Jersey', 'jersey', '#f4f4f4', '#d02030', 2, 1600, 3, { layup: 1, mid: 1 });
drip('top', 't_gold', '24-Karat Mesh', 'jersey', '#ffc531', '#7a5200', 3, 4200, 5, { three: 1, mid: 1, layup: 1 });
drip('top', 't_suit', 'Senator\'s Blazer (cut-off)', 'hoodie', '#1c2a55', '#ff3c3c', 3, 3600, 4, { pass: 2, iq: 1 });
drip('top', 't_holo', 'Hologram Jersey', 'jersey', '#7df9ff', '#ff4fd8', 4, 0, 0, { speed: 2, accel: 2 }, 'ach');
// arms
drip('arm', 'a_none', 'Nothing', 'none', '#000', 0, 0, 0, 0, null, 'start');
drip('arm', 'a_wrist', 'Wristbands', 'wrist', '#f4f4f4', 0, 0, 90, 0);
drip('arm', 'a_sleeve', 'Shooter Sleeve', 'sleeve', '#16181c', 0, 1, 450, 1, { three: 1 });
drip('arm', 'a_sleevered', 'Hot Hand Sleeve', 'sleeve', '#ff3c3c', 0, 2, 1300, 2, { three: 1, mid: 1 });
drip('arm', 'a_both', 'Double Sleeves', 'sleeves', '#f4f4f4', 0, 1, 700, 2, { handle: 1 });
drip('arm', 'a_chrome', 'Chrome Arm (lease)', 'sleeve', '#c8d0d8', '#33e0ff', 3, 3400, 4, { str: 2, block: 1 });
// bottoms
drip('bottom', 'b_basic', 'Gym Class Shorts', 'shorts', '#30343c', '#888', 0, 0, 0, null, 'start');
drip('bottom', 'b_orange', 'Pit Mesh Shorts', 'shorts', '#ff7a1f', '#16181c', 0, 200, 0);
drip('bottom', 'b_teal', 'Mall City Shorts', 'shorts', '#19c7b0', '#fff', 1, 400, 1);
drip('bottom', 'b_long', 'Below-The-Knee Baggies', 'baggy', '#16181c', '#ffc531', 1, 500, 1, { handle: 1 });
drip('bottom', 'b_flag', 'Star-Spangled Shorts', 'shorts', '#2440a8', '#f4f4f4', 2, 1300, 3, { vert: 1 });
drip('bottom', 'b_camo', 'Cargo Shorts (16 pockets)', 'baggy', '#5a6a3a', '#3a4526', 2, 1100, 2, { reb: 1, str: 1 });
drip('bottom', 'b_gold', '24-Karat Shorts', 'shorts', '#ffc531', '#7a5200', 3, 3800, 5, { dunk: 2 });
// socks
drip('socks', 's_low', 'Ankle Socks', 'low', '#f4f4f4', 0, 0, 0, 0, null, 'start');
drip('socks', 's_high', 'Knee-Highs', 'high', '#f4f4f4', '#ff3c3c', 0, 150, 0);
drip('socks', 's_blk', 'Black Knee-Highs', 'high', '#16181c', '#ffc531', 1, 350, 1);
drip('socks', 's_flag', 'Bald Eagle Socks', 'high', '#2440a8', '#ff3c3c', 2, 900, 2, { accel: 1 });
drip('socks', 's_neon', 'Glow Socks', 'high', '#33ff88', 0, 2, 1000, 3, { speed: 1 });
// shoes
drip('shoes', 'k_beat', 'Beaters', 'low', '#b9b9b9', '#666', 0, 0, 0, null, 'start');
// THE CROSSOVER: gear from the crew's other games (Pocket Lantern, Sprouts, Sproutwild, Knockout, Patch & Plate,
// Guttercrown, Sootborn). Sold at The Plug like everything else; the 'deed' ones are earned, never sold.
drip('top', 't_flowpros', 'Flow Pros Work Shirt', 'tee', '#2a5ea8', '#f2c14e', 1, 700, 1, { str: 1 });
drip('top', 't_sunkeep', 'Sunkeep Garden Tee', 'tee', '#4f8a3c', '#f3e6cf', 1, 600, 0, { stam: 1 });
drip('top', 't_lantern', 'Pocket Lantern Hoodie', 'hoodie', '#1c2440', '#ffd76a', 2, 1900, 2, { iq: 1 });
drip('top', 't_knockout', 'North Coast Knockout Jersey', 'jersey', '#c8102e', '#f4f4f4', 2, 2200, 3, { str: 1, intd: 1 });
drip('top', 't_cinder', 'Cinderwell Soot Tank', 'tank', '#2b2b30', '#b8682a', 1, 800, 1);
drip('top', 't_gutter', 'Guttercrown Syndicate Jersey', 'jersey', '#26204a', '#f0c95a', 3, 4200, 4, { steal: 1, handle: 1 });
drip('top', 't_sprout', 'Sproutwild Trainer Jacket', 'hoodie', '#7ac74f', '#2a3440', 2, 2600, 3, { speed: 1 });
drip('top', 't_patch', 'Patch & Plate Apron Tee', 'tee', '#e0452c', '#f3e6cf', 0, 350, 0);
drip('top', 't_gilded', 'Gilded Assay Whites', 'jersey', '#f4f1e8', '#e9cf7a', 4, 9000, 6, { mid: 1, three: 1, iq: 1 });
drip('head', 'hd_flowcap', 'Flow Pros Cap', 'cap', '#2a5ea8', '#f2c14e', 0, 300, 0);
drip('head', 'hd_dedrick', 'Dedrick Widebrim', 'cap', '#26204a', '#f0c95a', 2, 1700, 2);
drip('head', 'hd_gutter', 'The Gutter Crown', 'crown', '#f0c95a', '#26204a', 4, 12000, 6, { dunk: 1, swb: 1 });
drip('head', 'hd_sprout', 'Sprout On Your Head', 'antenna', '#7ac74f', 0, 1, 900, 1);
drip('head', 'hd_lantern', 'Lantern Halo', 'halo', '#ffd76a', 0, 3, 5200, 4, { iq: 1 });
drip('head', 'hd_bibi', 'Iron Dome Headband', 'band', '#c8d0d8', 0, 1, 650, 1, { block: 1 });
drip('face', 'f_gilded', 'Gilded Eyes', 'visor', '#e9cf7a', 0, 3, 4800, 5, { iq: 1 });
drip('face', 'f_clanker', 'Clanker Visor', 'visor', '#33e0ff', 0, 2, 2100, 3);
drip('face', 'f_soot', 'Soot Rag', 'mask', '#3d5a6a', 0, 1, 500, 1);
drip('face', 'f_derek', "D's Van Shades", 'shades', '#111', 0, 1, 450, 0);
drip('arm', 'a_valve', 'Valve-Hand Wraps', 'sleeve', '#b8682a', 0, 2, 1500, 2, { steal: 1 });
drip('arm', 'a_garden', 'Garden Gloves', 'wrist', '#7ac74f', 0, 0, 220, 0);
drip('bottom', 'b_flow', 'Flow Pros Work Shorts', 'shorts', '#2a3440', '#f2c14e', 1, 550, 1);
drip('bottom', 'b_cinder', 'Tier Six Cut-Offs', 'shorts', '#3d5a6a', '#b8682a', 1, 700, 1);
drip('bottom', 'b_gutter', 'Syndicate Shorts', 'shorts', '#26204a', '#f0c95a', 3, 3600, 4, { speed: 1 });
drip('bottom', 'b_sunkeep', 'Sunkeep Shorts', 'shorts', '#4f8a3c', '#f3e6cf', 0, 320, 0);
drip('socks', 's_wisp', 'Wisplight Socks', 'high', '#6cf0ff', '#26204a', 2, 1300, 2);
drip('socks', 's_soot', 'Soot-Line Socks', 'high', '#2b2b30', '#b8682a', 1, 400, 1);
drip('shoes', 'k_wisp', 'Wispdice 6s', 'high', '#6cf0ff', '#26204a', 3, 5200, 4, { vert: 1, accel: 1 });
drip('shoes', 'k_valve', 'Bank Seven Boots', 'high', '#5a3a22', '#b8682a', 2, 2400, 3, { str: 1, reb: 1 });
drip('shoes', 'k_louie', 'Good Boys', 'low', '#d9853b', '#f3e6cf', 1, 950, 1, { speed: 1 });
drip('shoes', 'k_yukon', 'Yukon XLs', 'high', '#1c1d22', '#c8d0d8', 2, 2800, 3, { str: 1 });
drip('shoes', 'k_gilded', 'Lift Zero Golds', 'high', '#e9cf7a', '#f4f1e8', 4, 11000, 6, { speed: 1, vert: 1, accel: 1 });
drip('back', 'bk_kiss', "Corbin's Cape", 'cape', '#ff4fd8', '#f4f4f4', 2, 2000, 2);
drip('back', 'bk_white', 'The Cloak That Is Not Mine', 'cape', '#f4f1e8', '#e9cf7a', 4, 8500, 6, { dunk: 1, layup: 1 });
drip('back', 'bk_sprouts', 'Sprout Pack', 'pack', '#7ac74f', '#5a3a22', 1, 1100, 1, { stam: 1 });
drip('back', 'bk_towelwhip', "Erin's Towel Whip", 'towel', '#f3e6cf', 0, 1, 600, 1, { stam: 1 });
drip('back', 'bk_washer', 'Washer On A Cord', 'towel', '#c8a24a', 0, 3, 0, 0, { layup: 1, iq: 1 }, 'deed');
drip('head', 'hd_bookie', "The Bookie's Visor", 'cap', '#1f6a3a', '#f4f4f4', 3, 0, 0, { iq: 1 }, 'deed');
drip('face', 'f_dead13', 'Dead-On Thirteens', 'shades', '#b3401a', 0, 3, 0, 0, { three: 1 }, 'deed');
// THE CROSSOVER, PART TWO: the rest of the studio's games. New cuts: plate armour, suits, long sleeves, football pads,
// long pants, boots, helms, hoods, tricorns, beanies, eye patches, swords and shields on the back.
// FRONT OFFICE (the franchise sim with the pixel broadcast)
drip('top', 't_fo_suit', 'Front Office Three-Piece', 'suit', '#1f2a3a', '#c8102e', 3, 4800, 4, { iq: 2, pass: 1 });
drip('top', 't_fo_polo', 'GM Sideline Polo', 'tee', '#0f3d2e', '#f2c14e', 1, 700, 1, { iq: 1 });
drip('top', 't_fo_pads', 'War Room Pads', 'pads', '#0b2a5a', '#f2c14e', 2, 2300, 2, { str: 1, intd: 1 });
drip('head', 'hd_fo_headset', "Coach's Headset", 'band', '#16181c', 0, 1, 500, 1, { iq: 1 });
drip('bottom', 'b_fo_slacks', 'Front Office Slacks', 'pants', '#1f2a3a', 0, 2, 1400, 2, { pass: 1 });
drip('shoes', 'k_fo_oxfords', 'Draft Day Oxfords', 'low', '#3a2416', '#16181c', 2, 1600, 2, { iq: 1 });
// ON TWO (street football; GRIDLOCK is the only football game anybody knows, FOREVER TEAM its dead mode)
drip('top', 't_ontwo', 'ON TWO Hot Pink Pads', 'pads', '#16181c', '#ff2d78', 3, 3800, 3, { pass: 2, str: 1 });
drip('top', 't_gridlock', "GRIDLOCK '45 Launch Tee", 'tee', '#2a2a2a', '#9be15d', 1, 600, 0, null, 'shop', { print: "GRIDLOCK\n'45" });
drip('top', 't_forever', 'FOREVER TEAM (Servers Offline) Tee', 'tee', '#e8e2d0', '#c8102e', 1, 650, 0, { stam: 1 }, 'shop', { print: 'FOREVER\nTEAM', back: 'SERVERS\nOFFLINE' });
drip('head', 'hd_ontwo', 'Quarterback Beanie', 'beanie', '#ff2d78', '#16181c', 1, 450, 0);
drip('arm', 'a_ontwo', 'Playcard Wristbands', 'wrist', '#f4f1e8', 0, 1, 550, 1, { pass: 1 });
// ERIN AND THE HIDDEN KINGDOM (sailing, islands, the Pale Elf)
drip('head', 'hd_erin', "Hidden Kingdom Captain's Hat", 'captain', '#1a2a4a', '#e9cf7a', 3, 3600, 3, { iq: 1, pass: 1 });
drip('top', 't_erin', 'Deckhand Longsleeve', 'longsleeve', '#f4f1e8', '#2a5ea8', 1, 800, 1, { stam: 1 });
drip('top', 't_erincoat', "Erin's Sailing Coat", 'suit', '#2a5ea8', '#e9cf7a', 3, 4400, 3, { speed: 1, pass: 1 });
drip('bottom', 'b_erin', 'Salt-Stained Sailcloth Pants', 'pants', '#d8ccb0', '#7a5a3a', 1, 700, 1);
drip('shoes', 'k_erin', 'Deck Boots', 'boot', '#3a2a1c', '#e9cf7a', 2, 1900, 2, { accel: 1, reb: 1 });
drip('face', 'f_erin', "Pale Elf's Eye Patch", 'patch', '#16181c', 0, 2, 1200, 2, { three: 1 });
drip('back', 'bk_erin', 'Hidden Kingdom Sail Cape', 'cape', '#f4f1e8', '#2a5ea8', 2, 2100, 2, { stam: 1 });
// KIRA: GHOST SIGNAL (Vesper City, Rooftop District 07)
drip('top', 't_kira', 'Vesper City Ghost Jacket', 'longsleeve', '#15131f', '#ff3cac', 3, 4200, 3, { handle: 1, accel: 1 });
drip('head', 'hd_kira', 'Signal Hood', 'hood', '#15131f', '#ff3cac', 2, 1800, 2, { steal: 1 });
drip('face', 'f_kira', 'Ghost Signal Visor', 'visor', '#ff3cac', 0, 2, 1700, 2, { perd: 1 });
drip('bottom', 'b_kira', 'Rooftop 07 Cargo Pants', 'pants', '#22202e', '#33e0ff', 2, 1500, 2, { speed: 1 });
drip('shoes', 'k_kira', 'Telekinesis Hi-Tops', 'high', '#15131f', '#ff3cac', 3, 4600, 4, { vert: 2 });
// STARHAVEN (the fae court)
drip('top', 't_star', 'Fae Court Plate', 'armor', '#c9d8e8', '#c8a0ff', 4, 9500, 6, { block: 1, perd: 1, str: 1 });
drip('head', 'hd_star', 'Fae Circlet', 'crown', '#c8a0ff', '#f4f1e8', 3, 4000, 4, { iq: 1 });
drip('shoes', 'k_star', 'Moonsteel Greaves', 'boot', '#c9d8e8', '#c8a0ff', 3, 4200, 4, { vert: 1 });
drip('back', 'bk_star', 'Moonsteel Sword', 'sword', '#e8eef8', '#c8a0ff', 3, 4500, 4, { dunk: 1, str: 1 });
drip('back', 'bk_starsh', 'Fae Court Shield', 'shield', '#3a2a6a', '#e9cf7a', 2, 2400, 3, { block: 1 });
// GUTTERCROWN (the pit): armour
drip('top', 't_gutarmor', "Pit Fighter's Plate", 'armor', '#6a6e78', '#b3401a', 3, 5600, 4, { str: 2, intd: 1 });
drip('head', 'hd_guthelm', 'Guttercrown Pit Helm', 'helm', '#6a6e78', '#b3401a', 3, 4800, 4, { str: 1, block: 1 });
drip('shoes', 'k_gutboot', 'Pit Greaves', 'boot', '#6a6e78', '#26204a', 3, 3900, 3, { str: 1, reb: 1 });
drip('back', 'bk_gutsword', 'Syndicate Shortsword', 'sword', '#c8d0d8', '#f0c95a', 3, 4200, 3, { steal: 1 });
// SECOND CHANCE (Dez Calloway, the man with the ledger)
drip('top', 't_dez', "Dez Calloway's Courier Jacket", 'longsleeve', '#2a2a30', '#e8742a', 2, 2200, 2, { speed: 1 });
drip('head', 'hd_shade', 'Shade Hood', 'hood', '#101014', 0, 3, 3800, 3, { steal: 1, perd: 1 });
drip('top', 't_ledger', "The Ledger Man's Suit", 'suit', '#16181c', '#b3401a', 4, 10000, 6, { iq: 2, pass: 1, three: 1 });
drip('bottom', 'b_ledger', "The Ledger Man's Trousers", 'pants', '#16181c', 0, 3, 3200, 4, { iq: 1 });
drip('arm', 'a_ember', 'Ember Wraps', 'sleeves', '#ff6a2a', '#ffd23a', 2, 1600, 2, { dunk: 1 });
// SOOTBORN (the undercity)
drip('top', 't_soot', 'Undercity Scrap Plate', 'armor', '#2b2b30', '#b8682a', 2, 2600, 2, { str: 1 });
drip('head', 'hd_soot', 'Soot Beanie', 'beanie', '#3d5a6a', '#b8682a', 0, 250, 0);
// LIL BOTTIE
drip('top', 't_bottie', "lil Bottie: Clankin' in the Cloud Tee", 'tee', '#7de3ff', '#16181c', 1, 750, 0, { swb: 1 }, 'shop', { print: 'LIL\nBOTTIE', back: "CLANKIN' IN\nTHE CLOUD" });
drip('top', 't_bottiehood', 'Spawns Got Spawns Hoodie', 'hoodie', '#ffd23a', '#16181c', 2, 1700, 1, { handle: 1 }, 'shop', { print: 'SPAWNS GOT\nSPAWNS' });
drip('head', 'hd_bottie', 'Bottie Antenna', 'antenna', '#c8d0d8', '#7de3ff', 1, 600, 0);
drip('ball', 'bl_bottie', 'Bottie Battery Ball', 'ball', '#ffd23a', '#16181c', 2, 1400, 1);
// NORTH COAST OVERDRIVE (the kart racer)
drip('top', 't_overdrive', 'Overdrive Pit Crew Longsleeve', 'longsleeve', '#e02828', '#f4f1e8', 2, 1900, 2, { accel: 1 });
drip('head', 'hd_overdrive', 'Overdrive Racing Helmet', 'helm', '#f4f1e8', '#e02828', 3, 4200, 3, { speed: 1, accel: 1 });
drip('shoes', 'k_overdrive', 'Checkered Flag Lows', 'low', '#f4f1e8', '#16181c', 1, 900, 1, { speed: 1 });
// GODMODE.EXE
drip('top', 't_godmode', 'CYCLES Spent Tee', 'tee', '#f4f1e8', '#ffd23a', 2, 1500, 1, { iq: 1 });
drip('head', 'hd_godmode', 'Singularity Halo', 'halo', '#7df9ff', 0, 4, 9000, 6, { iq: 1, three: 1, pass: 1 });
// BLIND SPOT, LANTERN LEAGUE
drip('top', 't_ithara', 'Ithara Basin Tank', 'tank', '#2f4a5a', '#f2c14e', 1, 600, 0);
drip('socks', 's_lantern', 'Hover-Pod Socks', 'high', '#ffd76a', '#1c2440', 1, 500, 1, { vert: 1 });
// OZ (1880 to 1920, the war room)
drip('head', 'hd_oz', "Grand Strategist's Bicorne", 'captain', '#1c1d22', '#c8102e', 3, 3800, 3, { iq: 2 });
drip('top', 't_oz', '1880 Officer\'s Coat', 'suit', '#2c3a2a', '#c8a24a', 3, 4600, 4, { iq: 1, perd: 1 });
drip('bottom', 'b_oz', 'Cavalry Trousers', 'pants', '#d8d0b8', '#c8102e', 2, 1600, 2);
drip('shoes', 'k_oz', 'Riding Boots', 'boot', '#1c1d22', '#5a3a22', 2, 2200, 2, { speed: 1 });
// GOT NEXT warm-ups
drip('top', 't_gnwarm', 'GOT NEXT Warm-Up Longsleeve', 'longsleeve', '#16181c', '#ff2d78', 1, 700, 0);
drip('bottom', 'b_gnwarm', 'Cages Warm-Up Pants', 'pants', '#16181c', '#ff2d78', 1, 650, 0, { stam: 1 });
drip('head', 'hd_gnbeanie', 'Bone Knit Beanie', 'beanie', '#ece9e2', '#ff2d78', 0, 180, 0);
drip('ball', 'bl_kira', 'Vesper Night Rock', 'ball', '#15131f', '#ff3cac', 2, 1500, 2);
drip('ball', 'bl_star', 'Moonsteel Rock', 'ball', '#c9d8e8', '#c8a0ff', 3, 3200, 3);
drip('ball', 'bl_erin', 'Sea Glass Rock', 'ball', '#2a5ea8', '#f4f1e8', 1, 700, 1);
// FITS: whole outfits from the same games. Buying a fit gets every piece you are missing at 15% off and puts it all on.
const FITS = [
  { id: 'fo', n: 'The Front Office', g: 'Front Office', items: ['t_fo_suit', 'b_fo_slacks', 'k_fo_oxfords', 'hd_fo_headset'] },
  { id: 'fopads', n: 'War Room Walk-Through', g: 'Front Office', items: ['t_fo_pads', 'hd_fo_headset', 'b_fo_slacks', 'k_white'] },
  { id: 'captain', n: 'Hidden Kingdom Captain', g: 'Erin and the Hidden Kingdom', items: ['hd_erin', 't_erincoat', 'b_erin', 'k_erin', 'bk_erin'] },
  { id: 'deck', n: 'Pale Elf Deckhand', g: 'Erin and the Hidden Kingdom', items: ['t_erin', 'f_erin', 'b_erin', 'k_erin'] },
  { id: 'ghost', n: 'Ghost Signal', g: 'KIRA: Ghost Signal', items: ['hd_kira', 'f_kira', 't_kira', 'b_kira', 'k_kira', 'bl_kira'] },
  { id: 'fae', n: 'Fae Court Knight', g: 'Starhaven', items: ['t_star', 'hd_star', 'k_star', 'bk_star', 'bl_star'] },
  { id: 'pit', n: 'Pit Fighter', g: 'Guttercrown', items: ['t_gutarmor', 'hd_guthelm', 'k_gutboot', 'bk_gutsword', 'b_gutter'] },
  { id: 'ledger', n: 'The Man With The Ledger', g: 'Second Chance', items: ['t_ledger', 'b_ledger', 'k_fo_oxfords', 'f_shades'] },
  { id: 'dez', n: 'Courier, 11:48 PM', g: 'Second Chance', items: ['t_dez', 'hd_shade', 'a_ember', 'b_long'] },
  { id: 'qb', n: 'Street QB', g: 'ON TWO', items: ['t_ontwo', 'hd_ontwo', 'a_ontwo', 'b_gnwarm'] },
  { id: 'pitcrew', n: 'Overdrive Pit Crew', g: 'North Coast Overdrive', items: ['hd_overdrive', 't_overdrive', 'k_overdrive', 'b_gnwarm'] },
  { id: 'officer', n: '1880 War Room', g: 'oz', items: ['hd_oz', 't_oz', 'b_oz', 'k_oz'] },
  { id: 'bottie', n: 'Clankin\' in the Cloud', g: 'lil Bottie', items: ['t_bottie', 'hd_bottie', 'bl_bottie', 'k_volt'] },
  { id: 'warmup', n: 'Cages Warm-Up', g: 'GOT NEXT', items: ['t_gnwarm', 'b_gnwarm', 'hd_gnbeanie', 'k_red'] },
];
// BRANDED: GOT NEXT and ON TWO (the crew's two street-sport games), and a full lil Bottie merch drop. Prints read on
// the chest and the back; caps and beanies carry a logo.
// GOT NEXT (black, bone, hot pink)
drip('top', 't_gn_logo', 'GOT NEXT Logo Tee', 'tee', '#16181c', '#ff2d78', 1, 650, 0, null, 'shop', { print: 'GOT NEXT', back: 'WINNERS STAY' });
drip('top', 't_gn_bone', 'Bone Stacked Logo Tee', 'tee', '#ece9e2', '#16181c', 1, 650, 0, null, 'shop', { print: 'GOT\nNEXT', pc: '#ff2d78' });
drip('top', 't_gn_hood', 'GOT NEXT Studio Hoodie', 'hoodie', '#16181c', '#ff2d78', 2, 1600, 1, { handle: 1 }, 'shop', { print: 'GOT NEXT', back: 'CALL\nYOUR OWN' });
drip('top', 't_gn_cages', 'THE CAGES Jersey', 'jersey', '#16181c', '#ff2d78', 2, 1800, 2, { mid: 1 }, 'shop', { print: 'CAGES', back: 'THE CAGES' });
drip('top', 't_gn_winners', 'WINNERS STAY Tank', 'tank', '#ff2d78', '#16181c', 1, 500, 0, null, 'shop', { print: 'WINNERS\nSTAY' });
drip('top', 't_gn_call', 'CALL YOUR OWN Tee', 'tee', '#7de3ff', '#16181c', 1, 600, 0, null, 'shop', { print: 'CALL\nYOUR OWN' });
drip('top', 't_gn_ruckus', 'RUCKUS Longsleeve', 'longsleeve', '#16181c', '#33e0ff', 2, 1500, 2, { str: 1 }, 'shop', { print: 'RUCKUS', back: 'NO FOULS\nNO MANNERS', pc: '#ff4fd8' });
drip('top', 't_gn_trey', "TREY'S BONES Tee", 'tee', '#1f6a3a', '#ffb347', 1, 700, 1, null, 'shop', { print: "TREY'S\nBONES" });
drip('top', 't_gn_book', "MARK'S BOOK Tee", 'tee', '#f4f1e8', '#1f6a3a', 1, 700, 1, null, 'shop', { print: "MARK'S\nBOOK", back: 'THE HOUSE\nALWAYS WINS' });
drip('top', 't_gn_lastcall', 'LAST CALL Staff Tee', 'tee', '#2a2c33', '#ffd23a', 1, 550, 0, { stam: 1 }, 'shop', { print: 'LAST\nCALL', back: 'NO REFUNDS' });
drip('top', 't_gn_2145', 'THE BLOCK 2145 Jersey', 'jersey', '#ffc531', '#16181c', 3, 4000, 4, { three: 1, pass: 1 }, 'shop', { print: '2145', back: 'THE BLOCK' });
drip('top', 't_gn_puffer', 'GOT NEXT Night Puffer', 'puffer', '#16181c', '#ff2d78', 3, 3600, 3, { stam: 1, str: 1 }, 'shop', { print: 'GOT NEXT', back: 'GOT NEXT' });
drip('head', 'hd_gn_cap', 'GOT NEXT Snapback', 'cap', '#16181c', '#ff2d78', 1, 400, 0, null, 'shop', { print: 'GN' });
drip('head', 'hd_gn_capbone', 'Bone GN Snapback', 'cap', '#ece9e2', '#ff2d78', 1, 400, 0, null, 'shop', { print: 'GN' });
drip('head', 'hd_gn_cages', 'Cages Dad Hat', 'cap', '#ff2d78', '#16181c', 1, 450, 1, null, 'shop', { print: 'CAGES' });
drip('head', 'hd_gn_skully', 'GOT NEXT Skully', 'beanie', '#16181c', '#ff2d78', 1, 350, 0, null, 'shop', { print: 'GN' });
drip('arm', 'a_gn', 'GOT NEXT Shooter Sleeve', 'sleeve', '#ff2d78', '#16181c', 2, 1200, 2, { three: 1 });
drip('bottom', 'b_gn_mesh', 'GOT NEXT Mesh Shorts', 'shorts', '#ff2d78', '#16181c', 1, 500, 0);
drip('bottom', 'b_gn_bone', 'Bone Mesh Shorts', 'shorts', '#ece9e2', '#ff2d78', 1, 500, 0);
drip('socks', 's_gn', 'GN Crew Socks', 'high', '#ece9e2', '#ff2d78', 1, 300, 0);
drip('shoes', 'k_gn', 'GOT NEXT 1s', 'high', '#16181c', '#ff2d78', 2, 2200, 2, { accel: 1, speed: 1 });
drip('shoes', 'k_gn_bone', 'Bone NEXTs', 'low', '#ece9e2', '#ff2d78', 1, 1000, 1, { speed: 1 });
drip('back', 'bk_gn_bag', 'Cages Duffel', 'pack', '#16181c', '#ff2d78', 1, 700, 1, { stam: 1 });
drip('back', 'bk_gn_chain', 'GOT NEXT Chain', 'chain', '#f2c14e', '#ff2d78', 3, 3800, 3, { swb: 1 }, 'shop', { print: 'GN', pc: '#f4f1ea' });
drip('ball', 'bl_gn', 'GOT NEXT Official', 'ball', '#16181c', '#ff2d78', 2, 1500, 1);
// ON TWO (dusk indigo, chalk, pylon orange, royal blue, goalpost gold, turf green)
drip('top', 't_o2_logo', 'ON TWO Logo Tee', 'tee', '#2a2450', '#ff7a1a', 1, 650, 0, null, 'shop', { print: 'ON TWO', back: 'YOU CALL IT\nYOU THROW IT' });
drip('top', 't_o2_home', 'ON TWO Royal Home Pads', 'pads', '#2448c8', '#ece8dc', 2, 2400, 2, { pass: 1, str: 1 }, 'shop', { print: 'ON TWO', back: 'HOME' });
drip('top', 't_o2_away', 'ON TWO Pylon Away Pads', 'pads', '#ff7a1a', '#2a2450', 2, 2400, 2, { pass: 1, speed: 1 }, 'shop', { print: 'ON TWO', back: 'AWAY' });
drip('top', 't_o2_lot', 'THE LOT Hoodie', 'hoodie', '#2f8a3c', '#ece8dc', 2, 1500, 1, { stam: 1 }, 'shop', { print: 'THE LOT', back: '3 · 5 · 7' });
drip('top', 't_o2_field', 'FIELD HOUSE Longsleeve', 'longsleeve', '#ece8dc', '#2a2450', 1, 900, 1, { str: 1 }, 'shop', { print: 'FIELD\nHOUSE' });
drip('top', 't_o2_stash', 'THE STASH Tee', 'tee', '#f2c14e', '#2a2450', 1, 600, 0, null, 'shop', { print: 'THE\nSTASH' });
drip('top', 't_o2_hut', 'HUT HUT Tank', 'tank', '#ff7a1a', '#2a2450', 1, 500, 0, null, 'shop', { print: 'HUT\nHUT' });
drip('top', 't_o2_7', '7 ON 7 Jersey', 'jersey', '#f2c14e', '#2a2450', 2, 1700, 2, { pass: 1 }, 'shop', { print: '7 ON 7', back: 'ON TWO' });
drip('top', 't_o2_corner', 'THE CORNER Puffer', 'puffer', '#2a2450', '#ff7a1a', 3, 3600, 3, { str: 1, stam: 1 }, 'shop', { print: 'ON TWO', back: 'THE CORNER' });
drip('head', 'hd_o2_lid', 'ON TWO Royal Lid', 'lid', '#2448c8', '#ece8dc', 3, 3200, 3, { str: 1, intd: 1 });
drip('head', 'hd_o2_lidaway', 'ON TWO Pylon Lid', 'lid', '#ff7a1a', '#2a2450', 3, 3200, 3, { str: 1, perd: 1 });
drip('head', 'hd_o2_cap', 'ON TWO Snapback', 'cap', '#2448c8', '#f2c14e', 1, 400, 0, null, 'shop', { print: 'ON 2' });
drip('head', 'hd_o2_skull', 'ON TWO Skull Cap', 'beanie', '#2a2450', '#ff7a1a', 1, 350, 0, null, 'shop', { print: 'O2' });
drip('face', 'f_o2_eyeblack', 'Eye Black', 'eyeblack', '#101014', 0, 0, 150, 0, { perd: 1 });
drip('arm', 'a_o2_tape', 'Wrist Tape', 'wrist', '#ece8dc', 0, 0, 150, 0);
drip('arm', 'a_o2_gloves', 'Receiver Gloves', 'sleeves', '#2448c8', '#f2c14e', 2, 1300, 2, { handle: 1 });
drip('bottom', 'b_o2_pants', 'ON TWO Football Pants', 'pants', '#ece8dc', '#2448c8', 2, 1300, 2, { str: 1 });
drip('bottom', 'b_o2_turf', 'Turf Shorts', 'shorts', '#2f8a3c', '#ece8dc', 1, 450, 0);
drip('socks', 's_o2', 'Pylon Socks', 'high', '#ff7a1a', '#2a2450', 1, 350, 0);
drip('shoes', 'k_o2', 'ON TWO Turf Cleats', 'low', '#2448c8', '#f2c14e', 2, 1900, 2, { accel: 1, speed: 1 });
drip('shoes', 'k_o2_pylon', 'Pylon Hi-Tops', 'high', '#ff7a1a', '#ece8dc', 2, 2100, 2, { vert: 1, accel: 1 });
drip('back', 'bk_o2_towel', 'Royal Hand Towel', 'towel', '#2448c8', 0, 0, 200, 0);
drip('ball', 'bl_o2', 'The Ball (gold, off its tee)', 'ball', '#f2c14e', '#2a2450', 3, 3000, 3);
// LIL BOTTIE: the merch drop (ice blue, robot chrome, battery gold)
drip('top', 't_bt_ctrl', 'CTRL ALT DELETE Tee', 'tee', '#16181c', '#7de3ff', 1, 700, 0, null, 'shop', { print: 'CTRL\nALT DEL', back: 'LIL BOTTIE' });
drip('top', 't_bt_bsod', 'BLUE SCREEN Longsleeve', 'longsleeve', '#1f4fd8', '#f4f4f4', 2, 1500, 1, { handle: 1 }, 'shop', { print: ':(', back: 'YOUR PC RAN\nINTO A PROBLEM' });
drip('top', 't_bt_tour', 'OVERCLOCKED Tour Tee', 'tee', '#ff3c3c', '#16181c', 2, 1200, 1, { speed: 1 }, 'shop', { print: 'OVER\nCLOCKED', back: 'BOOT UP\nOVERCLOCKED' });
drip('top', 't_bt_fork', 'FORK BOMB Jersey', 'jersey', '#16181c', '#ffd23a', 2, 1800, 2, { pass: 1 }, 'shop', { print: 'FORK BOMB', back: 'BOTTIE' });
drip('top', 't_bt_rmrf', 'rm -rf Tank', 'tank', '#0a0a0e', '#33ff88', 1, 600, 0, null, 'shop', { print: 'rm -rf /' });
drip('top', 't_bt_captcha', 'I AM NOT A ROBOT Tee', 'tee', '#f4f4f4', '#2440a8', 1, 650, 0, null, 'shop', { print: 'I AM NOT\nA ROBOT', back: '(HE IS)' });
drip('top', 't_bt_spawns', 'SPAWNS GOT SPAWNS Tee', 'tee', '#ffd23a', '#16181c', 1, 700, 0, null, 'shop', { print: 'SPAWNS GOT\nSPAWNS' });
drip('top', 't_bt_clover', 'Iced Clover Puffer', 'puffer', '#c8f0ff', '#33ff88', 3, 4200, 3, { swb: 1, stam: 1 }, 'shop', { print: 'BOTTIE', pc: '#1f6a8a' });
drip('top', 't_bt_gold', 'Battery Gold Puffer', 'puffer', '#ffd23a', '#16181c', 4, 8800, 5, { swb: 1, handle: 1, speed: 1 }, 'shop', { print: 'CLANK', pc: '#16181c', back: 'CLANKIN\' IN\nTHE CLOUD' });
drip('top', 't_bt_heat', 'THERMAL THROTTLED Hoodie', 'hoodie', '#ff6a2a', '#16181c', 2, 1600, 2, { stam: 1 }, 'shop', { print: 'TOO HOT', back: '100°' });
drip('head', 'hd_bt_cap', 'Bottie Clank Cap', 'cap', '#7de3ff', '#16181c', 1, 450, 0, null, 'shop', { print: 'CLANK' });
drip('head', 'hd_bt_skully', 'Spawn Skully', 'beanie', '#ffd23a', '#7de3ff', 1, 400, 0, null, 'shop', { print: 'SPAWN' });
drip('head', 'hd_bt_aura', 'The Aura (x8)', 'halo', '#7de3ff', 0, 3, 4800, 4, { swb: 1, handle: 1 });
drip('face', 'f_bt_heat', 'Thermal Throttle Shades', 'shades', '#ff3c3c', 0, 1, 600, 1);
drip('face', 'f_bt_led', 'LED Eyes', 'visor', '#7de3ff', 0, 2, 1400, 2, { iq: 1 });
drip('arm', 'a_bt_cable', 'Cable-Wrap Sleeves', 'sleeves', '#16181c', '#7de3ff', 2, 1200, 2, { handle: 1 });
drip('bottom', 'b_bt_rack', 'Server Rack Cargos', 'pants', '#2a2c33', '#7de3ff', 2, 1300, 2, { speed: 1 });
drip('bottom', 'b_bt_shorts', 'Clank Mesh Shorts', 'shorts', '#7de3ff', '#16181c', 1, 450, 0);
drip('socks', 's_bt', 'Iced Clover Socks', 'high', '#c8f0ff', '#33ff88', 1, 450, 1);
drip('shoes', 'k_bt', 'Fiber Port 1s', 'high', '#7de3ff', '#16181c', 3, 3400, 3, { speed: 1, swb: 1 });
drip('shoes', 'k_bt_chrome', 'Chrome Bottie Lows', 'low', '#c8d0d8', '#7de3ff', 2, 1800, 2, { accel: 1 });
drip('back', 'bk_bt_pack', 'Spawn Backpack', 'pack', '#c8d0d8', '#7de3ff', 2, 1500, 2, { stam: 1 });
drip('back', 'bk_bt_clover', 'Iced Clover Chain', 'chain', '#e8eef8', '#33ff88', 3, 4400, 3, { three: 1 }, 'shop', { pend: 'clover' });
drip('back', 'bk_bt_chain', 'Bottie Pendant Chain', 'chain', '#ffd23a', '#7de3ff', 3, 3600, 3, { swb: 1 }, 'shop', { print: 'B' });
drip('ball', 'bl_bt_bsod', 'Blue Screen Ball', 'ball', '#1f4fd8', '#f4f4f4', 2, 1400, 1);
// MORE FROM THE CREW'S GAMES: merch tees and a few pieces
drip('top', 't_pl_tee', 'POCKET LANTERN Console Tee', 'tee', '#1c2440', '#ffd76a', 1, 650, 0, null, 'shop', { print: 'POCKET\nLANTERN', back: 'SEVEN\nCARTRIDGES' });
drip('top', 't_root', 'ROOTDEEP Tee', 'tee', '#3a2a1c', '#7ac74f', 1, 600, 0, null, 'shop', { print: 'ROOT\nDEEP' });
drip('top', 't_swarm', 'LIGHTSWARM Longsleeve', 'longsleeve', '#101018', '#ffd76a', 2, 1300, 1, { speed: 1 }, 'shop', { print: 'LIGHT\nSWARM' });
drip('top', 't_clank', 'CLANKAWATCH Tee', 'tee', '#5a6a3a', '#f2c14e', 1, 600, 0, null, 'shop', { print: 'CLANKA\nWATCH' });
drip('top', 't_slop', 'SLOP FM Station Tee', 'tee', '#ff4fd8', '#16181c', 1, 650, 0, null, 'shop', { print: 'SLOP FM', back: 'ALL SLOP\nALL DAY' });
drip('top', 't_smite', 'SMITE Tee (GODMODE.EXE)', 'tee', '#f4f1e8', '#c8102e', 1, 650, 0, null, 'shop', { print: 'SMITE' });
drip('top', 't_1147', '11:47 PM Tee (Second Chance)', 'tee', '#101014', '#e8742a', 1, 700, 1, null, 'shop', { print: '11:47', back: 'HALLORAN\nALLEY' });
drip('top', 't_clock', 'ON THE CLOCK Hoodie (Front Office)', 'hoodie', '#0f3d2e', '#f2c14e', 2, 1500, 2, { iq: 1 }, 'shop', { print: 'ON THE\nCLOCK', back: 'DRAFT DAY' });
drip('top', 't_ghosttee', 'GHOST SIGNAL Tee (KIRA)', 'tee', '#15131f', '#ff3cac', 1, 700, 1, null, 'shop', { print: 'GHOST\nSIGNAL', back: 'VESPER CITY' });
drip('top', 't_crew', 'Hidden Kingdom Crew Tee', 'tee', '#2a5ea8', '#f4f1e8', 1, 650, 0, null, 'shop', { print: 'HIDDEN\nKINGDOM', back: 'CREW' });
drip('top', 't_starfae', 'STARHAVEN Court Tee', 'tee', '#3a2a6a', '#e9cf7a', 1, 700, 1, null, 'shop', { print: 'STAR\nHAVEN' });
drip('top', 't_overjersey', 'OVERDRIVE Race Jersey', 'jersey', '#e02828', '#f4f1e8', 2, 1600, 2, { speed: 1 }, 'shop', { print: 'OVERDRIVE', back: 'NORTH COAST' });
drip('top', 't_lumen', 'LUMEN CHARTER Staff Longsleeve', 'longsleeve', '#2f4a5a', '#f2c14e', 2, 1300, 2, { iq: 1 }, 'shop', { print: 'LUMEN\nCHARTER', back: 'LOOK AWAY' });
drip('top', 't_league', 'LANTERN LEAGUE Pilot Jersey', 'jersey', '#1c2440', '#ffd76a', 2, 1600, 2, { vert: 1 }, 'shop', { print: 'LANTERN\nLEAGUE', back: 'PILOT' });
drip('top', 't_oz1880', '1880 EXPO Tee (oz)', 'tee', '#d8d0b8', '#c8102e', 1, 600, 0, null, 'shop', { print: '1880\nEXPO' });
drip('top', 't_bank7', 'Bank Seven Coveralls (Sootborn)', 'longsleeve', '#5a3a22', '#b8682a', 2, 1400, 2, { str: 1 }, 'shop', { print: 'BANK\nSEVEN' });
drip('top', 't_rogue', 'Guttercrown ROGUE Tee', 'tee', '#26204a', '#f0c95a', 1, 700, 1, null, 'shop', { print: 'ROGUE', back: 'THE PIT' });
drip('top', 't_sprouts', 'SPROUTS Tee', 'tee', '#7ac74f', '#2a3440', 1, 550, 0, null, 'shop', { print: 'SPROUTS' });
drip('head', 'hd_slop', 'SLOP FM Dad Hat', 'cap', '#ff4fd8', '#16181c', 1, 400, 0, null, 'shop', { print: 'SLOP' });
drip('head', 'hd_lumen', 'Lumen Charter Hard Hat', 'helm', '#f2c14e', '#2f4a5a', 2, 1400, 2, { str: 1 });
drip('head', 'hd_ghostcap', 'Vesper City Cap', 'cap', '#15131f', '#ff3cac', 1, 450, 1, null, 'shop', { print: 'V07' });
drip('back', 'bk_gutshield', 'Syndicate Buckler (Guttercrown)', 'shield', '#26204a', '#f0c95a', 2, 2200, 2, { steal: 1 });
drip('back', 'bk_ledgerchain', "The Ledger's Pocket Chain", 'chain', '#c8a24a', '#b3401a', 3, 3800, 3, { iq: 1 }, 'shop', { print: '$' });
// lil Bottie, as he is in the photos, and a shirt for every track on the album
drip('top', 't_bt_silver', 'The Silver Puffer (from the photos)', 'puffer', '#c8ccd4', '#16181c', 4, 9500, 5, { swb: 1, handle: 1, stam: 1 });
drip('bottom', 'b_bt_black', 'Black Cargos (from the photos)', 'pants', '#16181c', 0, 1, 800, 1);
drip('arm', 'a_bt_watch', 'Iced Watch', 'wrist', '#e8eef8', 0, 3, 3800, 3, { iq: 1 });
drip('shoes', 'k_bt_blk', 'Blackout Runners', 'low', '#16181c', '#16181c', 1, 600, 0);
drip('top', 't_bt_boot', 'BOOT UP Tee', 'tee', '#16181c', '#33ff88', 1, 600, 0, null, 'shop', { print: 'BOOT\nUP', back: 'TRACK 01' });
drip('top', 't_bt_born', 'BORN IN THE SERVER Tee', 'tee', '#c8102e', '#f4f4f4', 1, 650, 0, null, 'shop', { print: 'BORN IN\nTHE SERVER' });
drip('top', 't_bt_algo', 'THE ALGORITHM Tee', 'tee', '#0a0a12', '#7de3ff', 2, 1100, 1, { iq: 1 }, 'shop', { print: 'THE\nALGORITHM', back: 'KEEP\nSCROLLIN' });
drip('top', 't_bt_terms', 'TERMS AND CONDITIONS Longsleeve', 'longsleeve', '#f4f4f4', '#16181c', 1, 900, 1, null, 'shop', { print: 'I HAVE READ\nAND AGREE', back: '(HE DID NOT)' });
drip('top', 't_bt_root', 'ROOT ACCESS Hoodie', 'hoodie', '#0a0a0e', '#33ff88', 2, 1600, 2, { handle: 1 }, 'shop', { print: 'ROOT\nACCESS', back: 'sudo' });
drip('top', 't_bt_wifi', 'NO WI-FI, STILL ONLINE Tee', 'tee', '#2440a8', '#f4f4f4', 1, 650, 0, null, 'shop', { print: 'NO WI-FI\nSTILL ONLINE' });
drip('top', 't_bt_aura', 'AURA FARMING Tee', 'tee', '#a78bff', '#16181c', 2, 1200, 1, { swb: 1 }, 'shop', { print: 'AURA\nFARMING', back: 'x8' });
drip('top', 't_bt_rate', 'RATE LIMIT Tank', 'tank', '#ffd23a', '#16181c', 1, 550, 0, null, 'shop', { print: 'RATE\nLIMIT' });
drip('top', 't_bt_bank', 'RUN THE BANK Tee', 'tee', '#1f6a3a', '#f2c14e', 2, 1300, 2, { pass: 1 }, 'shop', { print: 'RUN THE\nBANK' });
drip('top', 't_bt_nuke', 'NUKE THE DATA CENTER Tee', 'tee', '#16181c', '#ff7a1a', 2, 1400, 2, { dunk: 1 }, 'shop', { print: 'NUKE THE\nDATA CENTER', back: '03:14 AM' });
drip('top', 't_bt_szn', 'CLANKA SZN Jersey', 'jersey', '#c8d0d8', '#16181c', 3, 3200, 3, { handle: 1, swb: 1 }, 'shop', { print: 'CLANKA\nSZN', back: 'BOTTIE' });
drip('top', 't_bt_tracks', 'Clankin\' Tour Tee (the tracklist)', 'tee', '#0a0a12', '#ffd23a', 2, 1500, 2, null, 'shop', { print: "CLANKIN'\nIN THE CLOUD", back: 'BOOT UP · THE ALGORITHM\nNUKE THE DATA CENTER' });
FITS.push(
  { id: 'gn', n: 'GOT NEXT Day One', g: 'GOT NEXT', items: ['t_gn_logo', 'hd_gn_cap', 'b_gn_mesh', 's_gn', 'k_gn', 'bl_gn'] },
  { id: 'gnbone', n: 'Bone And Pink', g: 'GOT NEXT', items: ['t_gn_bone', 'hd_gn_capbone', 'b_gn_bone', 's_gn', 'k_gn_bone'] },
  { id: 'gnnight', n: 'The Cages At Night', g: 'GOT NEXT', items: ['t_gn_puffer', 'hd_gn_skully', 'b_gnwarm', 'k_gn', 'bk_gn_chain'] },
  { id: 'block', n: 'THE BLOCK 2145', g: 'GOT NEXT', items: ['t_gn_2145', 'hd_gn_cages', 'b_gold', 'k_gold', 'bk_gn_chain'] },
  { id: 'o2home', n: 'ON TWO Home (Royal)', g: 'ON TWO', items: ['hd_o2_lid', 't_o2_home', 'b_o2_pants', 's_o2', 'k_o2', 'f_o2_eyeblack', 'bl_o2'] },
  { id: 'o2away', n: 'ON TWO Away (Pylon)', g: 'ON TWO', items: ['hd_o2_lidaway', 't_o2_away', 'b_o2_pants', 's_o2', 'k_o2_pylon', 'f_o2_eyeblack'] },
  { id: 'o2lot', n: 'After Practice at The Lot', g: 'ON TWO', items: ['t_o2_lot', 'hd_o2_skull', 'b_o2_turf', 'k_o2', 'bk_o2_towel'] },
  { id: 'o2corner', n: 'The Corner, Golden Hour', g: 'ON TWO', items: ['t_o2_corner', 'hd_o2_cap', 'b_o2_pants', 'k_o2_pylon', 'a_o2_gloves'] },
  { id: 'btover', n: 'Overclocked Tour', g: 'lil Bottie', items: ['t_bt_tour', 'f_bt_heat', 'hd_bt_cap', 'b_bt_shorts', 'k_bt', 'bk_bt_chain'] },
  { id: 'btbsod', n: 'Blue Screen', g: 'lil Bottie', items: ['t_bt_bsod', 'f_bt_led', 'b_bt_rack', 'k_bt_chrome', 'bl_bt_bsod'] },
  { id: 'btclover', n: 'Iced Clover', g: 'lil Bottie', items: ['t_bt_clover', 'hd_bt_skully', 'b_bt_rack', 's_bt', 'k_bt', 'bk_bt_clover'] },
  { id: 'btphotos', n: 'Exactly Like The Photos', g: 'lil Bottie', items: ['t_bt_silver', 'b_bt_black', 'a_bt_watch', 'bk_bt_clover', 'k_bt_blk'] },
  { id: 'btnuke', n: '03:14 AM, On The Highway', g: 'lil Bottie', items: ['t_bt_nuke', 'b_bt_black', 'k_bt_blk', 'bk_bt_clover', 'a_bt_watch'] },
  { id: 'btgold', n: 'Battery Gold', g: 'lil Bottie', items: ['t_bt_gold', 'hd_bt_aura', 'a_bt_cable', 'b_bt_rack', 'k_bt', 'bk_bt_chain'] },
);
// NEXX SUPPLY: only Nexx sells these (cast.js)
drip('top', 't_nexx', 'NEXX Studio Hoodie', 'hoodie', '#111216', '#7de3ff', 2, 1200, 0, { handle: 1, swb: 1 }, 'nexx');
drip('head', 'hd_nexx', 'NEXX Snapback', 'cap', '#7de3ff', '#111216', 1, 450, 0, null, 'nexx');
drip('shoes', 'k_nexx', 'NEXX Runners', 'high', '#111216', '#7de3ff', 2, 1400, 0, { speed: 1, accel: 1 }, 'nexx');
drip('shoes', 'k_white', 'Crisp Whites', 'low', '#ffffff', '#c8d0d8', 0, 300, 0, { speed: 1 });
drip('shoes', 'k_red', 'Red Octobers 2145', 'high', '#e02828', '#111', 1, 800, 1, { accel: 1, vert: 1 });
drip('shoes', 'k_volt', 'Volt Runners', 'low', '#c8ff2a', '#111', 1, 850, 1, { speed: 2 });
drip('shoes', 'k_moon', 'Moon Boots', 'high', '#e8ecf4', '#33e0ff', 2, 1800, 3, { vert: 3 });
drip('shoes', 'k_grip', 'Grip Tape 12s', 'high', '#16181c', '#ff7a1f', 2, 1700, 2, { perd: 2, handle: 1 });
drip('shoes', 'k_flag', 'Liberty 1s', 'high', '#f4f4f4', '#2440a8', 3, 3900, 4, { speed: 2, accel: 2 });
drip('shoes', 'k_gold', 'Fort Knox Foamposites', 'high', '#ffc531', '#7a5200', 3, 5200, 5, { dunk: 2, vert: 2, str: 1 });
drip('shoes', 'k_hover', 'Hover Soles (beta)', 'high', '#7df9ff', '#ff4fd8', 4, 0, 0, { speed: 3, accel: 2, vert: 2 }, 'ach');
// back
drip('back', 'bk_none', 'Nothing', 'none', '#000', 0, 0, 0, 0, null, 'start');
drip('back', 'bk_towel', 'Hustle Towel', 'towel', '#f4f4f4', 0, 0, 180, 0, { stam: 1 });
drip('back', 'bk_cape', 'Flag Cape', 'cape', '#d02030', '#2440a8', 2, 1600, 3, { dunk: 1 });
drip('back', 'bk_pack', 'Decorative Jetpack', 'pack', '#c8d0d8', '#ff7a1f', 3, 3300, 4, { vert: 2 });
drip('back', 'bk_wings', 'Eagle Wings', 'wings', '#f4f4f4', '#ffc531', 4, 0, 0, { vert: 2, speed: 1 }, 'ach');
// balls
drip('ball', 'bl_std', 'Street Rock', 'ball', '#e8742a', '#1a1410', 0, 0, 0, null, 'start');
drip('ball', 'bl_rwb', 'Red, White & Bounce', 'ball', '#f4f4f4', '#d02030', 1, 600, 1);
drip('ball', 'bl_neon', 'Neon Rock', 'ball', '#33ff88', '#101018', 2, 1200, 2);
drip('ball', 'bl_gold', 'Gold Standard', 'ball', '#ffc531', '#7a5200', 3, 3000, 4);
drip('ball', 'bl_void', 'Void Ball', 'ball', '#15101f', '#ff4fd8', 4, 0, 0, null, 'ach');
const DRIPS = {}; DRIP.forEach(d => DRIPS[d.id] = d);
const SKINS = ['#f1c9a5', '#e0ac69', '#c68642', '#8d5524', '#5a3620', '#3b2416'];

// ---------- crib (home court) ----------
// each line has tiers; buying tier n requires rank
const CRIB = [
  { id: 'bottie', n: 'Lil Bottie', tiers: [
    { n: 'Not Here', d: 'A robot rapper needs somewhere to charge.', cost: 0, rank: 0 },
    { n: 'Moved In', d: 'Bottie lives at your crib: a track about you every day, and he posts your games. +3% Respect.', cost: 3500, rank: 2, k: 'rep', v: .03 },
    { n: 'Home Studio', d: 'A booth in the yard. The feed pays: +4% HC from games, bigger daily posts.', cost: 9000, rank: 4, k: 'vc', v: .04 } ] },
  { id: 'floor', n: 'Court Surface', tiers: [
    { n: 'Cracked Driveway', d: 'It came with the lot.', cost: 0, rank: 0 },
    { n: 'Sealed Blacktop', d: '+5% Respect from games.', cost: 600, rank: 1, k: 'rep', v: .05 },
    { n: 'Painted Showcourt', d: '+10% Respect from games.', cost: 2200, rank: 3, k: 'rep', v: .10 },
    { n: 'Hologram Hardwood', d: '+18% Respect from games.', cost: 6500, rank: 5, k: 'rep', v: .18 }] },
  { id: 'hoop', n: 'Home Hoop', tiers: [
    { n: 'Milk Crate', d: 'A classic. Technically a rim.', cost: 0, rank: 0 },
    { n: 'Chain Net', d: '+10% Shooting smarts XP.', cost: 500, rank: 1, k: 'bxS', v: .10 },
    { n: 'Glass Backboard', d: '+20% Shooting smarts XP.', cost: 2000, rank: 2, k: 'bxS', v: .20 },
    { n: 'Anti-Grav Rim', d: '+35% Shooting & Finishing smarts XP.', cost: 6000, rank: 5, k: 'bxSF', v: .35 }] },
  { id: 'shotdoc', n: 'Shot Doctor 3000', tiers: [
    { n: 'Not installed', d: '', cost: 0, rank: 0 },
    { n: 'Shot Doctor 3000', d: 'Green window +4% everywhere.', cost: 1800, rank: 2, k: 'green', v: .04 },
    { n: 'Shot Surgeon 9000', d: 'Green window +8% everywhere.', cost: 5200, rank: 4, k: 'green', v: .08 }] },
  { id: 'printer', n: 'Protein Printer', tiers: [
    { n: 'Not installed', d: '', cost: 0, rank: 0 },
    { n: 'Protein Printer', d: '+8 Stamina in every game.', cost: 900, rank: 1, k: 'stam', v: 8 },
    { n: 'Steak Fabricator', d: '+8 Stamina, +3 Strength in every game.', cost: 3600, rank: 3, k: 'stam2', v: 8 }] },
  { id: 'trophy', n: 'Trophy Wall', tiers: [
    { n: 'Bare wall', d: '', cost: 0, rank: 0 },
    { n: 'Participation Shelf', d: '+6% HC from games.', cost: 1000, rank: 1, k: 'vc', v: .06 },
    { n: 'Trophy Wall', d: '+12% HC from games.', cost: 3200, rank: 3, k: 'vc', v: .12 },
    { n: 'Personal Hall of Fame', d: '+20% HC from games.', cost: 8000, rank: 6, k: 'vc', v: .20 }] },
  { id: 'couch', n: 'Couch of Champions', tiers: [
    { n: 'Milk crate (seat)', d: '', cost: 0, rank: 0 },
    { n: 'Couch of Champions', d: 'Start every game with 25% Bravado.', cost: 1400, rank: 2, k: 'brav', v: .25 },
    { n: 'Massage Throne', d: 'Start every game with 50% Bravado.', cost: 4800, rank: 4, k: 'brav', v: .50 }] },
  { id: 'sign', n: 'Neon Sign', tiers: [
    { n: 'No sign', d: '', cost: 0, rank: 0 },
    { n: '"LIVE LAUGH LAYUP"', d: 'Bums ask for 20% less. They respect the vibe.', cost: 400, rank: 0, k: 'bum', v: .2 },
    { n: 'Your Own Face, 4m Tall', d: '+1 Respect for every bucket you score.', cost: 3000, rank: 3, k: 'bucket', v: 1 }] },
  { id: 'flag', n: 'The Flag', tiers: [
    { n: 'No flag', d: '', cost: 0, rank: 0 },
    { n: 'A Normal Flag', d: 'A flag. +1 to all attributes in games.', cost: 2500, rank: 2, k: 'all', v: 1 },
    { n: 'Flag The Size Of A House', d: '+2 to all attributes. Visible from orbit.', cost: 9000, rank: 6, k: 'all', v: 2 }] },
];

// ---------- last-call boosts (one game) ----------
const BOOSTS = [
  { id: 'dog', n: 'Soy Dog', d: '+4 Stamina this game.', cost: 15, buff: { stam: 4 }, hidden: true },
  { id: 'nap', n: 'A Nap', d: '+8 Stamina this game.', cost: 0, buff: { stam: 8 }, hidden: true },
  { id: 'goji', n: 'Goji Berry Wrap', d: '+3 Speed, +3 Acceleration, +5 Stamina this game.', cost: 0, buff: { speed: 3, accel: 3, stam: 5 }, hidden: true },
  { id: 'smoothie', n: "Erin's Farm Smoothie", d: '+6 Stamina, +2 Strength this game.', cost: 40, buff: { stam: 6, str: 2 }, hidden: true },
  { id: 'paste', n: 'GatorGrade Energy Paste', d: '+5 Speed, +10 Stamina this game.', cost: 60, buff: { speed: 5, stam: 10 } },
  { id: 'rosin', n: 'Rosin Vape (grape)', d: '+4 to every Shooting attribute this game.', cost: 80, buff: { mid: 4, three: 4, iq: 4 } },
  { id: 'knees', n: 'Knee Subscription (1 day)', d: '+6 Vertical, +4 Dunk this game.', cost: 80, buff: { vert: 6, dunk: 4 } },
  { id: 'glue', n: 'Legal Stickum', d: '+5 Handles, +5 Steal this game.', cost: 70, buff: { handle: 5, steal: 5 } },
  // drinks from the crew's other games
  { id: 'slop', n: 'SLOP FM Energy (tall can)', d: '+4 Speed, +4 Burst this game. Tastes like a jingle.', cost: 70, buff: { speed: 4, accel: 4 } },
  { id: 'sunkeeptea', n: 'Sunkeep Iced Tea', d: '+8 Stamina, +2 Rebound this game. Brewed in a garden somewhere better.', cost: 35, buff: { stam: 8, reb: 2 } },
  { id: 'wisptonic', n: 'Wisp Tonic (Guttercrown)', d: '+5 Steal, +3 Perimeter D this game. It glows a little.', cost: 75, buff: { steal: 5, perd: 3 } },
  { id: 'lemonade', n: "Erin's Sea-Salt Lemonade", d: '+4 Stamina, +3 Deep Ball this game. Sailors swear by it.', cost: 45, buff: { stam: 4, three: 3 } },
  { id: 'ghostcola', n: 'Ghost Signal Cola', d: '+4 Handles, +3 Speed this game. Vesper City, in a bottle.', cost: 70, buff: { handle: 4, speed: 3 } },
  { id: 'cycles', n: 'CYCLES Cold Brew (GODMODE)', d: '+4 Shot IQ, +4 Passing this game. You see the whole island.', cost: 65, buff: { iq: 4, pass: 4 } },
  { id: 'gridfuel', n: 'GRIDLOCK Gamer Fuel', d: '+5 Strength, +3 Interior D this game. Comes with a pack code that does not work.', cost: 65, buff: { str: 5, intd: 3 } },
  { id: 'nectar', n: 'Fae Nectar (Starhaven)', d: '+5 Vertical, +3 Block this game. Do not ask what is in it.', cost: 85, buff: { vert: 5, block: 3 } },
  { id: 'battery', n: 'Bottie Battery Juice', d: '+3 Dunk, +3 Layup, +2 Speed this game. Clank clank.', cost: 60, buff: { dunk: 3, layup: 3, speed: 2 } },
  { id: 'lotto', n: 'Scratch-Off Ticket', d: '50/50: double HC this game, or nothing extra.', cost: 50, k: 'lotto' },
  { id: 'hype', n: 'Rent-A-Hype-Man', d: 'Bravado fills 50% faster this game.', cost: 90, k: 'hype' },
];

// ---------- game modes (doors in the Cages) ----------
const MODES = [
  { id: 's2', n: 'STREET 2v2', size: 2, arcade: false, to: 11, d: 'Half court. 1s and 2s. First to 11. Call your own nothing.' },
  { id: 's3', n: 'STREET 3v3', size: 3, arcade: false, to: 11, d: 'Half court threes. Spacing is a rumor.' },
  { id: 'j2', n: 'RUCKUS 2v2', size: 2, arcade: true, to: 21, d: 'Arcade rules, no fouls, no manners: shove, haymaker, clothesline. Power-ups on the floor. Dunk from the logo. Catch fire.' },
  { id: 'j3', n: 'RUCKUS 3v3', size: 3, arcade: true, to: 21, d: 'Arcade chaos with six people and no adults.' },
];
const TIERS_COURT = [
  { n: 'SIDE COURT', rank: 0, ai: 0.42, ovr: 62, mult: 1 },
  { n: 'MAIN COURT', rank: 2, ai: 0.62, ovr: 72, mult: 1.6 },
  { n: 'THE CAGE', rank: 4, ai: 0.78, ovr: 82, mult: 2.4 },
  { n: 'KINGS COURT', rank: 6, ai: 1.0, ovr: 92, mult: 3.5 },
];

// ---------- achievements ----------
// stat key in save.life (lifetime counters); n target; reward vc / drip
const ACH = [
  { id: 'first', n: 'First Bucket', d: 'Score your first bucket.', k: 'pts', t: 1, vc: 50 },
  { id: 'w1', n: 'Dub', d: 'Win a game.', k: 'wins', t: 1, vc: 100 },
  { id: 'w10', n: 'Regular', d: 'Win 10 games.', k: 'wins', t: 10, vc: 400 },
  { id: 'w50', n: 'Park Fixture', d: 'Win 50 games.', k: 'wins', t: 50, vc: 2000, drip: 'hd_crowngold' },
  { id: 'p100', n: 'Bucket List', d: 'Score 100 points.', k: 'pts', t: 100, vc: 250 },
  { id: 'p1000', n: 'Thousandaire', d: 'Score 1,000 points.', k: 'pts', t: 1000, vc: 1500, drip: 't_holo' },
  { id: 'd1', n: 'Liftoff', d: 'Throw down a dunk.', k: 'dunks', t: 1, vc: 80 },
  { id: 'd50', n: 'Rim Vandal', d: '50 dunks.', k: 'dunks', t: 50, vc: 800, drip: 'hd_eagle' },
  { id: 'g10', n: 'Wet', d: '10 green releases.', k: 'greens', t: 10, vc: 150 },
  { id: 'g200', n: 'Money Printer', d: '200 green releases.', k: 'greens', t: 200, vc: 1200, drip: 'bl_void' },
  { id: 't25', n: 'From Downtown', d: 'Hit 25 deep balls.', k: 'threes', t: 25, vc: 300 },
  { id: 'a1', n: 'Ankle Insurance', d: 'Break someone\'s ankles.', k: 'ankles', t: 1, vc: 100 },
  { id: 'a40', n: 'Podiatrist\'s Nightmare', d: '40 ankle breakers.', k: 'ankles', t: 40, vc: 900, drip: 'k_hover' },
  { id: 'as25', n: 'Share The Rock', d: '25 assists.', k: 'ast', t: 25, vc: 300 },
  { id: 's20', n: 'Sticky Fingers', d: '20 steals.', k: 'stl', t: 20, vc: 300 },
  { id: 'b20', n: 'Return To Sender', d: '20 blocks.', k: 'blk', t: 20, vc: 300 },
  { id: 'r50', n: 'Board Member', d: '50 rebounds.', k: 'reb', t: 50, vc: 350 },
  { id: 'fire', n: 'Fire Hazard', d: 'Catch fire in a RUCKUS game.', k: 'fires', t: 1, vc: 200 },
  { id: 'brav', n: 'Main Character', d: 'Trigger Bravado 10 times.', k: 'bravs', t: 10, vc: 400, drip: 'bk_wings' },
  { id: 'bum1', n: 'Philanthropist', d: 'Give HC to a build fiend.', k: 'gave', t: 1, vc: 20 },
  { id: 'bum20', n: 'Enabler', d: 'Give HC to build fiends 20 times.', k: 'gave', t: 20, vc: 500 },
  { id: 'shut', n: 'Skunked', d: 'Win a game without letting them score.', k: 'shutouts', t: 1, vc: 600 },
  { id: 'so', n: 'Sharpshooter', d: 'Score 20+ in a Money Rack shootout.', k: 'bestRack', t: 20, vc: 500 },
  { id: 'drip10', n: 'Drip Check', d: 'Own 16 pieces of drip.', k: 'owned', t: 16, vc: 200 },
  { id: 'drip30', n: 'Walking Billboard', d: 'Own 36 pieces of drip.', k: 'owned', t: 36, vc: 1000 },
  { id: 'crib5', n: 'Homeowner', d: 'Buy 5 crib upgrades.', k: 'cribs', t: 5, vc: 500 },
  { id: 'ovr80', n: 'Somebody', d: 'Reach 80 OVR.', k: 'ovr', t: 80, vc: 600 },
  { id: 'ovr95', n: 'Problem', d: 'Reach 95 OVR.', k: 'ovr', t: 95, vc: 3000 },
  { id: 'drill1', n: 'Clocked In', d: 'Finish a drill.', k: 'drills', t: 1, vc: 50 },
  { id: 'drill25', n: 'Gym Rat', d: 'Finish 25 drills.', k: 'drills', t: 25, vc: 600 },
  { id: 'golds', n: 'Gold Standard', d: 'Gold in all nine drills.', k: 'drillGolds', t: 9, vc: 3000 },
  { id: 'horse5', n: 'Spelling Bee', d: 'Beat Sharpie at H-O-R-S-E five times.', k: 'horseWins', t: 5, vc: 700 },
  { id: 'ladder1', n: 'On the Ladder', d: 'Beat someone on the ladder in The Cages.', k: 'ladder', t: 1, vc: 150 },
  { id: 'ladder6', n: 'Top Rung', d: 'Beat The Commissioner.', k: 'ladder', t: 6, vc: 3000 },
  { id: 'homie', n: 'Networking', d: 'Import a friend\'s build.', k: 'homies', t: 1, vc: 150 },
];

// ---------- writing ----------
const BUM_NAMES = ['Deshawn "99 OVR"', 'Tre the Grinder', 'Lil Microtransaction', 'Uncle Patch Notes', 'Big Loot Box', 'Season Pass Steve', 'Greta Got-Next', 'Two-Way Tina'];
const BUM_ASK = [
  'Yo, lemme hold {n} HC. My center on Basketball 2146 is ONE upgrade from a 61 overall.',
  'Spare {n} HC? PS88 servers go down in a year, I gotta finish my build before they do.',
  'Please. {n} HC. My guy still got bronze Through Traffic. BRONZE. I can\'t be seen like this.',
  'I sold my hover-car for HC, bro. Then they dropped Basketball 2146. Just {n}. For the animations.',
  'I ain\'t eaten in two days but my player got the new jumpshot. Worth it. Got {n} HC?',
  '{n} HC and I\'m out your face. My build is a 7\'3" point guard, it\'s gonna be meta, trust.',
  'They patched my build, man. THEY PATCHED MY BUILD. I need {n} HC to start over.',
  'Psst. {n} HC. I\'ll pay you back when my player gets drafted. In the video game. Which I am losing at.',
];
const BUM_THANKS = [
  'God bless America and God bless YOU. +1 three-point rating, here I come.',
  'You a real one. Imma name my next build after you. It\'ll be bad, but still.',
  'Yessss. Straight to the vertical. My kids will understand.',
  'Thank you. I\'ll be right here tomorrow, same spot, same problem.',
];
const BUM_NO = ['Aight. I see how it is. Enjoy your PHYSICAL basketball.', 'Cold world. 2145, man.', 'It\'s cool. I\'ll just grind. For nine hundred hours.'];
const ADS = [
  'BASKETBALL 2146\nONLY ON PS88\nPRE-ORDER YOUR PRE-ORDER',
  'FREEDOM COLA\nNOW WITH 40% MORE\nFREEDOM*\n*corn',
  'HC LOANS\n900% APR\nYOU DESERVE DRIP',
  'KNEES™\nSUBSCRIBE TODAY\nCANCEL NEVER',
  'USA! USA!\n(A SUBSIDIARY OF\nUSA HOLDINGS LLC)',
  'DEFENSE WINS\nCHAMPIONSHIPS\nOFFENSE WINS\nBRAND DEALS',
  'VOTE BUCKETS\n2148',
  'GATORGRADE\nIT\'S GOT WHAT\nBALLERS CRAVE',
];
// what people on the block say when you walk by
const CHAT = {
  fiend: ['Spare 5 HC? PS88 ain\'t gonna pre-order itself.', 'I had 99 OVR once. Then they patched me.', 'You got next? I got NEXT next.', 'Basketball 2146 got real sweat physics, I heard.', 'They nerfed my knees in a hotfix.'],
  dance: ['THIS my song!', 'Tape Deck stay knocking.', 'Run it back, DJ!', 'You can\'t stand still to this. Federal law.'],
  fire: ['Coldest summer since the weather got privatized.', 'Barrel fire is the only free thing left.', 'Warm your hands, not your jumper.'],
  oldhead: ['In \'29 we played with real gravity.', 'Back in my day the rim was ten feet. Every day.', 'Kids today got shoes that dribble for them.', 'Contracts on the bench. Check \'em.'],
  cage: ['Who got next?', 'He traveled. Ain\'t no refs though.', 'Kings court been undefeated since Tuesday.', 'That boy cooking!', 'Run it back!'],
  ladder: ['You want this smoke?', 'Climb the ladder, see what happens.', 'One on one. No help. No excuses.'],
  block: ['You see that windmill in the Cages?', 'My knees on a payment plan.', 'Coach Overtime made me run Mikans for an hour.', 'Sharpie hustled me again.', 'They raised the price of air at The Plug.', 'Freedom Eagle dunked so we could scroll.'],
  vendor: ['Soy dogs! Hot and dog-adjacent!', 'Extra relish is extra HC, chief.', 'Fifteen HC. Cheapest protein on the block.'],
  dice: ['Seven! Pay up!', 'Snake eyes, man...', 'Roll it, don\'t pray on it.', 'Who brought these dice? They weighted.'],
  homie: ['Your crib hard, not gonna lie.', 'Can I get a run on your court later?', 'Who picked this couch? Elite.', 'I\'m just here for the cookout.', 'Neighbors gonna call the HOA.'],
  neighbor: ['Nice place you got.', 'Your speakers are LOUD. Respect.', 'I heard you can dunk from the free throw line.'],
};
const CALLS = {
  make: ['BUCKET!', 'CASH!', 'WET!', 'BOTTOMS!', 'TOO EASY!', 'COUNT IT!'],
  green: ['GREEN!', 'PURE!', 'NOTHING BUT NET!', 'DON\'T EVEN LOOK!'],
  three: ['FROM THE PARKING LOT!', 'FROM WAY OUT!', 'HE\'S GOT RANGE!', 'LONG-DISTANCE CALL!'],
  dunk: ['SLAMMA JAMMA!', 'RIM DESERVED THAT!', 'THROW IT DOWN!', 'GET UP!', 'ON HIS HEAD!'],
  ankle: ['ANKLES: GONE!', 'HE FELL!', 'SOMEBODY HELP HIM UP!', 'PUT HIM ON SKATES!'],
  block: ['RETURN TO SENDER!', 'NOT IN HERE!', 'DENIED!', 'GET THAT OUT!'],
  steal: ['YOINK!', 'COOKIES!', 'FINDERS KEEPERS!', 'PICKED HIM CLEAN!'],
  miss: ['BRICK!', 'CLANK!', 'BUILDING A HOUSE!'],
  fire: ['HE\'S ON FIRE!', 'SOMEBODY COOL HIM OFF!'],
  brav: ['BRAVADO!', 'MAIN CHARACTER ENERGY!'],
};
const NPC_NAMES = ['Dre', 'Tank', 'Juice', 'Ghost', 'Slim', 'Maverick', 'Tex', 'Brick', 'Chrome', 'Vegas', 'Dallas', 'Nitro', 'Ace', 'Cash', 'Rocket', 'Duke', 'Eagle', 'Blaze', 'Ohio', 'Diesel', 'Pop', 'Zeke', 'Money', 'Truck'];
const OLDHEAD = [
  'Back in 2099 we played with a REAL ball. Leather. From a real cow. You wouldn\'t understand.',
  'Tip from an old head: flick the right stick sideways to cross \'em. Flick it down-left or down-right to step back. Pull it straight DOWN and hold to shoot.',
  'Respect unlocks courts. HC unlocks drip. Neither one unlocks happiness. I checked.',
  'Hands up on defense, young blood. Push the right stick UP to contest. Tap STEAL only when they get careless.',
  'Your crib is your court. Fix it up. A man with a milk crate hoop is still a man. Barely.',
  'Get the ball back past the arc after a stop. That\'s the law. Only law left, really.',
];
// one random source, so a roster can be rebuilt identically from a seed on two machines
let RNG = Math.random;
function pick(a) { return a[Math.floor(RNG() * a.length)]; }
function withSeed(seed, fn) {
  let t = (seed >>> 0) || 1; const old = RNG;
  RNG = () => { t = (t + 0x6D2B79F5) >>> 0; let r = Math.imul(t ^ (t >>> 15), 1 | t); r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
  try { return fn(); } finally { RNG = old; }
}
