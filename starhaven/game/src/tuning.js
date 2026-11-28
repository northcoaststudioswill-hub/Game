// Starhaven — tuning data. Every feel number lives here (data, not code).
// Units: pixels and frames at 60 frames per second. One tile = 24 px.
(function (SH) {
  SH.TILE = 24;
  SH.VIEW_H = 320; // native height (a close camera so Wren reads on a phone); width follows the screen's shape

  // Movement. The in-game TUNE panel edits a copy of these.
  SH.TUNE_DEFAULTS = {
    runSpeed: 3.4,         // top run speed, px/frame (about 8.5 tiles a second)
    runAccelFrames: 3,     // frames from standing to full speed
    stopFrames: 3,         // frames from full speed to standing
    turnFrames: 4,         // frames to reverse direction at full speed
    airControl: 0.8,       // share of ground acceleration you keep in the air
    gravityUp: 0.42,       // gravity while rising
    gravityDown: 0.66,     // gravity while falling (firmer, so jumps don't float)
    apexFloat: 0.6,        // gravity multiplier near the top of a held jump
    maxFall: 9.5,
    jumpTiles: 4.2,        // held jump height, in tiles
    doubleJumpTiles: 2.9,  // second jump height, in tiles
    jumpCut: 0.42,         // letting go of jump early keeps this share of upward speed
    coyoteFrames: 6,       // you can still jump this long after running off a ledge
    jumpBufferFrames: 7,   // a jump pressed this early before landing still counts
    dashSpeed: 7.4,
    dashFrames: 12,
    dashCooldown: 30,      // 0.5 s, from the design doc
    dashIFrames: 18,       // 0.3 s of invincibility, from the design doc
    pogoBounce: 8.6,
  };

  // Labels and ranges for the TUNE panel.
  SH.TUNE_SLIDERS = [
    { key: 'runSpeed', label: 'Run speed', min: 2, max: 5.5, step: 0.1 },
    { key: 'runAccelFrames', label: 'Start-up (frames to full speed)', min: 1, max: 12, step: 1 },
    { key: 'stopFrames', label: 'Stopping (frames to stand still)', min: 1, max: 12, step: 1 },
    { key: 'airControl', label: 'Air control', min: 0.3, max: 1, step: 0.05 },
    { key: 'jumpTiles', label: 'Jump height (tiles)', min: 2.5, max: 6.5, step: 0.1 },
    { key: 'doubleJumpTiles', label: 'Double jump height (tiles)', min: 1.5, max: 5, step: 0.1 },
    { key: 'gravityUp', label: 'Rise gravity (lower = floatier)', min: 0.25, max: 0.8, step: 0.01 },
    { key: 'gravityDown', label: 'Fall gravity (higher = drops faster)', min: 0.35, max: 1.1, step: 0.01 },
    { key: 'dashSpeed', label: 'Dash speed', min: 5, max: 11, step: 0.1 },
    { key: 'dashFrames', label: 'Dash length (frames)', min: 6, max: 20, step: 1 },
    { key: 'pogoBounce', label: 'Pogo bounce', min: 6, max: 11, step: 0.1 },
  ];

  // Player settings (menu). autoDown: on touch, a strike in the air aims down when something is below.
  SH.settings = { autoDown: true };

  // Court gifts (DESIGN.md "Court gifts" and "Combat system": 3 moon pips to start; a cast costs 1;
  // pips refill slowly over time and quickly from dagger hits, which rewards getting close).
  SH.GIFTS = {
    flame: { cost: 1, speed: 5.6, life: 70, damage: 4, burn: 3, burnEvery: 40, cooldown: 22,
      // hold the button to charge a flame wave: two moons, pierces everything in its path
      chargeFrames: 32, waveCost: 2, waveDamage: 8, waveSpeed: 7.2 },
    pips: 3, regenFrames: 300, perHit: 0.34,
  };

  SH.PLAYER = {
    w: 14, h: 38,
    hearts: 5,
    hurtInvuln: 115,   // frames of flicker after a hit
    hurtStun: 14,     // frames you can't act after a hit
    hazardInvuln: 95,
  };

  // Daggers. active = [first, last] frame the blade can hit.
  SH.COMBAT = {
    damage: 2,
    attackBuffer: 8,
    ground: [
      { frames: 13, active: [2, 6], next: 7, lunge: 1.4, kb: 2.6, stop: 3, reach: 34, arc: 'high' },
      { frames: 13, active: [2, 6], next: 7, lunge: 1.4, kb: 2.6, stop: 3, reach: 34, arc: 'low' },
      { frames: 20, active: [3, 8], next: 99, lunge: 2.6, kb: 6.0, stop: 5, reach: 40, arc: 'big', finisher: true },
    ],
    air: [
      { frames: 12, active: [2, 6], next: 7, lunge: 0, kb: 2.6, stop: 3, reach: 36, arc: 'high' },
      { frames: 14, active: [2, 7], next: 99, lunge: 0, kb: 4.5, stop: 4, reach: 38, arc: 'low', finisher: true },
    ],
    pogo: { frames: 16, active: [1, 11], next: 99, kb: 1.5, stop: 5, reach: 36, arc: 'down' },
    // Dash strike: attack during a dash. A lunging thrust that hits harder than a normal cut.
    thrust: { frames: 14, active: [0, 9], next: 99, kb: 5.5, stop: 5, reach: 52, arc: 'thrust', dmg: 3, finisher: true },
    // Rising strike: hold up and attack on the ground. An uppercut that carries Wren into the air and launches light enemies.
    up: { frames: 18, active: [1, 11], next: 99, kb: 1.5, stop: 4, reach: 36, arc: 'up', dmg: 2, launch: 7.5, hop: 2.7 },
    killStop: 6,
    recoil: 1.6,        // small push back on you when your blade connects
  };

  SH.ENEMY_DEFS = {
    thornSprite: {
      name: 'Glassling', hp: 4, w: 24, h: 22,
      wander: 0.55, sight: 150, sightY: 50, leash: 5,
      windup: 26, lungeSpeed: 5.4, lungeHop: 2.6, lungeFrames: 20, recover: 42,
      respawn: 300, damage: 1, gravity: 0.5,
    },
    dummy: { name: 'Training dummy', w: 22, h: 40 },
    // Mountain wyrmling (DESIGN.md: charges in a straight line; teaches "sidestep, then hit from behind"; HP 10).
    // Its head is armored while it winds up and charges: hit it from behind, or while it's dazed after a charge.
    wyrmling: { name: 'Mountain wyrmling', hp: 10, w: 46, h: 26, wander: 0.5, sight: 210, sightY: 70, windup: 34,
      chargeSpeed: 6.2, chargeFrames: 70, stun: 80, rest: 40, damage: 1, gravity: 0.5, scale: 1 },
    // The Old Wyrm: the same creature, bigger, with three phases (see Wyrm in enemies.js): charge, leap slam, frost breath.
    // Charging into a wall brings rocks down and dazes it; fire down its throat while it breathes in chokes it.
    oldWyrm: { name: 'The Old Wyrm', hp: 32, breathReach: 170, w: 80, h: 44, wander: 0.4, sight: 1200, sightY: 160, windup: 44,
      chargeSpeed: 6.4, chargeFrames: 90, stun: 130, rest: 50, damage: 1, gravity: 0.5, scale: 1.7, rocks: 5, boss: true },
    bulb: { name: 'Thorn bud', r: 13, regrow: 40 },
  };
})(window.SH = window.SH || {});
