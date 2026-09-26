// One-time manual Arabic content update. Preserves source text and other locales.
const fs = require('fs');
const path = require('path');
const root = process.argv[2];
const pack = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
if (!root || !fs.existsSync(path.join(root, 'cms_products_db.json'))) throw Error('CMS root required');
const data = Object.fromEntries(['products', 'gallery', 'divisions'].map(section => [section, JSON.parse(fs.readFileSync(path.join(root, `cms_${section}_db.json`), 'utf8'))]));
for (const item of [...data.products, ...data.gallery]) if (!pack[item.name || item.title]) throw Error('Missing manual translation: ' + (item.name || item.title));
function translate(item) {
  const entry = pack[item.name || item.title];
  if (!entry) throw Error('Missing manual translation: ' + (item.name || item.title));
  item.translations = {...item.translations, ar: {name: entry[0], description: entry[1]}};
  if (item.name) { item.arabicName = entry[0]; item.arabicDescription = entry[1]; }
  if (item.title) item.arabicTitle = entry[0];
}
data.products.forEach(translate);
data.gallery.forEach(translate);
for (const division of data.divisions) {
  translate(division);
  division.arabicDivisionLabel = division.arabicTitle;
  division.featuredTitle = division.title;
  for (const sub of division.subCategories || []) {
    translate(sub);
    for (const model of sub.items || []) translate(model);
  }
}
const backup = fs.mkdtempSync('/var/backups/doorhome-manual-ar-');
fs.chmodSync(backup, 0o700);
for (const [section, records] of Object.entries(data)) {
  const file = path.join(root, `cms_${section}_db.json`);
  fs.copyFileSync(file, path.join(backup, path.basename(file)));
  fs.writeFileSync(file + '.manual.tmp', JSON.stringify(records, null, 2));
  fs.renameSync(file + '.manual.tmp', file);
}
console.log(JSON.stringify({products: data.products.length, projects: data.gallery.length, categories: data.divisions.length, backup}));
