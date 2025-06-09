const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const swPath = path.join(__dirname, '..', 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');

const version = pkg.version || '0.0.0';
const timestamp = Date.now();
const newName = `ds3-checklist-v${version}-${timestamp}`;

const replaced = sw.replace(/const CACHE_NAME = '[^']+';/, `const CACHE_NAME = '${newName}';`);
fs.writeFileSync(swPath, replaced);
console.log('Updated CACHE_NAME to', newName);
