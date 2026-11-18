#!/usr/bin/env python3
"""Builds the music-video render page: bottie/video/mv.html

A bare square canvas plus the lil Bottie cartridge (the same source files the game uses) and a tiny stand-in for
the console (drawing helpers, a keys object the video director presses, a seedable Math.random so every frame is
repeatable). No console, no other games, no sound: the song is added when the frames are encoded.

Run from the repo root:  python3 bottie/video/build.py
Then:                    node bottie/video/render.js overclocked
"""
import pathlib, re, sys
here = pathlib.Path(__file__).resolve().parent
SRC = here.parent / 'src' / 'bottie'
sys.path.insert(0, str(here.parent))
order = re.search(r"BOTTIE = \[(.*?)\]", (here.parent / 'build.py').read_text()).group(1)
files = re.findall(r"'([\w-]+)'", order)
cart = '\n'.join((SRC / (f + '.js')).read_text(encoding='utf8').rstrip() for f in files)
boards = '\n'.join(p.read_text(encoding='utf8') for p in sorted(here.glob('board-*.js')))
html = """<!doctype html><html><head><meta charset="utf-8"><title>lil Bottie MV</title>
<style>html,body{margin:0;background:#000}canvas{display:block;width:480px;height:480px;image-rendering:pixelated}</style></head><body>
<canvas id="screen" width="480" height="480"></canvas>
<script>
/* stand-in for the console */
(()=>{let s=1;window.__seed=n=>{s=n>>>0};Math.random=()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}})();
const cv=document.getElementById('screen'),g=cv.getContext('2d');g.imageSmoothingEnabled=false;
const FS={1:10,2:11,3:15,4:19,5:25};
function setF(sc){g.font='700 '+FS[sc]+'px ui-monospace,"SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace';g.textBaseline='top'}
function text(s,x,y,sc=2,c='#fff',sh='#181020'){s=String(s);setF(sc);if(sh){g.lineJoin='round';g.lineWidth=2;g.strokeStyle=sh;g.strokeText(s,x,y);g.fillStyle=sh;g.fillText(s,x+1,y+1)}g.fillStyle=c;g.fillText(s,x,y)}
function tw(s,sc=2){setF(sc);return Math.ceil(g.measureText(String(s)).width)}
const r=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
const keys={up:0,down:0,left:0,right:0,a:0,b:0,x:0,y:0,sel:0,start:0},prev={};
</script>
<script>
/*CART*/
</script>
<script>
const BT=window.BT_CART({g,W:240,H:()=>240,r,text,tw,keys,prev,pressed:k=>keys[k]&&!prev[k],ac:()=>null,meta:()=>({sfx:0,mus:0}),eject(){},seed:window.__seed});
const MV=BT._.MV,B=BT._;
/*BOARDS*/
window.mvFrame=t=>{g.setTransform(2,0,0,2,0,0);g.imageSmoothingEnabled=false;MV.frame(t)};
</script></body></html>
"""
html = html.replace('/*CART*/', cart).replace('/*BOARDS*/', boards)
(here / 'mv.html').write_text(html, encoding='utf8')
print('bottie/video/mv.html', len(html), 'bytes;', len(files), 'cartridge files')
