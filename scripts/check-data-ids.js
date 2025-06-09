const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

const regex = /data-id\s*=\s*"([^"]+)"/g;
const ids = [];
let match;

while ((match = regex.exec(html)) !== null) {
  ids.push(match[1]);
}

const seen = new Set();
const duplicates = new Set();

for (const id of ids) {
  if (seen.has(id)) {
    duplicates.add(id);
  } else {
    seen.add(id);
  }
}

if (duplicates.size > 0) {
  const dupList = Array.from(duplicates).join(', ');
  throw new Error(`Duplicate data-id values found: ${dupList}`);
}

console.log(`Checked ${ids.length} data-id attributes, no duplicates found.`);
