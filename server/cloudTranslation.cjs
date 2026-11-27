const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');
const LANGUAGES = ['ar', 'ckb', 'kmr', 'en', 'tr'];
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
  if (!text || !text.trim()) return '';
  const sl = src && src !== 'auto' ? src : 'auto';

  // 1. Primary: Google Client Dictionary Endpoint (fast, official Google NMT, handles ckb/ku/en/ar/tr)
  try {
    const googleTarget = tgt === 'kmr' ? 'ku' : tgt;
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(googleTarget)}&q=${encodeURIComponent(text.trim())}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0]) && typeof data[0][0] === 'string' && data[0][0].trim()) {
        return data[0][0].trim();
      }
    }
  } catch (err) {}

  // 2. Secondary: MyMemory Translation API
  try {
    const memorySource = sl === 'auto' ? (/[\u0600-\u06FF]/.test(text) ? 'ar' : 'en') : sl;
    const memoryTarget = tgt === 'kmr' ? 'ku' : tgt;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=${encodeURIComponent(memorySource)}|${encodeURIComponent(memoryTarget)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText && !data.responseData.translatedText.includes('MYMEMORY WARNING')) {
        return data.responseData.translatedText.trim();
      }
    }
  } catch (err) {}

  // 3. Fallback: Google GTX with User-Agent header
  try {
    const gtxTarget = tgt === 'kmr' ? 'ku' : tgt;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(gtxTarget)}&dt=t&q=${encodeURIComponent(text.trim())}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const joined = data[0].map(part => (Array.isArray(part) ? part[0] : '')).join('');
        if (joined && joined.trim()) return joined.trim();
      }
    }
  } catch (err) {}

  return text;
}

async function translateBatch(texts, source, target) {
  const src = source && source !== 'auto' ? normalize(source) : undefined, tgt = normalize(target);
  if (src === tgt) return texts;
  const stored = getCache(), result = [], missing = [], positions = [];
  texts.forEach((text,index) => {
    if (!text) result[index] = '';
    else if (stored[hash(text,src,tgt)] && stored[hash(text,src,tgt)] !== text) result[index] = stored[hash(text,src,tgt)];
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

  // Fallback to high-speed client-grade translation endpoints
  for (let i = 0; i < missing.length; i++) {
    const translatedText = await translateSingleGtx(missing[i], src, tgt);
    const pos = positions[i];
    result[pos] = translatedText;
    if (translatedText && translatedText !== missing[i]) {
      stored[hash(missing[i], src, tgt)] = translatedText;
    }
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
