const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');
const LANGUAGES = ['ckb','kmr','ar','tr','fa','en-GB','de','fr','it','el','es','ro','bg','sr','bs','hr','sq','nl','sv','pl','pt','en-US','es-MX','pt-BR','zh-CN','ru','hi','ja','ko','kk','en'];
const normalize = code => code === 'kmr' ? 'ku' : code.startsWith('en') ? 'en' : code.startsWith('es') ? 'es' : code.startsWith('pt') ? 'pt' : code;
const configured = () => Boolean(process.env.GOOGLE_TRANSLATION_API_KEY);
const cacheFile = () => path.resolve(process.env.TRANSLATION_CACHE_FILE || 'translation_cache_db.json');
let cache, save = Promise.resolve();
function getCache() { if (!cache) { try { cache = JSON.parse(fs.readFileSync(cacheFile(), 'utf8')); } catch { cache = {}; } } return cache; }
function persist() {
  save = save.catch(() => {}).then(async () => {
    const file = cacheFile();
    await fs.promises.writeFile(file + '.tmp', JSON.stringify(getCache()), { mode: 0o600 });
    await fs.promises.rename(file + '.tmp', file);
  });
  return save;
}
const hash = (text, source, target) => createHash('sha256').update(JSON.stringify([source,target,text])).digest('hex');
async function translateBatch(texts, source, target) {
  const src = source && source !== 'auto' ? normalize(source) : undefined, tgt = normalize(target);
  if (src === tgt) return texts;
  if (!configured()) throw new Error('Google Cloud Translation is not configured. Add server-side GOOGLE_TRANSLATION_API_KEY.');
  const stored = getCache(), result = [], missing = [], positions = [];
  texts.forEach((text,index) => {
    if (!text) result[index] = '';
    else if (stored[hash(text,src,tgt)]) result[index] = stored[hash(text,src,tgt)];
    else { missing.push(text); positions.push(index); }
  });
  if (!missing.length) return result;
  for (let attempt=0;attempt<3;attempt++) {
    let response;
    try {
      response = await fetch('https://translation.googleapis.com/language/translate/v2', {
        method:'POST', headers:{'Content-Type':'application/json','X-Goog-Api-Key':process.env.GOOGLE_TRANSLATION_API_KEY},
        body:JSON.stringify({q:missing,target:tgt,...(src ? {source:src}:{}),format:'text',model:'nmt'}), signal:AbortSignal.timeout(20000)
      });
    } catch {
      if (attempt===2) throw new Error('Google Cloud Translation connection failed. Please retry.');
      await new Promise(resolve=>setTimeout(resolve,500*(attempt+1))); continue;
    }
    if (!response.ok) {
      if ((response.status===429 || response.status>=500) && attempt<2) { await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1))); continue; }
      throw new Error(`Google Cloud Translation returned HTTP ${response.status}. Check billing, API restrictions and quota.`);
    }
    const data = await response.json(), translations = data.data?.translations;
    if (!Array.isArray(translations) || translations.length!==missing.length || translations.some(item=>typeof item.translatedText!=='string' || !item.translatedText.trim())) throw new Error('Google returned incomplete translations. Content was not marked complete.');
    positions.forEach((position,index)=>{result[position]=translations[index].translatedText;stored[hash(missing[index],src,tgt)]=result[position];});
    await persist(); return result;
  }
}
async function translateAll(texts, source='auto', languages=LANGUAGES) {
  const groups=[...new Set(languages.map(normalize))], translated={}, queue=[...groups];
  await Promise.all(Array.from({length:Math.min(3,queue.length)},async()=>{while(queue.length){const language=queue.shift();translated[language]=await translateBatch(texts,source,language);}}));
  return Object.fromEntries(languages.map(language=>[language,translated[normalize(language)]]));
}
module.exports = {LANGUAGES,normalize,configured,translateBatch,translateAll};
