module.exports = async (page, shot) => {
  const ev = f => page.evaluate(f);
  await ev(() => { localStorage.setItem('second-chance-save-v1', JSON.stringify({ v: 1, cp: 'alley', flags: { intro: 1, path: 'ember', e_alley: 1 }, path: 'ember', rank: 1, echoes: 0, time: 0 })); SC.ui.closeMenu(); SC.story.load(); });
  await page.waitForTimeout(1500); await shot('02-follow');
  await ev(() => { const p = SC.player; SC.cam.cine(new THREE.Vector3(p.pos.x + 1.2, 1.3, p.pos.z - 2.6), new THREE.Vector3(p.pos.x, 1.05, p.pos.z), 40); });
  await page.waitForTimeout(600); await shot('03-front');
  await ev(() => { const p = SC.player; SC.cam.cine(new THREE.Vector3(p.pos.x + 0.35, 1.72, p.pos.z - 0.85), new THREE.Vector3(p.pos.x, 1.66, p.pos.z), 36); });
  await page.waitForTimeout(400); await shot('04-face');
  await ev(() => { SC.cam.endCine(0.01); });
  await page.keyboard.down('KeyW'); await page.waitForTimeout(1300); await shot('05-run'); await page.keyboard.up('KeyW');
  await ev(() => { SC.spawnEnemy('hollow', 1, 0, 26, null); SC.spawnEnemy('knifer', -1.5, 0, 25, null); SC.spawnEnemy('bruiser', 0, 0, 23.5, null); });
  await page.waitForTimeout(1600); await shot('06-enemies');
  await page.keyboard.press('KeyJ'); await page.waitForTimeout(160); await shot('07-atk1');
  await page.keyboard.press('KeyJ'); await page.waitForTimeout(420); await shot('08-atk2');
  await page.keyboard.press('KeyJ'); await page.waitForTimeout(500); await shot('09-atk3');
  await page.keyboard.press('KeyL'); await page.waitForTimeout(550); await shot('10-ember');
  await page.waitForTimeout(1200); await shot('11-after');
};
