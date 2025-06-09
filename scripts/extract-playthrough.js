const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

const sections = [];
$('#playthrough_list').children('h3').each((i, h3) => {
  const $h3 = $(h3);
  const title = $h3.text().trim();
  const id = $h3.attr('id');
  const totalId = $h3.find('span').attr('id');
  const $ul = $h3.next('ul');
  const items = [];
  $ul.children('li').each((j, li) => {
    const $li = $(li);
    items.push({
      id: $li.attr('data-id'),
      class: $li.attr('class') || '',
      html: $li.html().trim()
    });
  });
  sections.push({id, title, totalId, listId: $ul.attr('id'), items});
});

fs.mkdirSync('data', {recursive: true});
fs.writeFileSync('data/playthrough.json', JSON.stringify({sections}, null, 2));
console.log('Extracted', sections.length, 'sections');
