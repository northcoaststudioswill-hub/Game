// captures every asset for the asset atlas page: node atlas.mjs  (PART=canvas|scenes|plates|levels)
import { chromium } from 'playwright'; import fs from 'fs';
const OUT = '/home/claude/atlas/img/', MAN = '/home/claude/atlas/manifest-' + (process.env.PART || 'canvas') + '.json', PART = process.env.PART || 'canvas';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a), man = [];
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); }
const save = (name, dataUrl) => fs.writeFileSync(OUT + name, Buffer.from(dataUrl.split(',')[1], 'base64'));
if (PART === 'canvas') {
  const r = await ev(() => { const out = []; const up = (c, k) => { const o = document.createElement('canvas'); o.width = c.width * k; o.height = c.height * k; const g = o.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(c, 0, 0, o.width, o.height); return o.toDataURL('image/png'); };
    for (const k of Object.keys(CAST)) { let s = null, b = null; try { s = BTS.World.sheetFor(k); } catch (e) {} try { b = BTS.World.bustFor(k); } catch (e) {} out.push({ k, name: CAST[k].name, sheet: s && s.width ? up(s, 3) : null, bust: b && b.width ? up(b, 3) : null }); }
    const maps = []; for (const k of Object.keys(MAPS)) { try { const m = MAPS[k], c = renderMapLayer(m); const cv = c && c.width ? c : (c && c.cv) || null; if (cv) maps.push({ k, name: m.name || k, theme: m.theme || '', w: cv.width, h: cv.height, png: cv.toDataURL('image/png') }); } catch (e) { maps.push({ k, err: e.message }); } }
    return { out, maps }; });
  for (const c of r.out) { if (c.sheet) { save('char-' + c.k + '.png', c.sheet); man.push({ id: 'char-' + c.k, sec: 'chars', title: c.name, img: 'char-' + c.k + '.png', note: 'sprite sheet: 3 directions × stand, step, step, blink' }); } if (c.bust) { save('bust-' + c.k + '.png', c.bust); man.push({ id: 'bust-' + c.k, sec: 'busts', title: c.name, img: 'bust-' + c.k + '.png' }); } }
  for (const m of r.maps) { if (m.png) { save('map-' + m.k + '.png', m.png); man.push({ id: 'map-' + m.k, sec: 'maps', title: m.name, img: 'map-' + m.k + '.png', note: (m.theme ? m.theme + ' · ' : '') + m.w + '×' + m.h }); } else man.push({ id: 'map-' + m.k, sec: 'maps', title: m.k, err: m.err }); }
}
if (PART === 'scenes') {
  const keys = await ev(() => Object.keys(BTS.FF).filter(k => { try { const d = BTS.FF[k](); return d && typeof d === 'object' && (d.walk || d.foes || d.waves || d.wave); } catch (e) { return false; } }));
  for (const k of keys) { let info = null;
    try { info = await ev(k => { if (BTS.Brawl.active) BTS.Brawl.end(true); BTS.UI.clear(); const d = BTS.FF[k](); BTS.Brawl.start(Object.assign(d, { intro: null }), () => {}); BTS.UI.clear(); return { t: (d.title || k) + (d.sub ? ' · ' + d.sub : ''), walk: !!d.walk, bg: d.bg2 || d.bg || '' }; }, k);
      for (let i = 0; i < 12; i++) { await wait(220); if (await ev(() => BTS.Dialogue.active || BTS.UI.stack.length)) await page.keyboard.press('KeyE'); }
      await wait(400); await page.screenshot({ path: OUT + 'scene-' + k + '.jpg', type: 'jpeg', quality: 78 });
      man.push({ id: 'scene-' + k, sec: info.walk ? 'walks' : 'fights', title: info.t, img: 'scene-' + k + '.jpg', note: 'FF.' + k + (info.bg ? ' · backdrop ' + info.bg : '') }); } catch (e) { man.push({ id: 'scene-' + k, sec: 'fights', title: k, err: e.message.slice(0, 120) }); } }
  await ev(() => { if (BTS.Brawl.active) BTS.Brawl.end(true); });
}
if (PART === 'plates') {
  const keys = 'down,lucan,halberd,docklog,furnace,lift,square,sun,names,tbarge,shelf,book,tavi,pairing,ford'.split(',');
  for (const k of keys) { await ev(k => { BTS.UI.clear(); Prelude.plate(k, 6, () => {}); }, k); await wait(3200); await page.screenshot({ path: OUT + 'still-' + k + '.jpg', type: 'jpeg', quality: 80 }); await ev(() => { try { Prelude.finish(); } catch (e) {} }); await wait(300);
    man.push({ id: 'still-' + k, sec: 'stills', title: k, img: 'still-' + k + '.jpg', note: 'prelude.js PLATES.' + k }); }
}
if (PART === 'levels') {
  for (const L of (process.env.L || 'docks,riser,stair,gild,stack,array').split(',')) {
    await ev(L => { BTS.UI.clear(); BTS.G.mode = 'cut'; Issue.fresh = 1; BTS.Cutscene.play([{ issue: L, or: [] }], () => {}); }, L);
    let fr = null; for (let i = 0; i < 80 && !fr; i++) { await wait(250); fr = page.frames().find(f => f !== page.mainFrame()); }
    for (let i = 0; i < 160; i++) { await wait(250); if (await fr.evaluate(() => typeof SC !== 'undefined' && SC.state === 'play' && SC.player.control).catch(() => 0)) break; await page.keyboard.press('Enter'); }
    await wait(1500); await page.screenshot({ path: OUT + 'level-' + L + '.jpg', type: 'jpeg', quality: 80 });
    const pts = await fr.evaluate(() => { const r = (SC.story && SC.story.route) || []; return r.length; }).catch(() => 0);
    man.push({ id: 'level-' + L, sec: 'levels', title: L, img: 'level-' + L + '.jpg', note: 'issue/story.js + issue/world.js' });
    await ev(() => { try { Issue.finish(true); } catch (e) {} }); await wait(1200); }
}
fs.writeFileSync(MAN, JSON.stringify(man, null, 1)); console.log(PART, man.length, 'items,', man.filter(m => m.err).length, 'errors'); await browser.close();
