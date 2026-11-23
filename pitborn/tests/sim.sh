#!/bin/sh
# all-AI games in every mode, printed as box scores (pace and balance check)
cd "$(dirname "$0")/.."
for m in s2 s3 j2 j3; do MODE=$m node tests/dbg.mjs 2>&1 | python3 -c "
import json,sys
d=json.load(sys.stdin); print('$m', d['score'], 'secs', round(d['time']), 'clock violations', d['viol'], d['log'])
for b in d['box']:
    s=json.loads(b[3]); print('  ',b[0],b[1],b[2],'pts',s['pts'],'fg',s['fgm'],'/',s['fga'],'ast',s['ast'],'reb',s['reb'],'stl',s['stl'],'blk',s['blk'],'ank',s['ankles'],'dnk',s['dunks'],'thr',s['threes'],'fire',s['fires'])
"; done
