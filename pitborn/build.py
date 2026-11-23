#!/usr/bin/env python3
"""Builds PITBORN 2145 into one self-contained file: pitborn/index.html.
src/shell.html is the page; /*@include file*/ pulls in a script; /*@three*/ is the 3D library."""
import re, pathlib
root = pathlib.Path(__file__).parent
shell = (root / 'src/shell.html').read_text(encoding='utf8')
ver = re.search(r"VERSION = '([^']+)'", (root / 'src/data.js').read_text(encoding='utf8')).group(1)
out = re.sub(r'/\*@include ([\w.]+)\*/', lambda m: (root / 'src' / m.group(1)).read_text(encoding='utf8').rstrip('\n'), shell)
out = out.replace('/*@version*/', ver).replace('/*@three*/', (root / 'vendor/three.min.js').read_text(encoding='utf8'))
(root / 'index.html').write_text(out, encoding='utf8')
print('pitborn/index.html', len(out), 'bytes, v' + ver)
