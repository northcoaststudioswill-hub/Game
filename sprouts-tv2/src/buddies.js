/* ---------- the eight wild buddies of the valley ----------
   On the handheld their pictures and guide lines come from the Sproutwild cartridge's files. Sprouts TV has no other
   cartridges, so the art for these eight was copied here on Nov 18 2026 (from alt/src/sproutwild/sw-module.js,
   sw-squire.js and sw-starters.js) together with the routine that bakes it. Each drawing is a short program of
   blobs, limbs and polygons in a 24x24 space, finished with a lit top edge, a shaded underside and one dark outline. */
const SWB_S=2,SWB_W=24,SWB_H=24;
function swbTone(h,kr,kg,kb,ad){const n=parseInt(h.slice(1),16),f=(v,k)=>('0'+Math.round(Math.max(0,Math.min(255,v*k+ad))).toString(16)).slice(-2);return'#'+f(n>>16,kr)+f(n>>8&255,kg)+f(n&255,kb)}
const swbDk=c=>swbTone(c,.62,.6,.72,0),swbLt=c=>swbTone(c,1.18,1.16,1.08,14);
function swbMake(fn){const S=SWB_S,w=SWB_W*S,h=SWB_H*S,mkc=(W_,H_)=>{const c=document.createElement('canvas');c.width=W_;c.height=H_;return c};
 const c=mkc(w,h),x=c.getContext('2d',{willReadFrequently:true});x.setTransform(S,0,0,S,0,0);
 const D={e(cx,cy,rx,ry,col){x.fillStyle=col;x.beginPath();x.ellipse(cx,cy,Math.max(.2,rx),Math.max(.2,ry),0,0,7);x.fill()},
  b(cx,cy,rx,ry,col){D.e(cx,cy,rx,ry,swbDk(col));D.e(cx-rx*.1,cy-ry*.13,rx*.87,ry*.85,col);D.e(cx-rx*.36,cy-ry*.42,rx*.3,ry*.22,swbLt(col))},
  p(pts,col){x.fillStyle=col;x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)x.lineTo(pts[i][0],pts[i][1]);x.closePath();x.fill()},
  l(x1,y1,x2,y2,wd,col){x.strokeStyle=col;x.lineWidth=wd;x.lineCap='round';x.beginPath();x.moveTo(x1,y1);x.lineTo(x2,y2);x.stroke()},
  r(x_,y_,w_,h_,col){x.fillStyle=col;x.fillRect(x_,y_,w_,h_)},
  eye(cx,cy,rr=1.6,look=-.45){D.e(cx,cy,rr,rr*1.15,'#ffffff');D.e(cx+look,cy+.15,rr*.62,rr*.8,'#1c1420');D.r(cx+look-.75,cy-.8,.7,.7,'#ffffff')}};
 fn(D);x.setTransform(1,0,0,1,0,0);
 const d=x.getImageData&&x.getImageData(0,0,w,h),hit=mkc(w,h),ol=mkc(w+2*S,h+2*S),hol=mkc(w+2*S,h+2*S);
 if(d&&d.data){const q=d.data,n=w*h,on=new Uint8Array(n);
  for(let k=0;k<n;k++){if(q[k*4+3]>=120){on[k]=1;q[k*4+3]=255}else q[k*4+3]=0}
  for(let k=w;k<n-w;k++){if(!on[k])continue;const i=k*4;if(!on[k-w]){q[i]=Math.min(255,q[i]*1.16+14);q[i+1]=Math.min(255,q[i+1]*1.14+12);q[i+2]=Math.min(255,q[i+2]*1.08+8)}else if(!on[k+w]||!on[Math.min(n-1,k+2*w)]){q[i]*=.74;q[i+1]*=.72;q[i+2]*=.84}}
  x.putImageData(d,0,0);
  const hx=hit.getContext('2d'),hd=hx.createImageData(w,h);for(let k=0;k<n;k++){hd.data[k*4]=hd.data[k*4+1]=hd.data[k*4+2]=255;hd.data[k*4+3]=on[k]?255:0}hx.putImageData(hd,0,0);
  const sil=mkc(w,h),sx=sil.getContext('2d'),sd=sx.createImageData(w,h);for(let k=0;k<n;k++){sd.data[k*4]=20;sd.data[k*4+1]=16;sd.data[k*4+2]=30;sd.data[k*4+3]=on[k]?255:0}sx.putImageData(sd,0,0);
  for(const[cv,top]of[[ol,c],[hol,hit]]){const ox=cv.getContext('2d');for(let dx=-S;dx<=S;dx++)for(let dy=-S;dy<=S;dy++)if(Math.abs(dx)+Math.abs(dy)<=S+1)ox.drawImage(sil,S+dx,S+dy);ox.drawImage(top,S,S)}}
 return{img:c,hit,ol,hol,w:SWB_W,h:SWB_H,ow:SWB_W+2,oh:SWB_H+2,fable:1}}
const SWBUD={
CINDERCAP(D){const cr='#f8e8c8',rd='#d8402a',og='#f8902c';
 D.l(9,21,9,22.5,2.4,'#e0c090');D.l(15,21,15,22.5,2.4,'#e0c090');D.b(12,17.5,5.2,4.6,cr);D.l(7,17,5.5,18.5,1.6,cr);D.l(17,17,18.5,18.5,1.6,cr);
 D.p([[12,.5],[9.8,5],[14.2,5]],'#f8c030');D.p([[12,2.2],[10.9,5],[13.1,5]],'#fff0a0');
 D.b(12,9.5,9,5.8,rd);D.e(12,13.6,8.4,1.6,'#8e2416');D.e(7.5,9,1.6,1.3,og);D.e(13,6.6,1.9,1.4,og);D.e(17,10,1.4,1.1,og);
 D.eye(9.6,17,1.7);D.eye(14.2,17,1.7);D.r(11.2,19.6,1.6,.8,'#8a3a30')},
PEBBLIT(D){const g1='#a8b0c0';
 D.l(8,20,8,22.5,2.6,g1);D.l(15,20,15,22.5,2.6,g1);D.b(12.5,17,6,4.5,g1);D.l(19,15.5,21.5,12.5,1.8,g1);D.e(21.8,12,1.6,1.4,'#c8d0dc');
 D.p([[5,7],[3.2,2.5],[8,5]],'#7c8698');D.p([[14,5],[18.5,2.5],[17,7.5]],'#7c8698');D.b(10.5,10.5,6.6,5.6,g1);D.e(8.5,13.2,3.2,2.2,'#e8ecf2');
 D.eye(7.6,9.6,1.6);D.eye(13,9.6,1.6);D.e(7.2,12.4,1,.8,'#2a2a34');D.r(7.4,14.2,2,.7,'#6a3a40');D.e(13.5,6.5,1.4,1,'#c8d0dc')},
DRIZZLET(D){const b1='#48a0f0';
 D.l(8,5,5.5,2.2,.9,b1);D.e(5.2,1.9,1.3,1.3,'#a8d8f8');D.l(15,4.5,17.8,2,.9,b1);D.e(18.1,1.7,1.3,1.3,'#a8d8f8');
 D.l(5.5,16,3,17.5,1.8,b1);D.l(18.5,16,21,17.5,1.8,b1);D.l(9.5,21.5,9,22.8,2,'#2a68b8');D.l(14.5,21.5,15,22.8,2,'#2a68b8');
 D.p([[12,2],[5.6,13],[18.4,13]],b1);D.b(12,15.5,7,6.5,b1);D.e(12,18,4.6,3.4,'#d8f0ff');D.e(9.6,6.5,1,2,'#a8d8f8');
 D.eye(9.4,12.6,1.8);D.eye(14.8,12.6,1.8);D.e(12,15.6,1.2,.8,'#c04060');D.e(7.2,14.6,1,.6,'#f0a0b8');D.e(17,14.6,1,.6,'#f0a0b8')},
ZIPWIG(D){const y1='#f0d020';
 for(const[x1,x2]of[[5,2.5],[6,3],[8,5.5],[19,21.5],[18,21],[16,18.5]])D.l(x1,18,x2,21.5,.9,'#3a3020');
 D.l(10,5.5,7.5,2,.8,'#3a3020');D.l(14,5.5,16.5,2,.8,'#3a3020');D.e(7.3,1.8,1.2,1.2,'#fff070');D.e(16.7,1.8,1.2,1.2,'#fff070');
 D.b(12,14,8.5,6.8,y1);D.l(12,9,12,20.5,.9,'#a88810');D.p([[7.5,11],[9.8,13.4],[8.2,13.4],[10,17],[6.6,13.8],[8.2,13.8]],'#ffffff');
 D.b(12,8,4.6,3.4,'#4a3c28');D.eye(10.3,8,1.3);D.eye(13.7,8,1.3)},
FERNFANG(D){const g1='#58c048',dg='#2f7a2e';
 D.l(11,19,10,22.6,2.2,dg);D.l(15.5,19,16.5,22.6,2.2,g1);D.l(18,16,22.5,12,2.2,g1);D.e(22.3,10.6,1.8,2.8,'#8fd45e');D.b(13.5,15.5,5.5,4.6,g1);
 D.p([[9,7],[8,1],[12,5.5]],'#8fd45e');D.p([[11,6],[12.5,.5],[14.5,6]],g1);D.p([[13.5,6.5],[17,2],[16.5,8]],dg);
 D.b(8.5,10.5,5.6,4.4,g1);D.e(5.5,12.6,3.2,2,'#f0e8c8');D.p([[3.5,13.5],[4.2,15.8],[5,13.5]],'#ffffff');D.p([[6,13.8],[6.7,16],[7.4,13.8]],'#ffffff');
 D.eye(7.4,9.6,1.6);D.l(9.5,16,7.5,17.5,1.6,g1)},
CLOVERIMP(D){const pk='#f078c0';
 D.l(9.5,20.5,9,22.6,2.2,'#c05296');D.l(14.5,20.5,15,22.6,2.2,'#c05296');D.l(17,18,21,15,1.2,pk);D.p([[20,13],[23,14],[21.5,16.5]],'#c05296');
 D.b(12,17,4.8,4.4,pk);D.l(7.5,16.5,5.5,14.5,1.4,pk);D.l(16.5,16.5,18.5,14.5,1.4,pk);D.p([[5.5,8],[2,5],[6.5,11]],pk);D.p([[18.5,8],[22,5],[17.5,11]],pk);
 D.b(12,10.5,6.2,5,pk);D.l(12,5.5,12,3.5,.9,'#3a7d2e');for(const[cx,cy]of[[10.6,2.4],[13.4,2.4],[12,1],[12,3.6]])D.e(cx,cy,1.4,1.2,'#58c048');
 D.eye(9.4,10.4,1.7);D.eye(14.6,10.4,1.7);D.p([[10.6,13],[12,14.4],[13.4,13]],'#8a2a60');D.r(11.5,13,1,.8,'#ffffff')},
LANTERNWISP(D){const bd='#e6e0f6',sh='#c8bfe6';
 D.p([[7.5,13],[9,21.5],[11,18.5],[12.5,22],[14,18.5],[16,21],[16.5,13]],sh);
 D.b(12,11.5,6.2,6.6,bd);D.e(12,15.2,4.6,2.2,sh);
 D.eye(10.2,10.6,1.35);D.eye(13.8,10.6,1.35);D.e(12,13.4,1,.55,'#9a7ab8');
 D.l(16.5,13.5,19.4,10.2,.9,'#6a4a2a');D.e(20.4,12.2,3.2,3.2,'rgba(255,224,110,.35)');
 D.r(19.1,10.4,2.6,3.6,'#3a3040');D.r(19.6,11,1.6,2.4,'#ffd94d');D.r(19.3,9.6,2.2,.9,'#3a3040')},
BESSLING(D){const tl='#3aa0a8',dk='#287880',cr='#c8f0e8';
 D.p([[20,17],[23.6,13.2],[22.6,18.6]],tl);D.p([[9,20],[5.4,22.8],[10.6,22]],dk);D.p([[17,20.6],[20,23],[21,20.4]],dk);
 D.b(14,18,7,4.2,tl);D.e(13,19.8,5,1.9,cr);
 D.p([[11.6,14],[13,11.4],[14.4,14]],'#ffe070');D.p([[15.2,14.4],[16.4,12.4],[17.6,14.6]],'#ffe070');
 D.l(9.6,16.4,7.6,8,3.6,tl);D.l(9.2,16,7.6,9.4,1.4,cr);D.b(6.6,6.2,3.9,3.2,tl);D.e(4.1,7.3,2,1.4,cr);
 D.p([[6.8,3.4],[8,.8],[9.4,3.4]],'#ffe070');D.eye(5.8,5.6,1.5);D.eye(8.8,5.5,1.2);D.r(3.4,8,1.6,.6,dk)}};
const WBDESC={"CINDERCAP": "A mushroom imp with a smoldering cap. Warms anything it sits on.", "PEBBLIT": "A pebble pup. Fetches rocks. Is a rock. Conflicted but happy.", "DRIZZLET": "A rain droplet that never landed. Perpetually delighted about it.", "ZIPWIG": "A beetle full of static. Do not pet it near water. Or at all.", "FERNFANG": "A fern with fangs. Gardeners respect it. Fingers fear it.", "CLOVERIMP": "It finds lost things. It lost them in the first place, but still."};
const WSPEC={};
function wSp(id){if(!WSPEC[id]&&SWBUD[id])WSPEC[id]={id,d:WBDESC[id]||'',_spr:swbMake(SWBUD[id])};return WSPEC[id]}
