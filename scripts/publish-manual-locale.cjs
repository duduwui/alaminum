// Additive manual content import. No translation service is called.
const fs=require('fs'),path=require('path');
const [root,locale,packFile]=process.argv.slice(2);
if(!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(locale||''))throw Error('Invalid locale');
const pack=JSON.parse(fs.readFileSync(packFile,'utf8'));
const names=['products','gallery','divisions','homepage'];
const data=Object.fromEntries(names.map(n=>[n,JSON.parse(fs.readFileSync(path.join(root,`cms_${n}_db.json`),'utf8'))]));
const translate=record=>{
  const source=record.name||record.title,entry=pack[source];
  if(!entry?.[0]||(record.description&&!entry[1]))throw Error('Missing translation: '+source);
  record.translations={...record.translations,[locale]:{name:entry[0],description:entry[1]||''}};
  if(locale==='ckb') {
    if(record.name){record.kurdishName=entry[0];record.kurdishDescription=entry[1]||'';}
    if(record.title)record.kurdishTitle=entry[0];
  }
};
data.products.forEach(translate);data.gallery.forEach(translate);
for(const division of data.divisions){translate(division);if(locale==='ckb')division.kurdishDivisionLabel=division.kurdishTitle;for(const sub of division.subCategories||[]){translate(sub);for(const model of sub.items||[])translate(model);}}
const homepage=data.homepage;
const showcaseSubtitles={ckb:'دیزاین و نموونەی دامەزراندنی دور هۆم',kmr:'Dîzayn û nimûneyên sazkirina Doorhome',tr:'Doorhome tasarımları ve uygulama örnekleri',fa:'طرح‌ها و نمونه‌های اجرای دور هوم'};
const cards={...homepage.showcaseContentByLanguage?.[locale]};
for(const [id,card]of Object.entries(homepage.showcaseContent||{})){
  const entry=pack[card.title];if(!entry?.[0]||!entry[1])throw Error('Missing showcase translation: '+card.title);
  cards[id]={...cards[id],title:entry[0],description:entry[1],subtitle:showcaseSubtitles[locale]||cards[id]?.subtitle||''};
}
homepage.showcaseContentByLanguage={...homepage.showcaseContentByLanguage,[locale]:cards};
if(pack['Doors, Gates & Architectural Details']) {
  const [title,subtitle]=pack['Doors, Gates & Architectural Details'];
  homepage.showcaseSectionText={...homepage.showcaseSectionText,[locale]:{title,subtitle}};
}
const backup=fs.mkdtempSync('/var/backups/doorhome-manual-'+locale+'-');fs.chmodSync(backup,0o700);
for(const name of names){const file=path.join(root,`cms_${name}_db.json`);fs.copyFileSync(file,path.join(backup,path.basename(file)));}
for(const name of names){const file=path.join(root,`cms_${name}_db.json`);fs.writeFileSync(file+'.manual.tmp',JSON.stringify(data[name],null,2));fs.renameSync(file+'.manual.tmp',file);}
console.log(JSON.stringify({locale,products:data.products.length,projects:data.gallery.length,categories:data.divisions.length,showcase:Object.keys(cards).length,backup}));
