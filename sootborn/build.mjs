// Bundles modular source into one self-contained HTML (Claude artifact / static web build).
import { readFileSync, writeFileSync } from 'fs';
process.chdir(new URL('.', import.meta.url).pathname);
const order = ['core', 'art', 'content', 'story', 'systems', 'cinema', 'panels', 'brawl', 'g3', 'ff', 'day2', 'day3', 'part2', 'assay', 'checkpoints', 'ui', 'main'];
const js = order.map(n => `// ---- src/${n}.js\n` + readFileSync(`src/${n}.js`, 'utf8')).join('\n');
const html = readFileSync('src/shell.html', 'utf8').replace('/*__SCRIPT__*/', () => js);
writeFileSync('index.html', html);
console.log('index.html', (html.length / 1024).toFixed(1) + ' KB');
