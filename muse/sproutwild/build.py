import pathlib
src = pathlib.Path.home()/"workspace/your_files/rootdeep/Sprouts+Rootdeep.html"
html = src.read_text()
def rep(old, new, count=1):
    global html
    n = html.count(old); assert n == count, f"{n} for {old[:60]!r}"
    html = html.replace(old, new)
rep("<title>Sprouts + Rootdeep — Pocket Lantern</title>", "<title>Sprouts + Rootdeep + Sproutwild — Pocket Lantern</title>")
rep('<button class="cart lock" data-i="2"><span class="art">?</span>Coming soon</button>',
    '<button class="cart" data-i="2"><canvas class="art" id="cartArt3" width="40" height="26"></canvas>Sproutwild</button>')
rep("if(i===2){$('shelfMsg').textContent='That one is not out yet';",
    "if(i===9){$('shelfMsg').textContent='That one is not out yet';")
rep("if(activeCart===1)g3StartTitle();else{state='intro';introT=0}",
    "if(activeCart===1)g3StartTitle();else if(activeCart===2)g4StartTitle();else{state='intro';introT=0}")
rep(" if(activeCart===1&&state.slice(0,2)==='g3'){g3Update(dt);return;}",
    " if(activeCart===1&&state.slice(0,2)==='g3'){g3Update(dt);return;}\n if(activeCart===2&&state.slice(0,2)==='g4'){g4Update(dt);return;}")
rep(" if(activeCart===1&&state.slice(0,2)==='g3'){g3Draw();return;}",
    " if(activeCart===1&&state.slice(0,2)==='g3'){g3Draw();return;}\n if(activeCart===2&&state.slice(0,2)==='g4'){g4Draw();return;}")

# --- touch reliability: a tap shorter than one frame must still register ---
rep("el.addEventListener('pointerdown',e=>{e.preventDefault();unlock();keys[key]=1;el.classList.add('on');",
    "el.addEventListener('pointerdown',e=>{e.preventDefault();unlock();keys[key]=1;el._ku=Date.now()+95;el.classList.add('on');")
rep("['pointerup','pointercancel','lostpointercapture'].forEach(n=>el.addEventListener(n,()=>{keys[key]=0;el.classList.remove('on')}));}",
    "['pointerup','pointercancel','lostpointercapture'].forEach(n=>el.addEventListener(n,()=>{const w8=(el._ku||0)-Date.now();const clr=()=>{keys[key]=0;el.classList.remove('on')};if(w8>0)setTimeout(clr,w8);else clr()}));}")
rep("let dpDown=false;", "let dpDown=false,dpT=0;")
rep("dp.addEventListener('pointerdown',e=>{e.preventDefault();unlock();dpDown=true;",
    "dp.addEventListener('pointerdown',e=>{e.preventDefault();unlock();dpDown=true;dpT=Date.now();")
rep("['pointerup','pointercancel','lostpointercapture'].forEach(n=>dp.addEventListener(n,()=>{dpDown=false;dpClr()}));",
    "['pointerup','pointercancel','lostpointercapture'].forEach(n=>dp.addEventListener(n,()=>{dpDown=false;const w8=dpT+80-Date.now();if(w8>0)setTimeout(dpClr,w8);else dpClr()}));")

w = pathlib.Path.home()/"workspace/sproutwild"
cartart = (w/"sw-cartart.js").read_text().rstrip()
rep("/* ---------- update ---------- */", cartart + "\n\n/* ---------- update ---------- */")
module = (w/"sw-module.js").read_text().rstrip()
rep("/* ---------- loop ---------- */", module + "\n\n/* ---------- loop ---------- */")
rep("live,SAVE}},RD:()=>RD,RDF:()=>RDF};", "live,SAVE}},RD:()=>RD,RDF:()=>RDF,SW:()=>SW,SWF:()=>SWF};")
out = w/"out/Sprouts+Rootdeep+Sproutwild.html"
out.write_text(html)
print("trilogy rebuilt:", out.stat().st_size)
