// Run on VPS with the staged directory as argument. Refuse concurrent CMS changes.
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const root='/var/www/doorhome';
const stage=process.argv[2];
if(!stage||!/^\/var\/www\/doorhome\/import-reviewed-[a-zA-Z0-9]+$/.test(stage))throw Error('Invalid staging directory');
const expected={
  divisions:'4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
  products:'4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
  gallery:'0414ce34b5d7456c2d8db7af858062c48370c29ab7fe12a04b1ef82fc340c6e9',
  homepage:'399530f85fe2ca70e7213e5dde37213984e0b1ce482b1298f80096a9bd3565f1'
};
for(const [section,sha] of Object.entries(expected)){
  const name=`cms_${section}_db.json`;
  const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex');
  if(actual!==sha)throw Error(`CMS changed since review: ${section}. Reconcile first; nothing published.`);
  JSON.parse(fs.readFileSync(path.join(stage,name),'utf8'));
}
const backup=fs.mkdtempSync('/var/backups/doorhome-reviewed-assets-');fs.chmodSync(backup,0o700);
for(const section of Object.keys(expected))fs.copyFileSync(path.join(root,`cms_${section}_db.json`),path.join(backup,`cms_${section}_db.json`));
fs.copyFileSync(path.join(root,'dist/index.html'),path.join(backup,'index.html'));
fs.copyFileSync(path.join(stage,'index-reviewed-assets.js'),path.join(root,'dist/assets/index-reviewed-assets.js'));
// Each section is replaced atomically; all old content remains in the private backup.
for(const section of Object.keys(expected))fs.renameSync(path.join(stage,`cms_${section}_db.json`),path.join(root,`cms_${section}_db.json`));
fs.renameSync(path.join(stage,'index.html'),path.join(root,'dist/index.html'));
console.log('Published reviewed portfolio. Backup: '+backup);
