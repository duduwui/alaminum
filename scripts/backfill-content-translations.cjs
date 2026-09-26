// Add missing public-content translations using the app's existing translation service.
// Merge against the latest record before saving, preserving concurrent admin changes.
const fs = require('fs');
const root = '/var/www/doorhome';
require(`${root}/node_modules/dotenv`).config({ path: `${root}/.env`, quiet: true });
const provider = require(`${root}/server/cloudTranslation.cjs`);
if (!provider.configured()) throw new Error('Configure GOOGLE_TRANSLATION_API_KEY on the server before running the backfill.');
const sections = ['products', 'divisions', 'gallery'];
const backup = fs.mkdtempSync('/var/backups/doorhome-translations-');
fs.chmodSync(backup, 0o700);
for (const section of sections) fs.copyFileSync(`${root}/cms_${section}_db.json`, `${backup}/${section}.json`);
const jobs = sections.flatMap(section => JSON.parse(fs.readFileSync(`${root}/cms_${section}_db.json`)).map(record => ({section, record})));
let count = 0;
async function run() {
  while(jobs.length) {
    const {section,record} = jobs.shift();
    const name=record.name||record.title, description=record.description||'';
    try {
      const values=await provider.translateAll([name,description], 'en');
      const result={translations:Object.fromEntries(Object.entries(values).map(([language,text])=>[language,{name:text[0],description:text[1]}]))};
      const file=`${root}/cms_${section}_db.json`, current=JSON.parse(fs.readFileSync(file));
      const target=current.find(item=>item.id===record.id);
      if(target && (target.name||target.title)===name && (target.description||'')===description) {
        const valid=Object.fromEntries(Object.entries(result.translations).filter(([lang,text]) => lang.startsWith('en') || text.name !== name || (description && text.description !== description)));
        target.translations={...valid,...target.translations};
        target.translationProvider='google-cloud-nmt';
        fs.writeFileSync(file+'.translation.tmp',JSON.stringify(current,null,2));fs.renameSync(file+'.translation.tmp',file);
      }
      console.log(`Translated ${++count}: ${section} ${record.id}`);
    } catch(error) {console.error(`FAILED ${section} ${record.id}: ${error.message}`);}
  }
}
Promise.all([run(),run()]).then(()=>console.log(`Finished ${count} records. Backup: ${backup}`));
