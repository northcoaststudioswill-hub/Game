/* Sprouts: are all berries the objective can point at actually reachable? (fresh save, day 1 and a few re-rolls)
   Run from the repo root:  node alt/tests/sprouts_berries.js [build.html] */
const { chromium } = require('playwright');
const path = require('path');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/pocket-lantern-alt.html'));
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 440, height: 956 } });
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelector('.cart[data-i="0"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  const E = s => page.evaluate(s => __g.ev(s), s);
  for (let i = 0; i < 40 && (await E('state')) !== 'menu'; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(250); }
  await page.keyboard.press('Enter'); await page.waitForTimeout(800);
  const r = await E(`(()=>{const out=[];
    /* flood fill walkable tiles from the player (16px tiles) */
    const key=(x,y)=>x+','+y,seen=new Set([key(P.x>>4,P.y>>4)]),q=[[P.x>>4,P.y>>4]];
    while(q.length){const [x,y]=q.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(seen.has(k))continue;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;if(!free(nx*16+8,ny*16+8,false))continue;seen.add(k);q.push([nx,ny])}}
    for(const it of items)if(it.alive&&(it.sub==='berry'||it.sub==='big')){const tx=it.x>>4,ty=it.y>>4;let near=0;for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++)if(seen.has(key(tx+dx,ty+dy)))near=Math.max(near,3-Math.max(Math.abs(dx),Math.abs(dy)));
      out.push({x:it.x,y:it.y,sub:it.sub,onFree:free(it.x,it.y,false),walkTile:seen.has(key(tx,ty)),reach:near})}
    return out})()`);
  const bad = r.filter(b => !b.walkTile);
  console.log('berries:', r.length, '| on a walkable tile:', r.length - bad.length);
  for (const b of bad) console.log('  not on a walkable tile:', JSON.stringify(b));
  await browser.close();
})();
