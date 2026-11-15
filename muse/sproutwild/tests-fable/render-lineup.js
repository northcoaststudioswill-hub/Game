const { chromium } = require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:440,height:956}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(800);
const url=await p.evaluate(()=>{const WSPECIES=window.__g.SWF().species(),n=WSPECIES.length,cols=5,cw=150,ch=150,c=document.createElement('canvas');c.width=cols*cw;c.height=Math.ceil(n/cols)*ch;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
 WSPECIES.forEach((s,i)=>{const X=(i%cols)*cw,Y=((i/cols)|0)*ch;x.fillStyle=i%2?'#6aa84f':'#5d9a46';x.fillRect(X,Y,cw,ch);x.fillStyle='rgba(0,0,0,.2)';x.fillRect(X+30,Y+118,66,6);
  const sp=s._spr;x.drawImage(sp.ol,X+14,Y+18,sp.ow*4,sp.oh*4);const o=s._old;x.drawImage(o.ol,X+cw-o.ow*1.6-4,Y+4,o.ow*1.6,o.oh*1.6);x.drawImage(sp.ol,X+cw-28,Y+ch-30,22,22);
  x.fillStyle='#fff';x.font='11px monospace';x.fillText(s.id,X+4,Y+ch-6)});return c.toDataURL()});
fs.writeFileSync(process.argv[3],Buffer.from(url.split(',')[1],'base64'));console.log(errs.length?errs:'ok');await b.close()})();
