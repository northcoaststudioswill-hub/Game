#!/usr/bin/env python3
"""Builds the single-file console (index.html) from src/.
src/shell.html holds the page; /*@include file*/ lines pull in the scripts."""
import re, pathlib
root = pathlib.Path(__file__).parent
shell = (root / 'src/shell.html').read_text(encoding='utf8')
out = re.sub(r'/\*@include ([\w.]+)\*/', lambda m: (root / 'src' / m.group(1)).read_text(encoding='utf8').rstrip('\n'), shell)
(root / 'index.html').write_text(out, encoding='utf8')
print('index.html', len(out), 'bytes')
