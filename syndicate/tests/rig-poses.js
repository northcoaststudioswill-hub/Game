const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1500, height: 300 } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(700); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); }); await p.waitForTimeout(400);
  const rows = JSON.parse(process.argv[2] || '[]');
  for (const [nm, cls, arm, poses] of rows) {
    await p.evaluate(([cls, arm, poses]) => { document.getElementById('ui').style.display = 'none'; const a = G.world.get('arena'); G.gfx.setScene(a.scene); G.titleChars && G.titleChars.forEach(c => c.root.visible = false); (window.ROW || []).forEach(c => a.scene.remove(c.root));
      window.ROW = poses.map((q, i) => { const c = G.makeChar({ cls, race: 'human', arm }); c.root.position.set(-6.6 + i * 2.2, 0, 0); c.root.rotation.y = Math.PI / 2; a.scene.add(c.root); return c; });
      for (let rep = 0; rep < 60; rep++) ROW.forEach((c, i) => c.pose(Object.assign({ t: 1 + rep * 0.016, ready: 1 }, poses[i], poses[i].moving ? { walk: poses[i].walk } : {}))); G.gfx.cine = { pos: [0, 1.2, 10.5], look: [0, 1.0, 0], fov: 34, roll: 0 }; G.gfx.render(); }, [cls, arm, poses]);
    await p.waitForTimeout(60); await p.screenshot({ path: 'rig_' + nm + '.png' }); }
  await b.close(); })();
