#!/bin/bash
# usage: runlv.sh riser|stair  -> prints each step's result
cd "$(dirname "$0")" && node lv.cjs $1 && F=lv-$1.html STEPS="$(cat lv.json)" timeout 280 node iss.mjs 2>&1 | cut -c1-420
