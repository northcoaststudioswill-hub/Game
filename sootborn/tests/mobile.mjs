import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const errs = [];
for (const [name, vp] of [['portrait', { width: 390, height: 844 }], ['landscape', { width: 844, height: 390 }], ['deck', { width: 1280, height: 800 }]]) {
  const touch = name !== 'deck';
  const c = await b.newContext({ viewport: vp, hasTouch: touch, isMobile: touch, deviceScaleFactor: touch ? 2 : 1 });
  const p = await c.newPage(); p.on('pageerror', e => errs.push(name + ': ' + e.message));
  await p.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await p.waitForTimeout(300);
  if (touch) await p.tap('.press'); else await p.keyboard.press('Enter');
  await p.waitForTimeout(5600); await p.screenshot({ path: `/home/claude/shots/m-${name}-title.png` });
  await p.locator('.mi', { hasText: 'New game' }).click(); await p.waitForTimeout(400);
  await p.waitForTimeout(2500); await p.screenshot({ path: `/home/claude/shots/m-${name}-prologue.png` });
  await p.locator('#cskip').click(); await p.waitForTimeout(1800);
  // move with on-screen dpad (touch) or keys
  if (touch) { const box = await p.locator('#dpad').boundingBox(); const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
    await p.evaluate(([x, y]) => { const d = document.querySelector('#dpad'); const o = { pointerId: 7, clientX: x, clientY: y, bubbles: true, pointerType: 'touch' }; d.dispatchEvent(new PointerEvent('pointerdown', o)); d.dispatchEvent(new PointerEvent('pointermove', { ...o, clientX: x + 50 })); }, [cx, cy]);
    await p.waitForTimeout(900);
    await p.evaluate(([x, y]) => { document.querySelector('#dpad').dispatchEvent(new PointerEvent('pointerup', { pointerId: 7, clientX: x, clientY: y, bubbles: true })); }, [cx, cy]);
  } else { await p.keyboard.down('ArrowRight'); await p.waitForTimeout(900); await p.keyboard.up('ArrowRight'); }
  await p.waitForTimeout(200);
  console.log(name, 'pos', await p.evaluate(() => [BTS.P.x | 0, BTS.P.y | 0, BTS.World.target && BTS.World.target.id, document.body.className]));
  await p.screenshot({ path: `/home/claude/shots/m-${name}-world.png` });
  if (touch) await p.tap('#bA'); else await p.keyboard.press('KeyE');
  await p.waitForTimeout(1200); await p.screenshot({ path: `/home/claude/shots/m-${name}-dialogue.png` });
  // jump to puzzle for layout check
  await p.evaluate(() => { BTS.Dialogue.end(); BTS.G.flags.tookOrder = 1; BTS.Puzzle.open(PUZZLES, () => { }); });
  await p.waitForTimeout(500); await p.screenshot({ path: `/home/claude/shots/m-${name}-puzzle.png` });
  if (touch) { const r = await p.locator('#game').boundingBox(); const before = await p.evaluate(() => BTS.Puzzle.moves);
    await p.evaluate(() => { const Pz = BTS.Puzzle; const c = Pz.grid.flat().findIndex(c => c.kind === 'pipe'); window._c = [c % Pz.cols, Math.floor(c / Pz.cols)]; });
    const [cx, cy] = await p.evaluate(() => { const Pz = BTS.Puzzle; return [Pz.ox + (_c[0] + .5) * Pz.T, Pz.oy + (_c[1] + .5) * Pz.T]; });
    const LW = await p.evaluate(() => W); await p.tap('#game', { position: { x: cx / LW * r.width, y: cy / 180 * r.height } }); await p.waitForTimeout(200);
    console.log(name, 'tap rotates puzzle:', before, '->', await p.evaluate(() => BTS.Puzzle.moves)); }
  await p.evaluate(() => { BTS.Puzzle.close(); BTS.Menus.pause(); }); await p.waitForTimeout(400);
  await p.screenshot({ path: `/home/claude/shots/m-${name}-pause.png` });
  await c.close();
}
console.log('ERRS', errs); await b.close();
