/* ================================================================
   DARK AND LIT (v9.4): the core reward of the game, on screen.
   Every wild buddy, alpha and glitched foe is drawn in its DARK form:
   a purple-black tint and a faint haze rising off it. Calm it and the
   dark drains away in a burst of light: in battle the foe no longer
   faints and sinks, it lights up where it stands.
   ================================================================ */
/* the dark form of a sprite, made once and kept on the sprite */
function wDarkImg(spr){if(spr.dk!==undefined)return spr.dk;spr.dk=null;
 try{const c=document.createElement('canvas');c.width=spr.ol.width;c.height=spr.ol.height;const x=c.getContext('2d');if(!x||!x.drawImage)return null;
  x.drawImage(spr.ol,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(34,10,58,.58)';x.fillRect(0,0,c.width,c.height);spr.dk=c}catch(e){spr.dk=null}
 return spr.dk}
/* a faint haze rising off a dark buddy; x,y = its feet, h = its height */
function wDarkHaze(x,y,h,seed){for(let i=0;i<4;i++){const k=((time*.5+i*.25+seed*.13)%1),hx=Math.round(x-6+i*4+Math.sin(time*2+i+seed)*2),hy=Math.round(y-h*.4-k*h*.9);
  g.globalAlpha=.35*(1-k);r(i%2?'#3a1a5a':'#5a2a7a',hx,hy,2,2);g.globalAlpha=1}}
/* is this battle's foe one of the dark ones? (every mode but the old trainer battles) */
function wFoeDark(){return BT&&BT.mode!=='trainer'}
/* ================================================================
   TIMED STRIKE (v9.5, a prototype for Will's battle question): after
   you pick a damaging move, a ring closes in on the foe. Press A as it
   meets the target ring: GREAT is +30% damage, GOOD +12%, a miss is a
   normal hit. If you never press, the ring runs out and you hit
   normally, so nobody is punished for not knowing.
   ================================================================ */
const WAIM={T:1.0,R0:44,R1:10};
function aimR(){return WAIM.R0-(WAIM.R0-WAIM.R1)*Math.min(1.25,(BT.aimT||0)/(WAIM.T*.8))}
function aimUpdate(dt){BT.aimT=(BT.aimT||0)+dt;const rr=aimR();let q=null;
 if(pressed('a')){const d=Math.abs(rr-WAIM.R1);q=d<=4.5?'GREAT':d<=10?'GOOD':'MISS'}else if(BT.aimT>=WAIM.T)q='MISS';
 if(!q)return;BT.aimX=q==='GREAT'?1.3:q==='GOOD'?1.12:0;BT.aimQ={q,t:time};if(q!=='MISS')swSnd(q==='GREAT'?1046:784,.08,1568);
 SW.lessons.aimN=(SW.lessons.aimN||0)+1;const mv=BT.aimMv;BT.aimMv=null;BT.phase='msg';BT.t=0;wResolveTurn(mv);BT.aimX=0;
 if(q!=='MISS'&&BT.log&&BT.log.length){const i=BT.log.findIndex(l=>l.txt.indexOf(' used ')>0&&l.txt.startsWith(btCur().sp+' '));if(i>=0)BT.log.splice(i+1,0,{txt:q==='GREAT'?'GREAT timing! It hit hard.':'Good timing!'})}}
function aimDraw(){if(!BT)return;const fg=BT._fg||[W*.71,120];
 if(BT.phase==='aim'){const x=Math.round(fg[0]),y=Math.round(fg[1])-14,rr=aimR(),ring=(rad,c,w)=>{if(!g.beginPath)return;g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.arc(x,y,Math.max(1,rad),0,6.3);g.stroke()};
  ring(WAIM.R1,'#ffffff',2);ring(WAIM.R1+3,'rgba(255,255,255,.35)',1);ring(rr,'#ffd94d',2);
  const t2='PRESS A!';r('#14101e',x-tw(t2,1)/2-3,y+WAIM.R0+2,tw(t2,1)+6,10);text(t2,x-tw(t2,1)/2,y+WAIM.R0+3,1,'#ffd94d',null);
  if((SW.lessons.aimN||0)<3){const t3='as the gold ring meets the white one';r('#14101e',W/2-tw(t3,1)/2-3,y+WAIM.R0+14,tw(t3,1)+6,10);text(t3,W/2-tw(t3,1)/2,y+WAIM.R0+15,1,'#ffffff',null)}}
 const Q=BT.aimQ;if(Q&&time-Q.t<.9&&Q.q!=='MISS'){const k=(time-Q.t)/.9;g.globalAlpha=1-k;const t2=Q.q+'!';text(t2,Math.round(fg[0]-tw(t2,2)/2),Math.round(fg[1]-44-k*10),2,Q.q==='GREAT'?'#ffd94d':'#ffffff',null);g.globalAlpha=1}}
