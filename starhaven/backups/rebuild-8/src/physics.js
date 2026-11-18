// Starhaven — tile collision. Bodies use x = center, y = feet (bottom).
(function (SH) {
  const T = () => SH.TILE;

  SH.isSolid = t => t === SH.T_SOLID;

  // Moves a body by its velocity and resolves against the room's tiles.
  // b: { x, y, w, h, vx, vy, dropThrough }
  SH.moveBody = function (room, b) {
    const TS = T();
    const res = { wall: 0, ceil: false, ground: false, groundTile: 0 };

    // --- horizontal
    b.x += b.vx;
    let top = b.y - b.h, bot = b.y - 0.01;
    let ty0 = Math.floor(top / TS), ty1 = Math.floor(bot / TS);
    if (b.vx > 0) {
      const tx = Math.floor((b.x + b.w / 2 - 0.01) / TS);
      for (let ty = ty0; ty <= ty1; ty++) if (SH.isSolid(room.get(tx, ty))) { b.x = tx * TS - b.w / 2; b.vx = 0; res.wall = 1; break; }
    } else if (b.vx < 0) {
      const tx = Math.floor((b.x - b.w / 2) / TS);
      for (let ty = ty0; ty <= ty1; ty++) if (SH.isSolid(room.get(tx, ty))) { b.x = (tx + 1) * TS + b.w / 2; b.vx = 0; res.wall = -1; break; }
    }

    // --- vertical
    const prevBot = b.y;
    b.y += b.vy;
    const tx0 = Math.floor((b.x - b.w / 2 + 0.01) / TS), tx1 = Math.floor((b.x + b.w / 2 - 0.01) / TS);
    if (b.vy > 0) {
      const ty = Math.floor(b.y / TS);
      for (let tx = tx0; tx <= tx1; tx++) {
        const t = room.get(tx, ty);
        if (SH.isSolid(t) || (t === SH.T_ONEWAY && prevBot <= ty * TS + 0.01 && !b.dropThrough)) {
          b.y = ty * TS; b.vy = 0; res.ground = true; res.groundTile = t; break;
        }
      }
    } else if (b.vy < 0) {
      const ty = Math.floor((b.y - b.h) / TS);
      for (let tx = tx0; tx <= tx1; tx++) if (SH.isSolid(room.get(tx, ty))) { b.y = (ty + 1) * TS + b.h; b.vy = 0; res.ceil = true; break; }
    }
    return res;
  };

  // Is there floor under a point just ahead (used by walkers so they don't fall off ledges)?
  SH.floorAhead = function (room, x, y) {
    const TS = T();
    const t = room.get(Math.floor(x / TS), Math.floor((y + 2) / TS));
    return SH.isSolid(t) || t === SH.T_ONEWAY;
  };

  // Does a box touch any thorn tile? Thorns only hurt in their lower part.
  SH.touchesThorns = function (room, l, t, r, b) {
    const TS = T();
    for (let tx = Math.floor(l / TS); tx <= Math.floor((r - 0.01) / TS); tx++)
      for (let ty = Math.floor(t / TS); ty <= Math.floor((b - 0.01) / TS); ty++)
        if (room.get(tx, ty) === SH.T_THORNS && b > ty * TS + 9) return true;
    return false;
  };

  SH.overlap = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
  SH.boxOf = o => ({ l: o.x - o.w / 2, r: o.x + o.w / 2, t: o.y - o.h, b: o.y });
})(window.SH = window.SH || {});
