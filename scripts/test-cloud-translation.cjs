const assert=require('node:assert/strict'), fs=require('fs'), os=require('os'), path=require('path');
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'doorhome-translation-test-'));
process.env.TRANSLATION_CACHE_FILE=path.join(directory,'cache.json');
process.env.GOOGLE_TRANSLATION_API_KEY='unit-test-only';
const provider=require('../server/cloudTranslation.cjs');
let calls=0;
global.fetch=async(url,options)=>{
  assert.equal(url,'https://translation.googleapis.com/language/translate/v2');
  assert.equal(options.headers['X-Goog-Api-Key'],'unit-test-only');
  const body=JSON.parse(options.body);assert.equal(body.format,'text');assert.equal(body.model,'nmt');calls++;
  return {ok:true,json:async()=>({data:{translations:body.q.map(text=>({translatedText:`${body.target}:${text}`}))}})};
};
(async()=>{
 const result=await provider.translateAll(['Hello','Description'],'en',['en-GB','en-US','es','es-MX','kmr','ckb']);
 assert.equal(calls,3);assert.deepEqual(result.es,result['es-MX']);assert.deepEqual(result['en-GB'],['Hello','Description']);assert.equal(result.kmr[0],'ku:Hello');
 await provider.translateAll(['Hello','Description'],'en',['es','kmr','ckb']);assert.equal(calls,3);assert.ok(fs.existsSync(process.env.TRANSLATION_CACHE_FILE));
 global.fetch=async()=>({ok:false,status:403});await assert.rejects(provider.translateBatch(['New text'],'en','fr'),/HTTP 403/);
 delete process.env.GOOGLE_TRANSLATION_API_KEY;await assert.rejects(provider.translateBatch(['New text'],'en','ar'),/not configured/);
 console.log('PASS: official endpoint, dialect mapping, regional deduplication, durable cache, failure handling and missing credential checks.');
})().catch(error=>{console.error(error);process.exitCode=1;});
