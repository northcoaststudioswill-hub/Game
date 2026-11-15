"""Builds the Sproutwild trilogy file from files in this repo (Fable's build; build.py is lil Bottie's original and uses his paths).
   Reads   ../games/Sprouts+Rootdeep.html (read-only), sw-cartart.js, sw-module.js
   Writes  ../games/Sprouts+Rootdeep+Sproutwild-v5.html   (the v4.7 file is never touched)
   Run from anywhere:  python3 muse/sproutwild/build_fable.py"""
import pathlib, re
here = pathlib.Path(__file__).resolve().parent
src = (here.parent / 'games/Sprouts+Rootdeep.html')
code = (here / 'build.py').read_text()
# reuse the original script's asserted replacements, with the paths pointed at this repo
code = code.replace('pathlib.Path.home()/"workspace/your_files/rootdeep/Sprouts+Rootdeep.html"', 'SRC')
code = code.replace('w = pathlib.Path.home()/"workspace/sproutwild"', 'w = HERE')
code = code.replace('out = w/"out/Sprouts+Rootdeep+Sproutwild.html"', 'out = OUT')
assert 'workspace' not in code, 'build.py changed: a path was not redirected'
OUT = here.parent / 'games/Sprouts+Rootdeep+Sproutwild-v5.html'
# the field engine lives in its own file and is spliced in ahead of the dispatch block
MARK = '/* ================================================================\n   DISPATCH + TEST HOOKS'
mod = (here / 'sw-module.js').read_text()
assert mod.count(MARK) == 1
mod = mod.replace(MARK, (here / 'sw-field.js').read_text().rstrip() + '\n' + (here / 'sw-front.js').read_text().rstrip() + '\n' + MARK)
code = code.replace('module = (w/"sw-module.js").read_text().rstrip()', 'module = MODULE.rstrip()')
assert 'MODULE' in code
exec(compile(code, 'build.py', 'exec'), {'SRC': src, 'HERE': here, 'OUT': OUT, 'MODULE': mod})
