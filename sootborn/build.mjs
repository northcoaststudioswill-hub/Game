// Bundles modular source into one self-contained HTML (Claude artifact / static web build).
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
process.chdir(new URL('.', import.meta.url).pathname);
const order = ['core', 'art', 'content', 'story', 'systems', 'cinema', 'panels', 'brawl', 'g3', 'ff', 'day2', 'day3', 'part2', 'rowk', 'assay', 'issue', 'prelude', 'checkpoints', 'ui', 'main'];
let js = order.map(n => `// ---- src/${n}.js\n` + readFileSync(`src/${n}.js`, 'utf8')).join('\n');
// the third-person level: built from issue/base.html by issue/patch.mjs, carried as a string and run in its own frame
if (existsSync('issue/patch.mjs')) {
  execFileSync('node', ['issue/patch.mjs'], { stdio: 'inherit' });
  const lit = JSON.stringify(readFileSync('issue/issue.html', 'utf8')).replace(/</g, '\\u003c').split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029');
  js += `\n// ---- issue/issue.html (generated)\nwindow.ISSUE_HTML = { docks: ${lit} };\n`;
}
const html = readFileSync('src/shell.html', 'utf8').replace('/*__SCRIPT__*/', () => js);
writeFileSync('index.html', html);
console.log('index.html', (html.length / 1024).toFixed(1) + ' KB');
// the Dev Suite carries its own copy of the build (devsuite/game.html); refresh it so the suite always plays this build
if (existsSync('devsuite/build.mjs')) execFileSync('node', ['devsuite/build.mjs'], { stdio: 'inherit' });
