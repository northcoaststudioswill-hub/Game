// Writes assets/REGISTRY.md and assets/registry.json: every asset in Guttercrown with its id, name, what it is, and the
// file and line that define it. Characters carry their full look (frame, people, colours, cosmetics, size).
// Run with the game served on :8765 (for example: python3 -m http.server 8765 in syndicate/), then: node tools/make_registry.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), JS = fs.readdirSync(path.join(ROOT, 'js')).filter(f => f.endsWith('.js'));
const SRC = JS.map(f => ({ f: 'js/' + f, lines: fs.readFileSync(path.join(ROOT, 'js', f), 'utf8').split('\n') }));
const where = (id, prefer) => { const pats = ["id: '" + id + "'", "'" + id + "':", ' ' + id + ': {', "['" + id + "']"]; const order = prefer ? [SRC.find(s => s.f === prefer)].concat(SRC.filter(s => s.f !== prefer)) : SRC;
  for (const p of pats) for (const s of order) { if (!s) continue; const i = s.lines.findIndex(l => l.includes(p)); if (i >= 0) return s.f + ':' + (i + 1); } return prefer || ''; };
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const p = await b.newPage();
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(1500);
  const D = await p.evaluate(() => { const hx = v => typeof v === 'number' ? '#' + v.toString(16).padStart(6, '0') : v; const fix = o => JSON.parse(JSON.stringify(o, (k, v) => typeof v === 'number' && /^(cloth|armor|armor2|trim|legs|hair|skin|weapon)$/.test(k) ? hx(v) : v));
    const chars = G.registry().map(r => ({ id: r.id, name: r.name, group: r.group, file: r.file, look: fix(G.workshop.base(r) || {}) }));
    const list = (o, f) => Object.keys(o || {}).map(k => Object.assign({ id: k }, f(o[k], k)));
    return {
      characters: chars,
      frames: list(G.CLASSES, (c, k) => ({ name: c.name, colours: fix(G.MODEL_BASE[k] || {}), note: k === 'druid' ? 'uses the cleric body' : k === 'warlock' ? 'uses the sorcerer body' : '' })),
      peoples: list(G.RACES, r => ({ name: r.name, skin: r.skin, scale: r.scale })),
      weapons: (G.ARMS || []).map(w => ({ id: w.id, name: w.name, cls: w.cls, family: w.fam || w.kind || '', temper: ((G.ARM_TRAIT || {})[w.id] || {}).name || '' })),
      weaponSkins: list(G.WSKIN, s => ({ name: s.name || '' })),
      armourSets: (G.KITS || []).map(k => ({ id: k.id, name: k.name, text: k.text || '' })),
      cosmetics: (G.COSMETICS || []).map(c => ({ id: c.id, name: c.name, slot: c.slot, cost: c.cost, desc: c.desc })),
      dyes: list(G.DYES, d => ({ colours: fix(d) })),
      rings: list(G.RINGS, r => ({ name: r.name || '', desc: r.desc || '' })),
      furniture: (G.DECOR || []).map(d => ({ id: d.id, name: d.name, cost: d.cost })),
      wallPieces: (G.WALLITEMS || []).map(d => ({ id: d.id, name: d.name })).concat((G.WALLS || []).map(d => ({ id: d.id, name: d.name }))),
      floors: (G.FLOORS || []).map(d => ({ id: d.id, name: d.name })), gardens: (G.GARDENS || []).map(d => ({ id: d.id, name: d.name })),
      stances: (G.STANCES ? [].concat(G.STANCES.g || G.STANCES.ground || [], G.STANCES.f || G.STANCES.floating || []) : []).map((s, i) => ({ id: 'stance-' + i, name: s.name, sub: s.sub || '' })),
      guests: list(G.EGGS, e => ({ name: e.name, race: e.race, title: e.title || '' })),
      places: [{ id: 'hub', name: 'The Lamp Market' }, { id: 'arena', name: 'The Blood Pit' }, { id: 'hideout', name: 'Your Hideout' }, { id: 'cellar', name: 'David’s cellar' }]
    }; });
  await b.close();
  D.characters.forEach(c => c.defined = c.id.startsWith('fighter:') ? where(c.id.slice(8), c.file) : where(c.id, c.file));
  const FILE = { frames: 'js/data.js', peoples: 'js/data.js', weapons: 'js/arms.js', weaponSkins: 'js/crew.js', armourSets: 'js/kits.js', cosmetics: 'js/crew.js', dyes: 'js/crew.js', rings: 'js/rings.js', furniture: 'js/data.js', wallPieces: 'js/room.js', floors: 'js/room.js', gardens: 'js/room.js', stances: 'js/stance.js', guests: 'js/eggs.js', places: 'js/places.js' };
  Object.keys(FILE).forEach(k => (D[k] || []).forEach(x => x.defined = x.defined || (k === 'stances' || k === 'places' ? FILE[k] : where(x.id, FILE[k]))));
  D.generated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(ROOT, 'assets', 'registry.json'), JSON.stringify(D, null, 1));
  const esc = s => String(s == null ? '' : s).replace(/\|/g, '\\|');
  const look = l => { const t = l.tint || {}, cos = l.cos || {}; return [l.cls, l.race, l.scale && l.scale !== 1 ? '×' + l.scale : '', Object.keys(t).map(k => k + ' ' + t[k]).join(', '), Object.keys(cos).filter(k => cos[k]).map(k => k + ': ' + cos[k]).join(', ')].filter(Boolean).join(' · '); };
  const table = (title, rows, cols) => '\n## ' + title + ' (' + rows.length + ')\n\n| ' + cols.map(c => c[0]).join(' | ') + ' |\n|' + cols.map(() => '---').join('|') + '|\n' + rows.map(r => '| ' + cols.map(c => esc(c[1](r))).join(' | ') + ' |').join('\n') + '\n';
  let md = '# Guttercrown asset registry\n\nGenerated ' + D.generated + ' by `tools/make_registry.js` from the running game. Every asset, its id, and the file and line that define it. The machine-readable copy is `registry.json` beside this file.\n\n' +
    '**Characters** are built in code from a look (frame, people, colours, cosmetics, size), not from model files. Change one in the game\'s **Workshop** (title screen, owner only): edits are saved to the published game and apply for everyone. To make an edit permanent in the code, use **Copy for Claude** and paste the result to Claude, or change the look at the line given here.\n' +
    '\nColour keys: `cloth`, `armor`, `armor2` (dark armour), `trim`, `legs`, `hair`, `skin`. A dye in `cos.dye` repaints cloth, armour, trim and legs. Cosmetic slots: `head`, `back`, `dye`, `aura`, `weapon` (ids in Cosmetics below).\n';
  const groups = [...new Set(D.characters.map(c => c.group))];
  groups.forEach(g => { md += table('Characters: ' + g, D.characters.filter(c => c.group === g), [['id', c => '`' + c.id + '`'], ['Name', c => c.name], ['Look', c => look(c.look)], ['Defined in', c => c.defined]]); });
  md += table('Body frames', D.frames, [['id', x => '`' + x.id + '`'], ['Name', x => x.name], ['Base colours', x => Object.keys(x.colours).map(k => k + ' ' + x.colours[k]).join(', ')], ['Note', x => x.note], ['Defined in', x => x.defined]]);
  md += table('Peoples', D.peoples, [['id', x => '`' + x.id + '`'], ['Name', x => x.name], ['Skin', x => x.skin], ['Scale', x => x.scale], ['Defined in', x => x.defined]]);
  md += table('Weapons', D.weapons, [['id', x => '`' + x.id + '`'], ['Name', x => x.name], ['Class', x => x.cls], ['Temper', x => x.temper], ['Defined in', x => x.defined]]);
  md += table('Weapon skins', D.weaponSkins, [['id', x => '`' + x.id + '`'], ['Name', x => x.name], ['Defined in', x => x.defined]]);
  md += table('Armour sets', D.armourSets, [['id', x => '`' + x.id + '`'], ['Name', x => x.name], ['What it does', x => x.text], ['Defined in', x => x.defined]]);
  md += table('Cosmetics', D.cosmetics, [['id', x => '`' + x.id + '`'], ['Name', x => x.name], ['Slot', x => x.slot], ['Cost', x => x.cost], ['Description', x => x.desc], ['Defined in', x => x.defined]]);
  md += table('Dyes', D.dyes, [['id', x => '`' + x.id + '`'], ['Colours', x => Object.keys(x.colours).map(k => k + ' ' + x.colours[k]).join(', ')], ['Defined in', x => x.defined]]);
  md += table('Rings (casters float on these)', D.rings, [['id', x => '`' + x.id + '`'], ['Name', x => x.name], ['Defined in', x => x.defined]]);
  md += table('Home furniture', D.furniture, [['id', x => '`' + x.id + '`'], ['Name', x => x.name], ['Cost', x => x.cost], ['Defined in', x => x.defined]]);
  md += table('Wall pieces', D.wallPieces, [['id', x => '`' + x.id + '`'], ['Name', x => x.name], ['Defined in', x => x.defined]]);
  md += table('Floors', D.floors, [['id', x => '`' + x.id + '`'], ['Name', x => x.name], ['Defined in', x => x.defined]]);
  md += table('Gardens', D.gardens, [['id', x => '`' + x.id + '`'], ['Name', x => x.name], ['Defined in', x => x.defined]]);
  md += table('Stances', D.stances, [['Name', x => x.name], ['Pose', x => x.sub], ['Defined in', x => x.defined]]);
  md += table('Guest List (hidden roster, paused)', D.guests, [['id', x => '`' + x.id + '`'], ['Name', x => x.name], ['Title', x => x.title], ['Defined in', x => x.defined]]);
  md += table('Places', D.places, [['id', x => '`' + x.id + '`'], ['Name', x => x.name], ['Defined in', x => x.defined]]);
  fs.writeFileSync(path.join(ROOT, 'assets', 'REGISTRY.md'), md);
  const n = Object.keys(D).filter(k => Array.isArray(D[k])).reduce((a, k) => a + D[k].length, 0); console.log('wrote', n, 'assets;', D.characters.length, 'characters;', D.characters.filter(c => !c.look || !c.look.cls).map(c => c.id).join(' ') || 'all characters have a look');
})();
