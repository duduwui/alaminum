/**
 * High-performance Translation Service for User Created Products, Categories, and Models.
 * Provides instant AI/dictionary and Cloud auto-translation with Kurdish Sorani, Arabic, English, Spanish & more.
 */

// Architectural vocabulary dictionary for instant offline accuracy (bidirectional)
const ARCHITECTURAL_DICTIONARY: Record<string, { ckb: string; ar: string; kmr: string; fa: string; en: string }> = {
  // English keys
  window: { en: 'Window', ckb: 'پەنجەرە', ar: 'نافذة', kmr: 'Penceber', fa: 'پنجره' },
  windows: { en: 'Windows', ckb: 'پەنجەرەکان', ar: 'نوافذ', kmr: 'Penceberan', fa: 'پنجره‌ها' },
  'windows systems': { en: 'Windows Systems', ckb: 'سیستەمی پەنجەرەکان', ar: 'أنظمة النوافذ', kmr: 'Sîstemên Penceberan', fa: 'سیستم‌های پنجره' },
  door: { en: 'Door', ckb: 'دەرگا', ar: 'باب', kmr: 'Derî', fa: 'درب' },
  doors: { en: 'Doors', ckb: 'دەرگاکان', ar: 'أبواب', kmr: 'Derîyan', fa: 'درب‌ها' },
  'doors systems': { en: 'Doors Systems', ckb: 'سیستەمی دەرگاکان', ar: 'أنظمة الأبواب', kmr: 'Sîstemên Derîyan', fa: 'سیستم‌های درب' },
  glass: { en: 'Glass & Glazing', ckb: 'جام و شووشە', ar: 'زجاج', kmr: 'Cam', fa: 'شیشه' },
  'glass systems': { en: 'Glass Systems', ckb: 'سیستەمی جام و شووشە', ar: 'أنظمة الزجاج', kmr: 'Sîstemên Camê', fa: 'سیستم‌های شیشه' },
  facade: { en: 'Curtain Wall & Facades', ckb: 'فەساد و کەرتن وۆڵ', ar: 'واجهات', kmr: 'Fasad', fa: 'نما' },
  facades: { en: 'Building Facades', ckb: 'فەسادی باڵەخانە', ar: 'واجهات زجاجية', kmr: 'Fasadên avahiyan', fa: 'نماهای ساختمانی' },
  'curtain wall': { en: 'Curtain Wall Systems', ckb: 'کەرتن وۆڵ', ar: 'جدار ستائري', kmr: 'Dîwarê cam', fa: 'کرتین‌وال' },
  railing: { en: 'Railing Systems', ckb: 'محاجەرە', ar: 'درابزين', kmr: 'Mihacer', fa: 'نرده' },
  railings: { en: 'Railing Systems', ckb: 'محاجەرەکان', ar: 'درابزينات', kmr: 'Mihaceran', fa: 'نرده‌ها' },
  hardware: { en: 'Hardware & Accessories', ckb: 'ئێکسسوارات و قفڵ', ar: 'إكسسوارات', kmr: 'Eksesuwar', fa: 'یراق‌آلات' },
  accessories: { en: 'Accessories', ckb: 'ئێکسسوارات', ar: 'ملحقات وإكسسوارات', kmr: 'Eksesuwar', fa: 'لوازم جانبی' },
  sliding: { en: 'Sliding Systems', ckb: 'سلایدینگ (خلیسکێنە)', ar: 'سحاب', kmr: 'Liserxwe', fa: 'کشویی' },
  casement: { en: 'Casement Systems', ckb: 'کەیسمێنت (قەپات)', ar: 'مفصلي', kmr: 'Vekirî', fa: 'لولایی' },
  pivot: { en: 'Modern Pivot Doors', ckb: 'پیڤۆتی مۆدێرن', ar: 'محوري (بيفوت)', kmr: 'Pîvot', fa: 'محوری' },
  bifold: { en: 'Folding & Bifold Systems', ckb: 'فۆڵدینگ (ئەکۆردیۆن)', ar: 'قابل للطي (أكورديون)', kmr: 'Qatbûn', fa: 'آکاردئونی' },
  aluminum: { en: 'Aluminum Systems', ckb: 'ئەلەمینۆم', ar: 'ألمنيوم', kmr: 'Elemyon', fa: 'آلومینیوم' },
  upvc: { en: 'uPVC Profiles', ckb: 'یو پی ڤی سی (uPVC)', ar: 'يو بي في سي (uPVC)', kmr: 'uPVC', fa: 'یو پی وی سی' },
  system: { en: 'System', ckb: 'سیستەم', ar: 'نظام', kmr: 'Sîstem', fa: 'سیستم' },
  systems: { en: 'Systems', ckb: 'سیستەمەکان', ar: 'أنظمة', kmr: 'Sîsteman', fa: 'سیستم‌ها' },
  minimal: { en: 'Minimalist & Slim', ckb: 'مینیمەڵ و باریک', ar: 'نحيف فائق الدقة', kmr: 'Mînîmal', fa: 'مینیمال' },
  thermal: { en: 'Thermal Insulation', ckb: 'عەزلی حەراری', ar: 'عزل حراري', kmr: 'Germbûnê diparêze', fa: 'عایق حرارتی' },
  acoustic: { en: 'Acoustic Sound Insulation', ckb: 'عەزلی دەنگ', ar: 'عازل للصوت', kmr: 'Dengê diparêze', fa: 'عایق صوتی' },
  double: { en: 'Double Glazed', ckb: 'دەبڵ', ar: 'مزدوج', kmr: 'Ducare', fa: 'دوجداره' },
  triple: { en: 'Triple Glazed', ckb: 'تریپڵ (سێ قات)', ar: 'ثلاثي', kmr: 'Sêcare', fa: 'سه‌جداره' },

  // Kurdish & Arabic keys mapped to English & others
  'جام': { en: 'Glass & Glazing Systems', ckb: 'جام و شووشە', ar: 'أنظمة الزجاج', kmr: 'Sîstemên Camê', fa: 'شیشه' },
  'شووشە': { en: 'Glass Systems', ckb: 'شووشە', ar: 'زجاج', kmr: 'Cam', fa: 'شیشه' },
  'جام و شووشە': { en: 'Glass & Glazing Systems', ckb: 'جام و شووشە', ar: 'أنظمة الزجاج', kmr: 'Sîstemên Camê', fa: 'سیستم‌های شیشه' },
  'پەنجەرە': { en: 'Windows Systems', ckb: 'پەنجەرە', ar: 'أنظمة النوافذ', kmr: 'Penceber', fa: 'پنجره' },
  'پەنجەرەکان': { en: 'Windows Systems', ckb: 'پەنجەرەکان', ar: 'أنظمة النوافذ', kmr: 'Penceberan', fa: 'پنجره‌ها' },
  'دەرگا': { en: 'Doors Systems', ckb: 'دەرگا', ar: 'أنظمة الأبواب', kmr: 'Derî', fa: 'درب' },
  'دەرگاکان': { en: 'Doors Systems', ckb: 'دەرگاکان', ar: 'أنظمة الأبواب', kmr: 'Derîyan', fa: 'درب‌ها' },
  'محاجەرە': { en: 'Railing Systems', ckb: 'محاجەرە', ar: 'درابزينات', kmr: 'Mihacer', fa: 'نرده' },
  'محاجەرەکان': { en: 'Railing Systems', ckb: 'محاجەرەکان', ar: 'درابزينات', kmr: 'Mihaceran', fa: 'نرده‌ها' },
  'فەساد': { en: 'Curtain Wall & Facade Systems', ckb: 'فەساد و کەرتن وۆڵ', ar: 'واجهات زجاجية', kmr: 'Fasad', fa: 'نما' },
  'کەرتن وۆڵ': { en: 'Curtain Wall Systems', ckb: 'کەرتن وۆڵ', ar: 'جدار ستائري', kmr: 'Dîwarê cam', fa: 'کرتین‌وال' },
  'ئەلەمینۆم': { en: 'Aluminum Systems', ckb: 'ئەلەمینۆم', ar: 'أنظمة الألمنيوم', kmr: 'Elemyon', fa: 'آلومینیوم' },
  'ئەلۆمنیۆم': { en: 'Aluminum Systems', ckb: 'ئەلۆمنیۆم', ar: 'أنظمة الألمنيوم', kmr: 'Elemyon', fa: 'آلومینیوم' },
  'ئێکسسوارات': { en: 'Hardware & Accessories', ckb: 'ئێکسسوارات و قفڵ', ar: 'إكسسوارات', kmr: 'Eksesuwar', fa: 'یراق‌آلات' },
  'سلایدینگ': { en: 'Sliding Systems', ckb: 'سلایدینگ (خلیسکێنە)', ar: 'أنظمة السحاب', kmr: 'Liserxwe', fa: 'کشویی' },
  'قەپات': { en: 'Casement Systems', ckb: 'کەیسمێنت (قەپات)', ar: 'مفصلي', kmr: 'Vekirî', fa: 'لولایی' }
};

/**
 * Auto-translates any input text into target language (default Kurdish Sorani 'ckb' or English 'en').
 * Checks architectural dictionary first, then uses fast cloud translation API with fallbacks.
 */
export const autoTranslateText = async (
  text: string,
  targetLang: 'ckb' | 'ar' | 'kmr' | 'fa' | 'tr' | 'en' | 'es' | 'de' = 'ckb'
): Promise<string> => {
  if (!text || !text.trim()) return '';

  const clean = text.trim();
  const lower = clean.toLowerCase();

  // 1. Direct dictionary match for common architectural terms
  if (ARCHITECTURAL_DICTIONARY[lower]?.[targetLang as keyof typeof ARCHITECTURAL_DICTIONARY[string]]) {
    return ARCHITECTURAL_DICTIONARY[lower][targetLang as keyof typeof ARCHITECTURAL_DICTIONARY[string]];
  }

  // Check if target is English and clean is in dictionary values
  if (targetLang === 'en') {
    for (const entry of Object.values(ARCHITECTURAL_DICTIONARY)) {
      if (entry.ckb === clean || entry.ar === clean || entry.fa === clean) {
        return entry.en;
      }
    }
  }

  // 2. Google Translate Client API endpoint (free, ultra-fast)
  try {
    const langMap: Record<string, string> = {
      ckb: 'ckb', // Kurdish Sorani
      kmr: 'ku',  // Kurmanji
      ar: 'ar',   // Arabic
      fa: 'fa',   // Persian
      tr: 'tr',   // Turkish
      es: 'es',   // Spanish
      de: 'de',   // German
      en: 'en'
    };
    const tl = langMap[targetLang] || targetLang;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(clean)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => item[0]).join('').trim();
        if (translated) return translated;
      }
    }
  } catch (e) {
    // Continue to fallback
  }

  // 3. Fallback: MyMemory Translation API
  try {
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=auto|${targetLang === 'ckb' ? 'ckb' : targetLang}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(myMemoryUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText && !data.responseData.translatedText.includes('MYMEMORY WARNING')) {
        return data.responseData.translatedText;
      }
    }
  } catch (e) {
    // fallback
  }

  // If translation fails or offline, return original text
  return clean;
};

/**
 * Translates an entire Category object to Kurdish automatically.
 */
export const autoTranslateCategory = async (category: {
  title: string;
}): Promise<{
  kurdishTitle: string;
  divisionLabel: string;
  kurdishDivisionLabel: string;
}> => {
  const isKurdishOrArabic = /[\u0600-\u06FF]/.test(category.title);
  if (isKurdishOrArabic) {
    const resolved = await autoResolveCategoryTranslations(category.title);
    return {
      kurdishTitle: resolved.kurdishTitle,
      divisionLabel: resolved.divisionLabel,
      kurdishDivisionLabel: resolved.kurdishDivisionLabel
    };
  }

  const [kurdishTitle] = await Promise.all([
    autoTranslateText(category.title, 'ckb')
  ]);

  return {
    kurdishTitle: kurdishTitle || category.title,
    divisionLabel: `${category.title} Division`,
    kurdishDivisionLabel: `قسمی ${kurdishTitle || category.title}`
  };
};

/**
 * Translates an entire Product / Model object to Kurdish automatically.
 */
export const autoTranslateModel = async (model: {
  name: string;
  description: string;
}): Promise<{ kurdishName: string; kurdishDescription: string }> => {
  const isKurdishOrArabic = /[\u0600-\u06FF]/.test(model.name);
  if (isKurdishOrArabic) {
    const resolved = await autoResolveModelTranslations(model.name, model.description);
    return {
      kurdishName: resolved.kurdishName,
      kurdishDescription: resolved.kurdishDescription
    };
  }

  const [kurdishName, kurdishDescription] = await Promise.all([
    autoTranslateText(model.name, 'ckb'),
    model.description ? autoTranslateText(model.description, 'ckb') : Promise.resolve('')
  ]);

  return {
    kurdishName: kurdishName || model.name,
    kurdishDescription: kurdishDescription || model.description
  };
};

/**
 * Automatically resolves bidirectional (English & Kurdish) category labels from whatever language the user entered.
 */
export const autoResolveCategoryTranslations = async (name: string): Promise<{
  title: string;
  kurdishTitle: string;
  divisionLabel: string;
  kurdishDivisionLabel: string;
}> => {
  const clean = (name || '').trim();
  if (!clean) {
    return {
      title: 'New Division',
      kurdishTitle: 'بەشی نوێ',
      divisionLabel: 'New Division',
      kurdishDivisionLabel: 'قسمی نوێ'
    };
  }

  const isKurdishOrArabic = /[\u0600-\u06FF]/.test(clean);
  if (isKurdishOrArabic) {
    // Clean Kurdish prefix e.g. "قسمی " or "بەشی "
    const strippedTitle = clean.replace(/^قسمی\s+/, '').replace(/^بەشی\s+/, '').replace(/^قسم\s+/, '').replace(/^بەش\s+/, '').trim();
    const kurdishTitle = strippedTitle || clean;
    
    // Check dictionary first for high quality translation
    let englishTitle = '';
    if (ARCHITECTURAL_DICTIONARY[kurdishTitle]?.en) {
      englishTitle = ARCHITECTURAL_DICTIONARY[kurdishTitle].en;
    } else {
      englishTitle = await autoTranslateText(kurdishTitle, 'en');
    }

    const finalEnglish = englishTitle && englishTitle !== kurdishTitle ? englishTitle : `${kurdishTitle} Systems`;
    return {
      title: finalEnglish,
      kurdishTitle: kurdishTitle,
      divisionLabel: `${finalEnglish} Division`,
      kurdishDivisionLabel: clean.startsWith('قسم') || clean.startsWith('بەش') ? clean : `قسمی ${kurdishTitle}`
    };
  } else {
    const englishTitle = clean.replace(/\s+Division$/i, '').trim();
    
    // Check dictionary first for Kurdish
    let kurdishTitle = '';
    const lower = englishTitle.toLowerCase();
    if (ARCHITECTURAL_DICTIONARY[lower]?.ckb) {
      kurdishTitle = ARCHITECTURAL_DICTIONARY[lower].ckb;
    } else {
      kurdishTitle = await autoTranslateText(englishTitle, 'ckb');
    }

    const finalKurdish = kurdishTitle && kurdishTitle !== englishTitle ? kurdishTitle : englishTitle;
    return {
      title: englishTitle,
      kurdishTitle: finalKurdish,
      divisionLabel: `${englishTitle} Division`,
      kurdishDivisionLabel: `قسمی ${finalKurdish}`
    };
  }
};

/**
 * Automatically resolves bidirectional (English & Kurdish) model labels.
 */
export const autoResolveModelTranslations = async (
  name: string,
  description = ''
): Promise<{
  name: string;
  kurdishName: string;
  description: string;
  kurdishDescription: string;
}> => {
  const cleanName = (name || '').trim();
  const cleanDesc = (description || '').trim();

  const isKurdishOrArabic = /[\u0600-\u06FF]/.test(cleanName);
  if (isKurdishOrArabic) {
    let englishName = '';
    if (ARCHITECTURAL_DICTIONARY[cleanName]?.en) {
      englishName = ARCHITECTURAL_DICTIONARY[cleanName].en;
    } else {
      englishName = await autoTranslateText(cleanName, 'en');
    }
    const englishDesc = cleanDesc ? await autoTranslateText(cleanDesc, 'en') : `${englishName || cleanName} architectural system.`;
    return {
      name: englishName || cleanName,
      kurdishName: cleanName,
      description: englishDesc || cleanDesc,
      kurdishDescription: cleanDesc || `${cleanName} - پرۆفایلی ئەندازیاری کوالێتی بەرز.`
    };
  } else {
    let kurdishName = '';
    const lower = cleanName.toLowerCase();
    if (ARCHITECTURAL_DICTIONARY[lower]?.ckb) {
      kurdishName = ARCHITECTURAL_DICTIONARY[lower].ckb;
    } else {
      kurdishName = await autoTranslateText(cleanName, 'ckb');
    }
    const kurdishDesc = cleanDesc ? await autoTranslateText(cleanDesc, 'ckb') : `${kurdishName || cleanName} - پرۆفایلی ئەندازیاری کوالێتی بەرز.`;
    return {
      name: cleanName,
      kurdishName: kurdishName || cleanName,
      description: cleanDesc || `${cleanName} architectural system.`,
      kurdishDescription: kurdishDesc
    };
  }
};

/**
 * Automatically translates a product's name and description into all supported languages:
 * Arabic (ar), English (en), Kurdish Sorani (ckb), Kurdish Kurmanji (kmr), Turkish (tr), and German (de).
 */
export async function autoTranslateFullProduct(productData: {
  name: string;
  description: string;
}): Promise<Record<string, { name: string; description: string }>> {
  const cleanName = (productData.name || '').trim();
  const cleanDesc = (productData.description || '').trim();
  if (!cleanName && !cleanDesc) return {};

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('dh_admin_token') ? { Authorization: `Bearer ${localStorage.getItem('dh_admin_token')}` } : {}) },
      credentials: 'include',
      body: JSON.stringify({
        name: cleanName,
        description: cleanDesc
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.translations) {
        return data.translations;
      }
    }
  } catch (err) {
    console.warn('Backend translation endpoint error, using client-side fallback:', err);
  }

  // Fallback client-side translation
  const sample = (cleanName || cleanDesc).trim();
  const detectedSrc = /[\u0600-\u06FF]/.test(sample) ? 'ar' : 'en';
  const targetLangs = ['ckb', 'kmr', 'ar', 'tr', 'fa', 'en-GB', 'de', 'fr', 'it', 'el', 'es', 'ro', 'bg', 'sr', 'bs', 'hr', 'sq', 'nl', 'sv', 'pl', 'pt', 'en-US', 'es-MX', 'pt-BR', 'zh-CN', 'ru', 'hi', 'ja', 'ko', 'kk', 'en'] as const;
  const translations: Record<string, { name: string; description: string }> = {};

  await Promise.all(
    targetLangs.map(async (lang) => {
      const tName = lang === detectedSrc ? cleanName : await autoTranslateText(cleanName, lang);
      const tDesc = lang === detectedSrc ? cleanDesc : await autoTranslateText(cleanDesc, lang);
      translations[lang] = {
        name: tName || cleanName,
        description: tDesc || cleanDesc
      };
    })
  );

  return translations;
}
