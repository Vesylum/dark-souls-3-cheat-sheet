const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const swPath = path.join(__dirname, '..', 'sw.js');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version || '0.0.0';
const stamp = Date.now();
const newName = `ds3-checklist-v${version}-${stamp}`;

let sw = fs.readFileSync(swPath, 'utf8');
const regex = /const CACHE_NAME = '.*?';/;
if (!regex.test(sw)) {
  throw new Error('CACHE_NAME constant not found in sw.js');
}
sw = sw.replace(regex, `const CACHE_NAME = '${newName}';`);
fs.writeFileSync(swPath, sw);
console.log('Updated CACHE_NAME to', newName);
