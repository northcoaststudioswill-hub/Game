// Copies the current game build (sootborn/index.html) beside the Dev Suite page as game.html,
// the supporting file the suite loads with fetch('game.html'). Run by sootborn/build.mjs after every game build.
import { readFileSync, writeFileSync, existsSync } from 'fs';
const here = new URL('.', import.meta.url).pathname, src = here + '../index.html', out = here + 'game.html';
if (!existsSync(src)) { console.error('devsuite: no game build at ' + src + ' (run node build.mjs in sootborn/ first)'); process.exit(1); }
const html = readFileSync(src, 'utf8');
writeFileSync(out, html);
const ver = (html.match(/const GAME_VER = '([^']+)'/) || [])[1] || '?';
console.log('devsuite/game.html', (html.length / 1024).toFixed(1) + ' KB', 'v' + ver);
