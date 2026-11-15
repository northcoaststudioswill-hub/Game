/* ================================================================
   TEXT (Fable, v5.9) — Sproutwild draws its own letters.
   The game used the device's monospace font. On an iPhone that font
   sits a few pixels lower and wider than on the machine the layouts
   were made on, so text spilled out of rows, tabs, signs and bars.
   Sproutwild now carries a 5x8 pixel font (5x7 with a row for descenders), so every device draws
   the same pixels in the same place. Sprouts and Rootdeep keep the
   system font: text(), tw() and ctext() only switch to the pixel
   font while a Sproutwild screen (state g4...) is showing.
   Sizes: 1 = 1x · 2 = 1x bold · 3 = 2x · 4 = 2x bold · 5 = 3x.
   ================================================================ */
const SWFONT=('0000000000 00005F0000 0007000700 147F147F14 242A7F2A12 2313086462 3649552250 0005030000 001C224100 0041221C00 082A1C2A08 08083E0808 00A0600000 0808080808 0060600000 2010080402 '+
 '3E5149453E 00427F4000 4261514946 2141454B31 1814127F10 2745454539 3C4A494930 0171090503 3649494936 064949291E 0036360000 0056360000 0008142241 1414141414 4122140800 0201510906 '+
 '324979413E 7E1111117E 7F49494936 3E41414122 7F4141221C 7F49494941 7F09090101 3E41415132 7F0808087F 00417F4100 2040413F01 7F08142241 7F40404040 7F0204027F 7F0408107F 3E4141413E '+
 '7F09090906 3E4151215E 7F09192946 4649494931 01017F0101 3F4040403F 1F2040201F 7F2018207F 6314081463 0304780403 6151494543 00007F4141 0204081020 41417F0000 0402010204 4040404040 '+
 '0001020400 2054545478 7F48444438 3844444420 384444487F 3854545418 087E090102 18A4A4A47C 7F08040478 00447D4000 4080847D00 007F102844 00417F4000 7C04180478 7C08040478 3844444438 '+
 'FC24242418 18242424FC 7C08040408 4854545420 043F444020 3C4040207C 1C2040201C 3C4030403C 4428102844 1CA0A0A07C 4464544C44 0008364100 00007F0000 0041360800 0201020402').split(' ');
const SWFEXT={'·':'0000180000','—':'0808080808','–':'0008080800','…':'4000400040','’':'0005030000','‘':'0003050000','“':'0007000700','”':'0007000700','♥':'0C1E3C1E0C','♣':'185A7F5A18','◆':'081C3E1C08','✿':'142A552A14',
 '▼':'040C1C0C04','▲':'1018381810','◀':'081C3E0000','▶':'00003E1C08','✓':'1020100804','✗':'2214081422','»':'2214221408','●':'1C3E3E3E1C','○':'1C2222221C','★':'0A1C3E1C0A','▣':'3E223E223E','♪':'30307F0206','é':'3854565518'};
const SWFCH={};{let i=0;for(let c=32;c<127;c++)SWFCH[String.fromCharCode(c)]=i++;for(const k in SWFEXT){SWFONT.push(SWFEXT[k]);SWFCH[k]=i++}}
const SWFSC={1:[1,0],2:[1,1],3:[2,0],4:[2,1],5:[3,0]};
let swAtl={},swAtlN=0;
function swAtlas(c){let a=swAtl[c];if(a)return a;if(swAtlN>160){swAtl={};swAtlN=0}
 const cv=document.createElement('canvas');cv.width=SWFONT.length*6;cv.height=9;const b=cv.getContext&&cv.getContext('2d');
 if(b&&b.fillRect){b.fillStyle=c;SWFONT.forEach((hx,i)=>{for(let col=0;col<5;col++){const v=parseInt(hx.substr(col*2,2),16);for(let row=0;row<8;row++)if(v>>row&1)b.fillRect(i*6+col,row,1,1)}})}
 swAtl[c]=cv;swAtlN++;return cv}
function swGlyphs(s,x,y,sz,bold,c){const a=swAtlas(c),adv=(bold?7:6)*sz;x=Math.round(x);y=Math.round(y)+1;
 for(let i=0;i<s.length;i++){const ch=s[i];if(ch===' ')continue;let ix=SWFCH[ch];if(ix===undefined)ix=SWFCH['?'];
  g.drawImage(a,ix*6,0,5,8,x+i*adv,y,5*sz,8*sz);if(bold)g.drawImage(a,ix*6,0,5,8,x+i*adv+sz,y,5*sz,8*sz)}}
const swPix=()=>typeof state==='string'&&state[0]==='g'&&state[1]==='4';
function tw(s,sc=2){if(swPix()){const f=SWFSC[sc]||SWFSC[1],n=String(s).length;return n?n*(f[1]?7:6)*f[0]-f[0]:0}
 setF(sc);const m=g.measureText(String(s));return Math.ceil((m&&m.width)||String(s).length*FS[sc]*.6);}
function text(s,x,y,sc=2,c='#fff',sh='#181020'){s=String(s);
 if(swPix()){const f=SWFSC[sc]||SWFSC[1];if(sh)for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[1,1]])swGlyphs(s,x+dx*f[0],y+dy*f[0],f[0],f[1],sh);swGlyphs(s,x,y,f[0],f[1],c);return}
 setF(sc);if(sh){g.lineJoin='round';g.lineWidth=2;g.strokeStyle=sh;g.strokeText(s,x,y);g.fillStyle=sh;g.fillText(s,x+1,y+1)}g.fillStyle=c;g.fillText(s,x,y);}
function ctext(s,y,sc=2,c,sh){const w=tw(s,sc);if(w>W-6){g.save();g.translate(3,0);g.scale((W-6)/w,1);text(s,0,y,sc,c,sh);g.restore()}else text(s,Math.round((W-w)/2),y,sc,c,sh);}
