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
/* ---- the soul lamp ---- */
{const _sb=wStoryBeats;wStoryBeats=function(){_sb();wExpTick(1/60);
 if(SCOFF||state!=='g4world'||W4.scene||swBusy()||(W4.scPend&&W4.scPend.length)||(W4.banner&&W4.banner.t>0))return;const L=SW.lessons;
 if(L.defeat1===2&&!L.soul1&&!W4.fld&&W4.sector==='BASE'){L.soul1=1;SW.soulLamp=1;const n=SW.souls||1;
  scStart([{hold:.5},{who:'',txt:'Back at Sunkeep, a word drifts through your head, smooth as oil. Hasbara. You do not know where you heard it.'},
   {who:'',txt:'Then an idea, clear as day. The ones that are gone: their light does not have to be lost. It could be kept.'},
   {who:'',txt:'You dig an old lamp out of your pack. It hums. Inside, '+(n===1?'one small light':n+' small lights')+'. You do not know what to do with them yet.'},
   {who:'ERIN',txt:'Is that... keeper, where did you get that idea?'},{who:'',txt:'Your own head. Obviously.'},
   {who:'ERIN',txt:'Marcus. The keeper wants to keep the souls of the buddies we lost.'},
   {who:'MARCUS',txt:"Bro. You're J-lighting again."},
   {who:'MARCUS',txt:"Making up a story and calling it yours. You're way too beholden to King Bibi."},
   {who:'ERIN',txt:'...It might still be a good idea. Keep the lamp. Maybe one day we can show them the light after all.'},
   {who:'',txt:'You got the SOUL LAMP. It keeps the light of every buddy you could not save.'},{hold:.3}],()=>swSave())}}}
{const _fd=wFoeDown;wFoeDown=function(){const wild=BT.mode==='wild';_fd();if(wild&&SW.soulLamp){const i=BT.log.findIndex(l=>l.txt.startsWith('The dark breaks'));if(i>=0)BT.log.splice(i+1,0,{txt:'Its light drifts into your SOUL LAMP.'})}}}
