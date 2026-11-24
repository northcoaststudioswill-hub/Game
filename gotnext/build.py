#!/usr/bin/env python3
"""Builds GOT NEXT into one self-contained file, gotnext/index.html, and the model lab, gotnext/lab.html.
src/shell.html is the page; /*@include file*/ pulls in a script; /*@three*/ is the 3D library;
/*@font file*/ is a typeface from vendor/, embedded so the look is the same offline and on a phone."""
import re, pathlib, base64
root = pathlib.Path(__file__).parent
ver = re.search(r"VERSION = '([^']+)'", (root / 'src/data.js').read_text(encoding='utf8')).group(1)
def make(src, dst):
    out = (root / 'src' / src).read_text(encoding='utf8')
    out = re.sub(r'/\*@include ([\w.]+)\*/', lambda m: (root / 'src' / m.group(1)).read_text(encoding='utf8').rstrip('\n'), out)
    out = re.sub(r'/\*@font ([\w.]+)\*/', lambda m: base64.b64encode((root / 'vendor' / m.group(1)).read_bytes()).decode(), out)
    out = out.replace('/*@three*/', (root / 'vendor/three.min.js').read_text(encoding='utf8'))
    (root / dst).write_text(out, encoding='utf8')
    print('gotnext/' + dst, len(out), 'bytes, v' + ver)
make('shell.html', 'index.html')     # the game
make('lab.html', 'lab.html')         # the model lab
