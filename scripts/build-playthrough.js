const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'index.template.html');
const dataPath = path.join(__dirname, '..', 'data', 'playthrough.json');
const outPath = path.join(__dirname, '..', 'index.html');

const template = fs.readFileSync(templatePath, 'utf8');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function buildSection(section) {
  let html = `  <h3 id="${section.id}"><a href="#${section.listId}" data-toggle="collapse" class="btn btn-primary btn-collapse btn-sm"></a><a href="https://darksouls3.wiki.fextralife.com/${section.title.replace(/\s+/g,'+')}">${section.title}</a> <span id="${section.totalId}"></span></h3>\n`;
  html += `  <ul id="${section.listId}" class="collapse in">\n`;
  section.items.forEach(item => {
    html += `    <li data-id="${item.id}"${item.class ? ` class="${item.class}"` : ''}>${item.html}</li>\n`;
  });
  html += '  </ul>\n\n';
  return html;
}

let built = '';
data.sections.forEach(sec => {
  built += buildSection(sec);
});

const result = template.replace('<!-- PLAYTHROUGH_PLACEHOLDER -->', built.trim());
fs.writeFileSync(outPath, result);
console.log('Generated index.html from data');
