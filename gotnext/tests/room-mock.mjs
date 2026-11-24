// A stand-in for the claude.ai artifact "room": a BroadcastChannel per room name, same calls and shapes.
export const MOCK = () => {
  const me = Math.random().toString(36).slice(2, 12);
  const mk = name => {
    const bc = new BroadcastChannel('room-' + name), peers = new Map(), hs = new Set(); let mine = {}, gone = false;
    const P = (peer, presence) => Object.freeze({ peer, by: null, isMe: peer === me, sameTab: peer === me, kind: 'viewer', guest: false, presence: Object.freeze(presence), updatedAt: Date.now() });
    const fire = (joined, left, updated) => { const all = Object.freeze([...peers.values()]); for (const h of hs) h({ peers: all, joined, left, updated }); };
    peers.set(me, P(me, {})); bc.onmessage = e => { const d = e.data; if (gone) return;
      if (d.t === 'hello') bc.postMessage({ t: 'p', peer: me, pr: mine });
      if (d.t === 'p') { const had = peers.has(d.peer), p = P(d.peer, d.pr); peers.set(d.peer, p); fire(had ? [] : [p], [], had ? [p] : []); }
      if (d.t === 'bye') { const p = peers.get(d.peer); if (p) { peers.delete(d.peer); fire([], [p], []); } } };
    setTimeout(() => bc.postMessage({ t: 'hello' }), 30); setTimeout(() => fire([peers.get(me)], [], []), 10);
    addEventListener('pagehide', () => bc.postMessage({ t: 'bye', peer: me }));
    return { name, emit: async () => { }, on: () => () => { }, presence: async patch => { if (gone) throw { code: 'invalid_argument' }; mine = Object.assign({}, mine); for (const k in patch) { if (patch[k] === null) delete mine[k]; else mine[k] = JSON.parse(JSON.stringify(patch[k])); } if (JSON.stringify(mine).length > 4096) throw { code: 'invalid_argument', message: 'presence over 4 KiB' }; peers.set(me, P(me, mine)); bc.postMessage({ t: 'p', peer: me, pr: mine }); window.__sent = (window.__sent || 0) + 1; window.__maxP = Math.max(window.__maxP || 0, JSON.stringify(mine).length); },
      peers: () => Object.freeze([...peers.values()]), onPeers: h => { hs.add(h); return () => hs.delete(h); }, connected: () => true, onConnection: h => { setTimeout(() => h(true), 5); return () => { }; },
      leave: async () => { gone = true; bc.postMessage({ t: 'bye', peer: me }); bc.close(); }, join: async n => mk(n) };
  };
  const lobby = mk('lobby'); window.claude = { use: n => Promise.resolve(n === 'room' ? lobby : null) };
};
