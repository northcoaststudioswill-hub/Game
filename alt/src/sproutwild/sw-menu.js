/* ================================================================
   THE PAUSE MENU (v9.2): Will: "the pause menus are still ugly".
   A header with where you are, the day and your four Sigils (lit in
   their own colours), then eight big tiles with an icon each, in a
   2 x 4 grid. D-pad moves round the grid, A opens, B resumes.
   Your supplies sit along the bottom with their icons.
   ================================================================ */
const WMENU=[['BUDDIES','buddy'],['BUDDY GUIDE','book'],['BUG JAR','jar'],['BUILD','hammer'],['MAP','map'],['WORK BOARD','board'],['GUIDE','help'],['SAVE & QUIT','door']];
function wMenuSub(k){const nb=SW.party.length+SW.box.length;
 return k==='BUDDIES'?nb+(nb===1?' buddy':' buddies'):k==='BUDDY GUIDE'?Object.keys(SW.caught).length+'/'+WSPECIES.length+' met':k==='BUG JAR'?Object.values(SW.bugs||{}).reduce((a,v)=>a+v,0)+' bugs':
  k==='BUILD'?(W4.sector==='BASE'?'at home':'only at home'):k==='MAP'?'the valley':k==='WORK BOARD'?'Sunkeep Lv'+SW.baseLv:k==='GUIDE'?'how it works':'to the title'}
function wMenuIcon(k,x,y,on){const K='#14101e',c=on?'#281c30':'#e8e4f5',a=on?'#a33b2e':'#ffd23f';
 if(k==='buddy'){r(K,x+1,y+2,10,9);r(a,x+2,y+3,8,7);r(K,x+4,y+5,1,2);r(K,x+7,y+5,1,2);r(a,x+2,y+1,2,2);r(a,x+8,y+1,2,2)}
 else if(k==='book'){r(K,x,y+1,12,10);r(a,x+1,y+2,5,8);r(a,x+6,y+2,5,8);r(K,x+6,y+2,1,8)}
 else if(k==='jar'){r(K,x+2,y,8,2);r(K,x+1,y+2,10,10);r('#7fd0e8',x+2,y+3,8,8);r('#ffd94d',x+4,y+6,2,2);r('#e04838',x+7,y+8,2,2)}
 else if(k==='hammer'){r(K,x+1,y+1,10,5);r('#c8ccd4',x+2,y+2,8,3);r(K,x+5,y+5,3,7);r('#a8865c',x+6,y+5,1,6)}
 else if(k==='map'){r(K,x,y+1,12,10);r('#e8d8a8',x+1,y+2,10,8);r('#58b848',x+2,y+3,3,3);r('#7fd0e8',x+6,y+6,3,3);r('#a33b2e',x+7,y+3,2,2)}
 else if(k==='board'){r(K,x,y,12,11);r('#a8865c',x+1,y+1,10,9);r('#f8f4e0',x+2,y+2,3,3);r('#f8f4e0',x+6,y+2,3,3);r('#f8f4e0',x+2,y+6,7,2)}
 else if(k==='help'){r(K,x+2,y,8,12);r(a,x+3,y+1,6,10);r(K,x+5,y+3,2,1);r(K,x+6,y+4,1,2);r(K,x+5,y+6,1,1);r(K,x+5,y+8,1,1)}
 else{r(K,x+1,y,10,12);r('#8a6a48',x+2,y+1,8,11);r('#ffd94d',x+7,y+6,2,2)}}
function drawPause(){const K='#14101e';r('#101820',0,0,W,H);for(let i=0;i<30;i++)r('#16222c',(i*67)%W,(i*41)%H,2,2);
 /* header: where, when, and the four Sigils */
 r('#1d2b18',0,0,W,40);r(UI.gold,0,40,W,1);const sec=wSector(W4.sector);
 text(wFit(sec?sec.n:'SUNKEEP',150),8,6,1,'#ffd94d',null);const dl='DAY '+(SW.day||1)+' · FILE '+(wSlot+1);text(dl,W-8-tw(dl,1),6,1,UI.dim,null);
 const sg=Object.values(WASIG);text('SIGILS',8,24,1,'#e8e4f5',null);
 sg.forEach((S,i)=>{const x=52+i*20,y=20,got=SW.badges.includes(S.n);r(K,x+2,y,8,14);r(K,x,y+2,12,10);r(got?S.d:'#2a3340',x+3,y+1,6,12);r(got?S.d:'#2a3340',x+1,y+3,10,8);r(got?S.c:'#3a4656',x+3,y+3,6,8);if(got)r('#ffffff',x+4,y+4,2,2)});
 const ns=SW.badges.length,goal=ns>=4?(SW.fl&&SW.fl.bibi?'BOTTIE AWAITS':'SEE THE KING'):(4-ns)+' ALPHA'+(4-ns===1?'':'S')+' LEFT';text(goal,W-8-tw(goal,1),24,1,ns>=4?'#ffd94d':'#c8c0d8',null);
 /* eight tiles */
 WMENU.forEach(([k,ic],i)=>{const cx=i%2,cy=(i/2)|0,x=8+cx*114,y=50+cy*44,on=i===swSel,w=110,h=40;
  r(on?'#ffd23f':K,x,y,w,h);r(on?'#fff3b0':'#1f2a36',x+1,y+1,w-2,h-2);if(!on)r('#2a3846',x+1,y+1,w-2,2);
  r(on?'#f8e060':'#16202a',x+6,y+8,18,18);wMenuIcon(ic,x+9,y+11,on);
  text(wFit(k,w-34),x+30,y+9,1,on?'#281c30':'#ffffff',null);text(wFit(wMenuSub(k),w-34),x+30,y+22,1,on?'#5a4a28':'#8fa0b0',null)});
 /* supplies */
 const yb=232;r(K,0,yb,W,1);const items=[['SPROUTS',wBudTotal()+'/'+(SW.pouch||8),'#58c048'],['TONIC',SW.tonics,'#e04838'],['BERRY',SW.res.berry,'#e04838'],['WOOD',SW.res.wood,'#a8865c'],['STONE',SW.res.stone,'#c8ccd4'],['ORE',SW.res.ore||0,'#c89058'],['INGOT',SW.res.ingot,'#f8e060'],['FIBER',SW.res.fiber||0,'#7ee787']];
 items.forEach(([n,v,c],i)=>{const x=8+(i%4)*58,y=yb+8+((i/4)|0)*22;r(c,x,y+1,5,5);text(n,x+8,y,1,UI.dim,null);text(''+v,x+8,y+9,1,'#ffffff',null)});
 r('#0c1218',0,H-14,W,14);text('A  OPEN',8,H-11,1,'#7ee787',null);const bb='B  BACK TO PLAY';text(bb,W-8-tw(bb,1),H-11,1,'#a89ec2',null)}
function swPauseUpdate(){const n=WMENU.length;
 if(pressed('b')||pressed('start')){state='g4world';return}
 if(pressed('left')&&swSel%2===1)swSel--;else if(pressed('right')&&swSel%2===0&&swSel+1<n)swSel++;
 else if(pressed('up')){swSel=swSel>=2?swSel-2:swSel}else if(pressed('down')){swSel=swSel+2<n?swSel+2:swSel}
 if(pressed('a')){const r2=WMENU[swSel][0];
  if(r2==='BUDDIES'){swSel=0;state='g4party'}
  else if(r2==='BUDDY GUIDE'){swSel=0;state='g4dex'}
  else if(r2==='BUG JAR'){swSel=0;state='g4jar'}
  else if(r2==='BUILD'){if(W4.sector!=='BASE'){swSay('Building happens at Sunkeep.',1.8);state='g4world'}else{swSel=0;state='g4build'}}
  else if(r2==='MAP'){W4.mapRO=1;swSel=Math.max(0,WSECTORS.findIndex(s=>s.id===W4.sector));state='g4map'}
  else if(r2==='WORK BOARD'){swSel=0;state='g4base'}
  else if(r2==='GUIDE'){W4.guidePage=0;state='g4guide'}
  else if(r2==='SAVE & QUIT'){swSave();swSnd(784,.1,1175);W4.tm=0;W4.tsaved=3;state='g4title'}}}
