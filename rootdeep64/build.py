#!/usr/bin/env python3
"""Builds the single-file game (index.html) from src/.
src/shell.html holds the page; /*@include file*/ lines pull in the scripts."""
import re, pathlib
root = pathlib.Path(__file__).parent
shell = (root / 'src/shell.html').read_text(encoding='utf8')
def inc(m):
    return (root / 'src' / m.group(1)).read_text(encoding='utf8').replace("'use strict';\n", '', 1).rstrip('\n')
out = re.sub(r'/\*@include ([\w.]+)\*/', inc, shell)
(root / 'index.html').write_text(out, encoding='utf8')
print('index.html', len(out), 'bytes')
