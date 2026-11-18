/* ================================================================
   CLANKAWATCH v4 — LOOSE PETALS
   Found by playing it: once the sprouts are down, a night is
   mostly watching. Now the Heart throws off a few petals during
   each night. They land on the lawn; walk the cursor onto one to
   pick it up. Miss it and it fades after nine seconds.
   Money stays honest (handoff rule 4): the petals are half of the
   dawn bonus, paid early. What you pick up comes off the bonus at
   dawn, plus a quarter extra for catching it. So a night pays at
   most an eighth of its dawn bonus more than v3.7 (2 to 6 petals),
   and never less.
   ================================================================ */
function twMotePlan(){const bonus=14+3*TWR.night,k=Math.max(2,Math.min(5,2+Math.floor(TWR.night/3)));return{k,face:Math.max(1,Math.floor(bonus*.5/k))}}
function twMoteReset(){TWR.motes=[];TWR.moteN=0;TWR.moteFace=0;TWR.q0=Math.max(1,TWR.queue.length)}
function twMoteCell(){const xs=twCellXs(),ys=twCellYs();
 for(let i=0;i<40;i++){const x=xs[(Math.random()*xs.length)|0],y=ys[(Math.random()*ys.length)|0];
  if(twDistToPath(x,y)<12)continue;if(x===TWR.cur.x&&y===TWR.cur.y)continue;
  if(TWR.motes.some(m=>m.x===x&&m.y===y))continue;
  const d=Math.abs(x-TWR.cur.x)/16+Math.abs(y-TWR.cur.y)/16;if(d<2||d>9)continue;return{x,y}}
 return null}
function twMotes(dt){if(!TWR.round||!TWR.motes)return;const P=twMotePlan(),done=1-TWR.queue.length/TWR.q0;
 if(TWR.moteN<P.k&&done>=(TWR.moteN+1)/(P.k+1)){const c=twMoteCell();
  if(c){const hp=twHeartPos();TWR.motes.push({x:c.x,y:c.y,t:0,life:9,face:P.face,fx:hp.x,fy:hp.y-8});TWR.moteN++;snd(1180,.05,1560,'triangle',.03);
   if(!TW.seen)TW.seen={};if(!TW.seen.mote){TW.seen.mote=1;twSave();TWR.say='WOOF! A petal! Walk onto it!';TWR.sayT=3}}}
 for(let i=TWR.motes.length-1;i>=0;i--){const m=TWR.motes[i];m.t+=dt;
  if(m.t>.45&&TWR.cur.x===m.x&&TWR.cur.y===m.y){const pay=m.face+Math.max(1,Math.round(m.face*.25));
   TWR.petals+=pay;TWR.earned+=pay;TWR.moteFace+=m.face;TWR.motes.splice(i,1);
   twFloat(m.x,m.y-12,'+'+pay,'#ffd7e8');twBurst(m.x,m.y-4,'#f8a0c8',6);TWR.flies.push({x:m.x,y:m.y,t:0});snd(990,.07,1480)}
  else if(m.t>m.life)TWR.motes.splice(i,1)}}
function twDrawMotes(){if(!TWR||!TWR.motes)return;
 for(const m of TWR.motes){const k=Math.min(1,m.t/.45),x=Math.round(m.fx+(m.x-m.fx)*k),y=Math.round(m.fy+(m.y-m.fy)*k-Math.sin(k*3.14)*18);
  if(m.life-m.t<2.5&&((time*8)|0)%2)continue;
  const bob=k>=1?Math.round(Math.sin(time*4+m.x)*1.5):0;
  if(k>=1){g.globalAlpha=.22+.1*Math.sin(time*5);r('#ffd7e8',x-7,y-9,14,14);g.globalAlpha=1;r('rgba(0,0,0,.25)',x-4,y+3,8,2)}
  g.drawImage(twOL(TWPETAL,10,10),x-6,y-9+bob)}}
