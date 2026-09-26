const fs=require('fs'),path=require('path');
const root=process.argv[2],pack=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const file=path.join(root,'cms_homepage_db.json'),data=JSON.parse(fs.readFileSync(file,'utf8'));
const ar={...data.showcaseContentByLanguage?.ar};
for(const [id,item] of Object.entries(data.showcaseContent||{})) {
  const translated=pack[item.title];
  if(!translated)throw Error('Missing manual translation: '+item.title);
  ar[id]={...ar[id],title:translated[0],description:translated[1],subtitle:'تصاميم ونماذج تركيب دور هوم'};
}
data.showcaseContentByLanguage={...data.showcaseContentByLanguage,ar};
const backup=fs.mkdtempSync('/var/backups/doorhome-showcase-ar-');fs.chmodSync(backup,0o700);
fs.copyFileSync(file,path.join(backup,'cms_homepage_db.json'));
fs.writeFileSync(file+'.manual.tmp',JSON.stringify(data,null,2));fs.renameSync(file+'.manual.tmp',file);
console.log(JSON.stringify({cards:Object.keys(ar).length,backup}));
