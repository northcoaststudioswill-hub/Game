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
