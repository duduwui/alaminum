const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');
const LANGUAGES = ['ar', 'ckb', 'kmr', 'en'];
const normalize = code => code === 'kmr' ? 'ku' : code.startsWith('en') ? 'en' : code.startsWith('es') ? 'es' : code.startsWith('pt') ? 'pt' : code;
const configured = () => true;
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

async function translateSingleGtx(text, src, tgt) {
  const sl = src || 'auto';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tgt)}&dt=t&q=${encodeURIComponent(text)}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const joined = data[0].map(part => (Array.isArray(part) ? part[0] : '')).join('');
          if (joined && joined.trim()) return joined.trim();
        }
      }
    } catch {
      // retry
    }
    await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
  }
  return text;
}

async function translateBatch(texts, source, target) {
  const src = source && source !== 'auto' ? normalize(source) : undefined, tgt = normalize(target);
  if (src === tgt) return texts;
  const stored = getCache(), result = [], missing = [], positions = [];
  texts.forEach((text,index) => {
    if (!text) result[index] = '';
    else if (stored[hash(text,src,tgt)]) result[index] = stored[hash(text,src,tgt)];
    else { missing.push(text); positions.push(index); }
  });
  if (!missing.length) return result;

  if (process.env.GOOGLE_TRANSLATION_API_KEY) {
    for (let attempt=0;attempt<3;attempt++) {
      let response;
      try {
        response = await fetch('https://translation.googleapis.com/language/translate/v2', {
          method:'POST', headers:{'Content-Type':'application/json','X-Goog-Api-Key':process.env.GOOGLE_TRANSLATION_API_KEY},
          body:JSON.stringify({q:missing,target:tgt,...(src ? {source:src}:{}),format:'text',model:'nmt'}), signal:AbortSignal.timeout(20000)
        });
      } catch {
        if (attempt===2) break;
        await new Promise(resolve=>setTimeout(resolve,500*(attempt+1))); continue;
      }
      if (!response.ok) {
        if ((response.status===429 || response.status>=500) && attempt<2) { await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1))); continue; }
        break;
      }
      const data = await response.json(), translations = data.data?.translations;
      if (Array.isArray(translations) && translations.length===missing.length && !translations.some(item=>typeof item.translatedText!=='string' || !item.translatedText.trim())) {
        positions.forEach((position,index)=>{result[position]=translations[index].translatedText;stored[hash(missing[index],src,tgt)]=result[position];});
        await persist();
        return result;
      }
    }
  }

  // Fallback to Google GTX translation endpoint with concurrency control
  for (let i = 0; i < missing.length; i++) {
    const translatedText = await translateSingleGtx(missing[i], src, tgt);
    const pos = positions[i];
    result[pos] = translatedText;
    stored[hash(missing[i], src, tgt)] = translatedText;
  }
  await persist();
  return result;
}
async function translateAll(texts, source='auto', languages=LANGUAGES) {
  const groups=[...new Set(languages.map(normalize))], translated={}, queue=[...groups];
  await Promise.all(Array.from({length:Math.min(4,queue.length)},async()=>{while(queue.length){const language=queue.shift();translated[language]=await translateBatch(texts,source,language);}}));
  return Object.fromEntries(languages.map(language=>[language,translated[normalize(language)]]));
}
module.exports = {LANGUAGES,normalize,configured,translateBatch,translateAll};
