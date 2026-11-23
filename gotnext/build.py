#!/usr/bin/env python3
"""Builds GOT NEXT into one self-contained file: gotnext/index.html.
src/shell.html is the page; /*@include file*/ pulls in a script; /*@three*/ is the 3D library;
/*@font file*/ is a typeface from vendor/, embedded so the look is the same offline and on a phone."""
import re, pathlib, base64
root = pathlib.Path(__file__).parent
shell = (root / 'src/shell.html').read_text(encoding='utf8')
ver = re.search(r"VERSION = '([^']+)'", (root / 'src/data.js').read_text(encoding='utf8')).group(1)
out = re.sub(r'/\*@include ([\w.]+)\*/', lambda m: (root / 'src' / m.group(1)).read_text(encoding='utf8').rstrip('\n'), shell)
out = re.sub(r'/\*@font ([\w.]+)\*/', lambda m: base64.b64encode((root / 'vendor' / m.group(1)).read_bytes()).decode(), out)
out = out.replace('/*@three*/', (root / 'vendor/three.min.js').read_text(encoding='utf8'))
(root / 'index.html').write_text(out, encoding='utf8')
print('gotnext/index.html', len(out), 'bytes, v' + ver)
