/* ================================================================
   v10.5 (Will, Nov 17): EXPEDITIONS and THE SOUL LAMP.

   EXPEDITIONS. "Send them on expeditions to give buddies the light
   in faraway regions... a way to manage the growth of them. I don't
   want the base to be extremely hard, but I don't want it brain
   dead." Spare sprouts leave from the Lantern in a party of three,
   are gone about three minutes of play, and come home with what
   their kind finds, plus a gratitude heart for the light they
   carried. If you own more sprouts than your pouch holds, one of
   the party stays out there to carry on the mission: that is the
   gentle trim on a crowd.

   THE SOUL LAMP. A defeat kills the buddy. After the first one, a
   thought arrives at Sunkeep that feels like the keeper's own (it
   is King Bibi's HASBARA, and the player is not told). The keeper
   finds a lamp that holds the lights of the lost. Marcus calls it
   J-lighting. The lamp's name and what it does later are Will's to
   decide; this only sets it up and keeps count.
   ================================================================ */
const WEXP_T=180,WEXP_N=3;
const WEXP=[{to:'the Ember Wastes',res:'ore',q:2},{to:'the Far Quarry',res:'stone',q:3},{to:'the Long Lake',res:'berry',q:4},{to:'the Spark Hills',res:'fiber',q:3},{to:'the Deep Woods',res:'wood',q:3},{to:'the Old Road',res:'petal',q:15}];
function wExpMax(){return wHasDC()?2:1}
function wExpRows(){return TYPES.map((T,i)=>({i,T,n:SW.buds[T.n]||0})).filter(r2=>WEXP[r2.i]&&r2.n>0)}
function wExpSend(i){const T=TYPES[i],E=WEXP[i];SW.exp=SW.exp||[];
 if(SW.quest<5)return'ERIN: Get a roof on Sunkeep first. Then the Lantern can send them.';
 if(SW.exp.length>=wExpMax())return wHasDC()?'Two parties are out already.':'A party is out already. A BUDDY BARN lets you send two.';
 if((SW.buds[T.n]||0)<WEXP_N)return'It takes '+WEXP_N+' '+T.n+' sprouts to make a party.';
 if(wBudTotal()-WEXP_N<2)return'Keep a couple of sprouts with you.';
 SW.buds[T.n]-=WEXP_N;SW.exp.push({i,n:WEXP_N,t:WEXP_T});swSnd(660,.08,990);swSave();
 if(W4.fld||W4.bf){const F=W4.fld||W4.bf;let k=WEXP_N;if(F.sq)F.sq=F.sq.filter(s=>!(s.type===i&&s.st==='follow'&&k-->0))}
 return WEXP_N+' '+T.n+' sprouts set out for '+E.to+', carrying the light.'}
function wExpTick(dt){if(!SW.exp||!SW.exp.length||state!=='g4world')return;
 for(const e of SW.exp)e.t-=dt;const back=SW.exp.filter(e=>e.t<=0);if(!back.length||swBusy()||W4.scene)return;
 const e=back[0],T=TYPES[e.i],E=WEXP[e.i];SW.exp.splice(SW.exp.indexOf(e),1);
 const stay=wBudTotal()+e.n>(SW.pouch||8)?1:0,home=e.n-stay;SW.buds[T.n]=(SW.buds[T.n]||0)+home;
 if(E.res==='petal')SW.res.petal=(SW.res.petal||0)+E.q;else SW.res[E.res]=(SW.res[E.res]||0)+E.q;
 SW.hearts=(SW.hearts||0)+1;SW.heartsTotal=(SW.heartsTotal||0)+1;SW.farLight=(SW.farLight||0)+e.n;
 swSnd(784,.1,1175);swSay('Your '+T.n+' sprouts are back from '+E.to+': +'+E.q+' '+E.res.toUpperCase()+', +1 ♥.'+(stay?' One stayed out there to carry the light on.':''),5);swSave()}
function expUpdate(){const rows=wExpRows();swNav(rows.length+1);
 if(pressed('b')){state='g4pause';swSel=8;return}
 if(pressed('a')){if(swSel>=rows.length){state='g4pause';swSel=8;return}W4.expMsg=wExpSend(rows[swSel].i);W4.expMsgAt=time;swSel=Math.min(swSel,wExpRows().length)}}
function drawExp(){const rows=wExpRows(),out=SW.exp||[];swShell('EXPEDITIONS',out.length+' of '+wExpMax()+' out');
 const items=rows.map(r2=>({a:r2.T.n+' x'+r2.n,b:'to '+WEXP[r2.i].to})).concat([{a:'BACK',b:''}]);
 const outTxt=out.length?' Out now: '+out.map(e=>TYPES[e.i].n+' ('+Math.max(1,Math.ceil(e.t/60))+' min)').join(', ')+'.':'';
 swRows(items,swSel,W4.expMsg&&time-W4.expMsgAt<4?W4.expMsg:swSel<rows.length?'A: send '+WEXP_N+' '+rows[swSel].T.n+' sprouts. They bring back '+WEXP[rows[swSel].i].res.toUpperCase()+' and a heart.'+outTxt:'Spare sprouts carry the light to far places.'+outTxt)}
/* the pause menu gets a ninth tile; the grid goes to five shorter rows */
WMENU.push(['EXPEDITION','pack']);
{const _sub=wMenuSub;wMenuSub=function(k){return k==='EXPEDITION'?((SW.exp||[]).length?(SW.exp||[]).length+' out':'send sprouts'):_sub(k)}}
{const _ic=wMenuIcon;wMenuIcon=function(k,x,y,on){if(k!=='pack')return _ic(k,x,y,on);const K='#14101e',a=on?'#a33b2e':'#ffd23f';r(K,x+2,y+2,9,10);r('#58c048',x+3,y+3,7,8);r(a,x+3,y+6,7,2);r(K,x+4,y,5,2);r('#f8f4e0',x+5,y+4,3,1)}}
drawPause=function(){const K='#14101e';r('#101820',0,0,W,H);for(let i=0;i<30;i++)r('#16222c',(i*67)%W,(i*41)%H,2,2);
 r('#1d2b18',0,0,W,40);r(UI.gold,0,40,W,1);const sec=wSector(W4.sector);
 text(wFit(sec?sec.n:'SUNKEEP',150),8,6,1,'#ffd94d',null);const dl='DAY '+(SW.day||1)+' · FILE '+(wSlot+1);text(dl,W-8-tw(dl,1),6,1,UI.dim,null);
 const sg=Object.values(WASIG);text('SIGILS',8,24,1,'#e8e4f5',null);
 sg.forEach((S,i)=>{const x=52+i*20,y=20,got=SW.badges.includes(S.n);r(K,x+2,y,8,14);r(K,x,y+2,12,10);r(got?S.d:'#2a3340',x+3,y+1,6,12);r(got?S.d:'#2a3340',x+1,y+3,10,8);r(got?S.c:'#3a4656',x+3,y+3,6,8);if(got)r('#ffffff',x+4,y+4,2,2)});
 const ns=SW.badges.length,goal='LIGHT '+(SW.shown||0)+(SW.soulLamp?' · SOULS '+(SW.souls||0):'');text(goal,W-8-tw(goal,1),24,1,ns>=4?'#ffd94d':'#c8c0d8',null);
 WMENU.forEach(([k,ic],i)=>{const cx=i%2,cy=(i/2)|0,x=8+cx*114,y=46+cy*36,on=i===swSel,w=110,h=33;
  r(on?'#ffd23f':K,x,y,w,h);r(on?'#fff3b0':'#1f2a36',x+1,y+1,w-2,h-2);if(!on)r('#2a3846',x+1,y+1,w-2,2);
  r(on?'#f8e060':'#16202a',x+6,y+7,18,18);wMenuIcon(ic,x+9,y+10,on);
  text(wFit(k,w-34),x+30,y+6,1,on?'#281c30':'#ffffff',null);text(wFit(wMenuSub(k),w-34),x+30,y+18,1,on?'#5a4a28':'#8fa0b0',null)});
 const yb=232;r(K,0,yb,W,1);const items=[['SPROUTS',wBudTotal()+'/'+(SW.pouch||8),'#58c048'],['TONIC',SW.tonics,'#e04838'],['BERRY',SW.res.berry,'#e04838'],['WOOD',SW.res.wood,'#a8865c'],['STONE',SW.res.stone,'#c8ccd4'],['ORE',SW.res.ore||0,'#c89058'],['INGOT',SW.res.ingot,'#f8e060'],['FIBER',SW.res.fiber||0,'#7ee787']];
 items.forEach(([n,v,c],i)=>{const x=8+(i%4)*58,y=yb+8+((i/4)|0)*22;r(c,x,y+1,5,5);text(n,x+8,y,1,UI.dim,null);text(''+v,x+8,y+9,1,'#ffffff',null)});
 r('#0c1218',0,H-14,W,14);text('A  OPEN',8,H-11,1,'#7ee787',null);const bb='B  BACK TO PLAY';text(bb,W-8-tw(bb,1),H-11,1,'#a89ec2',null)};
{const _pu=swPauseUpdate;swPauseUpdate=function(){if(pressed('a')&&WMENU[swSel]&&WMENU[swSel][0]==='EXPEDITION'){swSel=0;W4.expMsg=null;state='g4exp';return}_pu()}}
/* ---- the soul lamp ----
   v10.6 (Will): two beats, spaced out so they do not land on top of "build the cottage".
   1. Right after the first kill and Erin's "why": a cut-in in the style of the HASBARA super in Knockout.
      Here it is KING BIBI at the desk, and the target on his screen is the keeper. He beams the idea in.
      The keeper thinks it is their own.
   2. After the cottage is built and its party is over: the keeper finds the lamp and tells Marcus. J-lighting. */
const BEAM=[1.0,5.0,7.2];
function beamStart(){const L=SW.lessons;if(L.soul1)return;L.soul1=1;if(SCOFF){swSave();return}W4.beamT=0;W4.talk=null;state='g4beam';swSnd(196,.25,98)}
function beamAfter(){state='g4world';const K_=SW.keeper||'WILL';
 scStart([{hold:.5},{who:K_,self:1,txt:'...Huh.'},{who:K_,self:1,txt:"What if their light isn't lost? What if somebody could keep it?"},
  {who:'ERIN',txt:'Where did that come from?'},{who:K_,self:1,txt:'My own head. Obviously.'},{hold:.3}],()=>swSave())}
function beamUpdate(dt){const t0=W4.beamT||0;W4.beamT=t0+dt;const t=W4.beamT,cross=a=>t0<a&&t>=a;
 if(cross(.22))swSnd(880,.12,1760);if(cross(BEAM[0]))swSnd(330,.1,220);if(cross(BEAM[0]+3.4))swSnd(1046,.14,1568);if(cross(BEAM[1]))swSnd(220,.5,880);if(cross(BEAM[1]+1.1))swSnd(1318,.2,1975);
 if(t>=BEAM[2]||(t>1&&(pressed('start')||(t>BEAM[1]+1.2&&pressed('a')))))beamAfter()}
function beamDraw(){const t=W4.beamT||0,cy=Math.round(H/2),K='#14101e',BB=FLOOK['KING BIBI'],KP=FLOOK[SW.keeper]||FLOOK.WILL;
 const circ=(x,y,rad,c,w)=>{if(!g.beginPath)return;g.strokeStyle=c;g.lineWidth=w||1;g.beginPath();g.arc(x,y,Math.max(1,rad),0,6.3);g.stroke()};
 if(t<BEAM[0]){const e=Math.min(1,t/.18),sl=Math.round((1-e)*W);r('#08060e',0,0,W,H);
  if(g.save){g.save();g.translate(W/2,cy);g.rotate(-.32);r('#1e2c5a',-W+sl*1.5,-66,W*2,24);r('#1e2c5a',-W-sl*1.5,42,W*2,24);r('#f8e040',-W-sl,-36,W*2,72);r(K,-W+sl,-32,W*2,4);r(K,-W+sl,28,W*2,4);
   for(let i=0;i<70;i++){const px=-W+((i*29+t*260)%(W*2)),py=-26+(i*13)%52;r('rgba(20,16,24,.25)',Math.round(px),py,3,3)}g.restore()}
  const bx=Math.round(W/2+(1-e)*130),by=cy+26;r(K,bx-34,by-78,68,84);r('#ffffff',bx-32,by-76,64,80);r('#58a0f0',bx-30,by-74,60,76);
  fChibi(bx,by-6,Object.assign({},BB,{sc:3}),[0,1],false);
  r(K,bx+22,by-88,20,20);r('#f8e040',bx+24,by-86,16,16);r(K,bx+27,by-78,10,5);r(K,bx+27,by-82,2,4);r(K,bx+31,by-83,2,5);r(K,bx+35,by-82,2,4);
  if(t>.22){const tx='HASBARA';r(K,0,by+12,W,24);text(tx,Math.round(W/2-tw(tx,3)/2),by+15,3,'#ffffff',null);const s2='KING BIBI';text(s2,Math.round(W/2-tw(s2,1)/2),by+40,1,'#f8e060',K)}
  if(t<.05)r('#ffffff',0,0,W,H);return}
 if(t<BEAM[1]){const tt=t-BEAM[0],T=BEAM[1]-BEAM[0],k=tt/T,base=H-6,deskY=base-54,mw=66,mh=56,my=96,top=30,mx=[8,87,166];
  r('#070a10',0,0,W,H);r('#0c1622',8,top,W-16,my-top-12);for(let i=0;i<12;i++)r('#12304a',8+i*19,top,1,my-top-12);for(let j=0;j*15<my-top-12;j++)r('#12304a',8,top+j*15,W-16,1);
  for(let i=0;i<10;i++)if(((tt*5+i)|0)%2)r('#40ff90',20+(i*37)%200,top+4+(i*17)%40,2,2);
  text('INSIDE THE IRON DOME',Math.round(W/2-tw('INSIDE THE IRON DOME',1)/2),top-14,1,'#4a8a7a',null);
  mx.forEach((x,i)=>{r('#202834',x-2,my-2,mw+4,mh+4);r('#060a0e',x,my,mw,mh);r('#202834',x+mw/2-3,my+mh+2,6,8);g.globalAlpha=.8+.2*Math.sin(tt*30+i*2);
   if(i===0){text('ROYAL',x+3,my+3,1,'#40ff90',null);text('HASBARA',x+3,my+13,1,'#40ff90',null);text('DESK',x+3,my+23,1,'#40ff90',null);for(let j=0;j<2;j++)r('#2a8a5a',x+3,my+38+j*7,Math.round(8+((tt*60+j*17)%50)),3)}
   if(i===1){if(g.save){g.save();g.beginPath();g.rect(x,my,mw,mh);g.clip()}fChibi(x+mw/2,my+52,Object.assign({},KP,{sc:2}),[0,1],false);if(g.save)g.restore();const rr=17+Math.round(Math.sin(tt*10)*2);circ(x+mw/2,my+24,rr,'#ff4040',2);r('#ff4040',x+2,my+24,8,1);r('#ff4040',x+mw-10,my+24,8,1);text('TARGET',x+3,my+mh-10,1,'#ff6060',null)}
   if(i===2){const Ln=['THE LOST','THE LIGHT','KEEP IT','HIS IDEA'],n=Math.min(Ln.length,1+Math.floor(k*5));for(let j=0;j<n;j++)text(Ln[j],x+3,my+3+j*10,1,j===n-1&&k<.86?'#ffffff':'#40c0ff',null);r('#163040',x+3,my+mh-8,mw-6,4);r('#40c0ff',x+3,my+mh-8,Math.round((mw-6)*Math.min(1,k*1.15)),4)}
   g.globalAlpha=1});
  if(k>.84){const s_='BEAMED!';r('#062010',mx[2]+3,my+17,mw-6,17);r('#40ff90',mx[2]+4,my+18,mw-8,15);text(s_,Math.round(mx[2]+mw/2-tw(s_,1)/2),my+22,1,'#062010',null)}
  r('#3a3a48',0,deskY,W,1);r('#2a2a34',0,deskY+1,W,5);r('#16161e',0,deskY+6,W,H-deskY);
  fChibi(Math.round(W/2),base-30,Object.assign({},BB,{sc:3}),[0,-1],((tt*8)|0)%2===0);
  for(let i=0;i<10;i++)if(((tt*24+i*3)|0)%4===0)r('#40ff90',W/2-24+i*5,deskY-2,2,1);
  const cap=swWrap(k<.45?'KING BIBI: The little keeper is asking why.':'KING BIBI: Give him an answer. Make it feel like his own.',W-16).slice(0,2);r('rgba(7,10,16,.9)',0,H-30,W,30);r('#f8e040',0,H-30,W,1);cap.forEach((l,j)=>text(l,Math.round(W/2-tw(l,1)/2),H-25+j*11,1,'#f8e060',null));return}
 {const tt=t-BEAM[1],hx=Math.round(W/2),hy=Math.round(H*.72);r('#0a1020',0,0,W,H);for(let i=0;i<40;i++)r('#1c2a48',(i*53)%W,(i*31)%Math.round(H*.6),1,1);
  r('#16301c',0,hy+6,W,H-hy);r('#1e4226',0,hy+6,W,2);
  const reach=Math.min(1,tt/.5),x0=W+10,y0=-10,x1=x0+(hx-x0)*reach,y1=y0+(hy-46-y0)*reach;
  if(g.beginPath){for(const [w,c] of [[14,'rgba(88,160,240,.25)'],[7,'rgba(160,210,255,.6)'],[2,'#ffffff']]){g.strokeStyle=c;g.lineWidth=w+Math.sin(tt*30)*1.5;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke()}}
  fChibi(hx,hy,Object.assign({},KP,{sc:3}),[0,1],false);
  if(reach>=1){for(let i=0;i<3;i++)circ(hx,hy-46,6+((tt*40+i*9)%26),'rgba(160,210,255,'+(.7-((tt*40+i*9)%26)/40)+')',2);
   const wds=['hasbara','keep it','their light','your idea'];wds.forEach((w2,i)=>{const a=tt*2+i*1.57,x=hx+Math.cos(a)*54,y=hy-50+Math.sin(a)*22;text(w2,Math.round(x-tw(w2,1)/2),Math.round(y),1,'rgba(160,210,255,.8)',null)})}
  if(tt>1.1){r(K,hx-7,hy-92,14,18);r('#fff8a0',hx-5,hy-90,10,11);r('#f8e040',hx-3,hy-88,6,7);r('#c8ccd4',hx-3,hy-79,6,3);const s2='AN IDEA!';text(s2,Math.round(hx-tw(s2,2)/2),hy-116,2,'#fff8a0',K)}
  if(tt>BEAM[2]-BEAM[1]-.15)r('#ffffff',0,0,W,H)}}
{const _sb=wStoryBeats;wStoryBeats=function(){_sb();wExpTick(1/60);
 if(SCOFF||state!=='g4world'||W4.scene||swBusy()||(W4.scPend&&W4.scPend.length)||(W4.banner&&W4.banner.t>0))return;const L=SW.lessons;
 if(L.defeat1===2&&!L.soul1&&wBeamReady()){beamStart();return}
 if(L.soul1&&!L.soul2&&SW.soulLamp){L.soul2=1;return} /* a v10.5 save already has the lamp */
 if(L.soul1&&!L.soul2&&L.scDab&&wHasRoof()&&!W4.fld&&W4.sector==='BASE'){W4.soulW=(W4.soulW||0)+1/60;if(W4.soulW<25)return;
  L.soul2=1;SW.soulLamp=1;const n=SW.souls||1,K_=SW.keeper||'WILL';
  scStart([{hold:.5},{who:'',txt:'Unpacking in the new cottage, you find an old lamp at the bottom of your bag. It hums. Inside, '+(n===1?'one small light':n+' small lights')+'.'},
   {who:K_,self:1,txt:'Marcus. I had an idea. The buddies we lose: this lamp can keep their light. Their souls.'},
   {who:'MARCUS',txt:"Bro. You're J-lighting again."},
   {who:'MARCUS',txt:"Making up a story and calling it yours. You're way too beholden to King Bibi."},
   {who:K_,self:1,txt:'It is MY idea.'},
   {who:'ERIN',txt:'...It might still be a good one. Keep the lamp. Maybe one day we can show them the light after all.'},
   {who:'',txt:'You got the SOUL LAMP. It keeps the light of every buddy you could not save.'},{hold:.3}],()=>swSave())}}}
{const _fd=wFoeDown;wFoeDown=function(){const wild=BT.mode==='wild';_fd();if(wild&&SW.soulLamp){const i=BT.log.findIndex(l=>l.txt.startsWith('The dark breaks'));if(i>=0)BT.log.splice(i+1,0,{txt:'Its light drifts into your SOUL LAMP.'})}}}
