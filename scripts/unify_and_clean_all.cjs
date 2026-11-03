const fs = require('fs');
const path = require('path');

// 1. Text cleaner helper to remove all origins, countries, gases, and English brand codes
function cleanForbiddenText(text) {
  if (!text || typeof text !== 'string') return text;
  let s = text;

  // Normal replacements for Arabic
  const arReplacements = [
    // Duplicate words fix first
    [/عالي الأمان عالي الأمان/g, 'عالي الأمان'],
    [/الالمعتمدة/g, 'المعتمدة'],
    [/المعتمدة المعتمدة/g, 'المعتمدة'],
    [/المجرى الأوروبي المجرى الأوروبي/g, 'المجرى القياسي'],
    [/المجرى الأوروبي/g, 'المجرى القياسي المعماري'],
    [/المجرى الاوروبي/g, 'المجرى القياسي المعماري'],
    [/القطاع الأوروبي/g, 'القطاع المعماري المعتمد'],
    [/القطاع الاوروبي/g, 'القطاع المعماري المعتمد'],
    [/الفولاذ المقاوم للصدأ الفولاذ المقاوم للصدأ/g, 'الفولاذ المقاوم للصدأ'],
    [/القابلة للطي القابلة للطي/g, 'القابلة للطي'],
    [/فائقاً فائق/g, 'فائقاً'],

    // Origin countries
    [/ألمانية الصنع|المانية الصنع|إيطالية الصنع|ايطالية الصنع|إسبانية الصنع|اسبانية الصنع|تركية الصنع/gi, 'عالية الجودة المعتمدة'],
    [/ألماني الصنع|الماني الصنع|إيطالي الصنع|ايطالي الصنع|إسباني الصنع|اسباني الصنع|تركي الصنع/gi, 'عالي الجودة المعتمد'],
    [/أوروبية الصنع|اوروبية الصنع/gi, 'المعتمدة فائقة الدقة'],
    [/أوروبي الصنع|اوروبي الصنع/gi, 'المعتمد فائق الدقة'],

    [/الألمانية|الالمانية/g, 'المعتمدة عالية الدقة'],
    [/ألمانية|المانية/g, 'المعتمدة'],
    [/الألماني|الالماني/g, 'المعماري المعتمد'],
    [/ألماني|الماني/g, 'المعتمد'],

    [/الإيطالية|الايطالية/g, 'المعتمدة عالية الأداء'],
    [/إيطالية|ايطالية/g, 'المعتمدة'],
    [/الإيطالي|الايطالي/g, 'المعماري المعتمد'],
    [/إيطالي|ايطالي/g, 'المعتمد'],

    [/الإسبانية|الاسبانية/g, 'المعتمدة المتطورة'],
    [/إسبانية|اسبانية/g, 'المعتمدة'],
    [/الإسباني|الاسباني/g, 'المعماري المعتمد'],
    [/إسباني|اسباني/g, 'المعتمد'],

    [/التركية/g, 'المعتمدة'],
    [/تركية/g, 'المعتمدة'],
    [/التركي/g, 'المعتمد'],
    [/تركي/g, 'المعتمد'],

    [/الأوروبية|الاوروبية/g, 'المعمارية المعتمدة'],
    [/أوروبية|اوروبية/g, 'المعتمدة'],
    [/الأوروبي|الاوروبي/g, 'القياسي المعياري'],
    [/أوروبي|اوروبي/g, 'المعتمد'],

    // Gas mentions
    [/بغاز الآرغون|بغاز الارغون|بغاز الأرجون|بغاز الارجون/gi, 'بتقنية العزل الحراري المزدوج'],
    [/غاز الآرغون|غاز الارغون|غاز الأرجون|غاز الارجون/gi, 'العزل الحراري المفرغ'],
    [/الآرغون|الارغون|الأرجون|الارجون/gi, 'العزل المعماري'],

    // Hardware brands and codes in Arabic
    [/دورما الألمانية|دورما/gi, 'الأنظمة الهيدروليكية المعتمدة'],
    [/غيزه الألمانية|غيزه/gi, 'المفصلات المعمارية المعتمدة'],
    [/ستارک|ستارك/gi, 'الأنظمة متعددة النقاط'],
    [/ديسونينك|ديكونينك/gi, 'القطاعات متعددة الحجرات'],
    [/ستانلس ستيل 316|ستانلس 316|316 ستانلس/gi, 'الفولاذ المقاوم للصدأ البحري عالي المتانة'],
    [/ستانلس ستيل 304|ستانلس 304|304 ستانلس|AISI 304|SS304/gi, 'الفولاذ المقاوم للصدأ عالي التحمل'],
    [/304/g, 'المقاوم للصدأ'],
    [/STAC|stac/g, 'المعتمدة'],
    [/EPDM/g, 'المطاط المعماري المقاوم للعوامل الجوية'],
    [/Legend 80/gi, 'الأنظمة سداسية الحجرات العازلة'],
    [/Lorenzo 70LS|Lorenzo/gi, 'أنظمة السحب والرفع المعمارية'],

    // Clean duplicate words again
    [/المعتمدة المعتمدة/g, 'المعتمدة'],
    [/المعتمد المعتمد/g, 'المعتمد'],
    [/عالي الأمان عالي الأمان/g, 'عالي الأمان'],
    [/عالية الجودة عالية الجودة/g, 'عالية الجودة'],
    [/فائق التحمل فائق التحمل/g, 'فائق التحمل']
  ];

  for (const [pattern, repl] of arReplacements) {
    s = s.replace(pattern, repl);
  }

  // English replacements
  const enReplacements = [
    [/European STAC/gi, 'High-Security Multi-Point'],
    [/STAC/gi, 'Certified Architectural'],
    [/Deceuninck Legend 80/gi, 'Multi-Chamber Acoustic'],
    [/Legend 80/gi, 'Multi-Chamber Insulated'],
    [/Lorenzo 70LS|Lorenzo/gi, 'Heavy-Duty Panoramic'],
    [/German hardware|German components|German engineering/gi, 'Certified Heavy-Duty Hardware'],
    [/German Dorma\/Geze|Dorma\/Geze|Dorma|Geze/gi, 'Concealed Heavy-Duty Hydraulic'],
    [/German/gi, 'Precision'],
    [/Germany/gi, 'International Standard'],
    [/Italian/gi, 'Architectural'],
    [/Italy/gi, 'Factory Direct'],
    [/Spanish/gi, 'Premium'],
    [/Spain/gi, 'Factory Direct'],
    [/European Groove/gi, 'Standard Architectural Groove'],
    [/European/gi, 'Architectural Standard'],
    [/Argon gas|Argon/gi, 'Dry Insulated Air'],
    [/AISI 304|SS304/gi, 'Marine Grade Stainless Steel'],
    [/Grade 316|AISI 316|SS316/gi, 'High-Grade Marine Stainless Steel'],
    [/EPDM/gi, 'Architectural Weather-Resistant']
  ];

  for (const [pattern, repl] of enReplacements) {
    s = s.replace(pattern, repl);
  }

  // Kurdish replacements
  const kuReplacements = [
    [/ئەڵمانی/gi, 'کوالیتی بەرز'],
    [/ئیتالی/gi, 'تەلارسازی متمانەپێکراو'],
    [/ئیسپانی/gi, 'مۆدێرنی پێشکەوتوو'],
    [/ئەوروپی/gi, 'ستانداردی نێودەوڵەتی'],
    [/گازی ئارگۆن|ئارگۆن/gi, 'عەزلی دووقات'],
    [/304|SS304/gi, 'ستیلی دژە ژەنگ']
  ];

  for (const [pattern, repl] of kuReplacements) {
    s = s.replace(pattern, repl);
  }

  return s;
}

// Deep cleaner for an entire object/array
function deepClean(obj) {
  if (typeof obj === 'string') {
    return cleanForbiddenText(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepClean(item));
  }
  if (obj !== null && typeof obj === 'object') {
    const res = {};
    for (const key of Object.keys(obj)) {
      res[key] = deepClean(obj[key]);
    }
    return res;
  }
  return obj;
}

// 2. Load databases
const prodsPath = path.resolve('cms_products_db.json');
const galleryPath = path.resolve('cms_gallery_db.json');
const slidesPath = path.resolve('cms_homepage_section_slides_db.json');
const archPath = path.resolve('cms_arch_showcase_db.json');
const divPath = path.resolve('cms_divisions_db.json');

let prods = JSON.parse(fs.readFileSync(prodsPath, 'utf8'));
let gallery = JSON.parse(fs.readFileSync(galleryPath, 'utf8'));
let slides = JSON.parse(fs.readFileSync(slidesPath, 'utf8'));
let arch = JSON.parse(fs.readFileSync(archPath, 'utf8'));
let divisions = JSON.parse(fs.readFileSync(divPath, 'utf8'));

console.log('Original items loaded.');

// 3. First pass: Deep clean all forbidden words from all databases
prods = deepClean(prods);
gallery = deepClean(gallery);
slides = deepClean(slides);
arch = deepClean(arch);
divisions = deepClean(divisions);

console.log('✓ First pass deep cleaning completed.');

// 4. Specifically refine Partition Door (door-dh-dr-30) across all definitions
const partitionProd = prods.find(p => p.id === 'door-dh-dr-30');
if (partitionProd) {
  partitionProd.image = '/uploads/38e5c8dc-3834-4830-beb8-4928718d9f30.jpg';
  partitionProd.fallbackImage = '/uploads/38e5c8dc-3834-4830-beb8-4928718d9f30.jpg';
  partitionProd.name = 'Glass Partition System for Offices and Companies';
  partitionProd.arabicName = 'نظام قواطع وأبواب زجاجية للمكاتب والشركات';
  partitionProd.kurdishName = 'سیستەمی دیواری جیاکەرەوە و دەرگای شووشەیی بۆ ئۆفیس و کۆمپانیاکان';
  
  const partArDesc = `صُمم هذا النظام المعماري من القواطع والأبواب الزجاجية الداخلية خصيصاً للمكاتب التنفيذية والشركات وقاعات الاجتماعات والمراكز التجارية الحديثة. يتوفر بزجاج سيكوريت مقسى عالي المتانة سماكة 10 ملم أو بنظام الزجاج المزدوج العازل، مما يوفر هدوءاً وخصوصية صوتية ممتازة مع تدفق كامل للضوء الطبيعي.

يتميز النظام بإكسسوارات ومفصلات هيدروليكية فائقة الدقة مدمجة بالأرضية، تتيح فتح الباب بسلاسة في الاتجاهين مع خاصية التثبيت والإغلاق الهادئ والمحكوم. تمنح الشرائط الأفقية المصنفرة خصوصية بصرية ذكية وأنيقة للمكاتب دون التأثير على رحابة المكان.

تمنح الإطارات المعدنية النحيفة تصميماً راقياً يناسب بيئات العمل الاحترافية والمستشفيات والعيادات والتقسيمات الداخلية للمنازل المعاصرة. يجمع بين الفخامة المعمارية والعزل المريح والاعتمادية الطويلة بأقل قدر من الصيانة.`;

  const partEnDesc = `This modern interior glass partition system is purposefully designed for corporate offices, executive suites, conference rooms, and commercial centers. Engineered with 10mm heavy-duty tempered safety glass or an insulated double-glazed configuration, it provides acoustic privacy while allowing daylight to flow freely between spaces.

Equipped with premium certified hardware and concealed hydraulic floor pivot hinges, the door swings smoothly in both directions with controlled soft-close and 90-degree hold-open positioning. Elegant horizontal frosted privacy bands provide visual discretion at eye level while preserving an open, prestigious corporate environment.

The minimal aluminum framing delivers lasting durability and seamless integration into modern workspaces, clinics, and residential zoning areas. It represents the perfect combination of contemporary styling, acoustic comfort, and effortless daily performance.`;

  const partKuDesc = `ئەم سیستمە مۆدێرنەی دیواری جیاکەرەوە و دەرگای شووشەیی ناوخۆیی بە تایبەتی بۆ ئۆفیسی کۆمپانیاکان، ژووری بەڕێوەبەران، هۆڵی کۆبوونەوە و سەنتەرە بازرگانییەکان دیزاین کراوە. بە شوشەی سیکیوریتی بەهێزی ١٠ ملم یان شوشەی دووجۆڕی عازل بەردەستە، کە ئارامی و تایبەتمەندی دەنگی دابین دەکات لەگەڵ بڵاوبوونەوەی ڕووناکی سروشتی.

بە ئەکسسوارات و مەکینەی هایدرۆلیکی پێشکەوتوو لەسەر زەوی کار دەکات، کە دەرگاکە بە نەرمی بە هەردوو لادا دەکرێتەوە و بە هێمنی دادەخرێتەوە. شریتە تەڵخە شیکەکان تایبەتمەندی و پارێزگاری لە بینین دابین دەکەن بەبێ تێکدانی کراوەیی و ڕووناکیی ژینگەی کار.

چوارچێوەی ئەلەمنیۆمی تەنک دیمەنێکی سەرنجڕاکێش بە ئۆفیسەکان، کلینیکەکان و بەشە ناوخۆییەکانی ماڵ دەبەخشێت. تێکەڵەیەکی نموونەییە لە جوانی هاوچەرخ، ئارامی دەنگی، و کارکردنی متمانەپێکراو بۆ ساڵانی درێژ.`;

  partitionProd.arabicDescription = partArDesc;
  partitionProd.description = partEnDesc;
  partitionProd.kurdishDescription = partKuDesc;

  if (!partitionProd.translations) partitionProd.translations = {};
  partitionProd.translations.ar = {
    ...(partitionProd.translations.ar || {}),
    name: partitionProd.arabicName,
    title: partitionProd.arabicName,
    description: partArDesc
  };
  partitionProd.translations.en = {
    ...(partitionProd.translations.en || {}),
    name: partitionProd.name,
    title: partitionProd.name,
    description: partEnDesc
  };
  partitionProd.translations.ckb = {
    ...(partitionProd.translations.ckb || {}),
    name: partitionProd.kurdishName,
    title: partitionProd.kurdishName,
    description: partKuDesc
  };
}

// 5. UNIFY PRODUCTS WITH GALLERY AND HOMEPAGE SLIDES
let unifiedGalleryCount = 0;
let unifiedSlideCount = 0;

function getPhotoNumber(str) {
  if (!str) return null;
  const m = str.match(/photo_(\d+)/);
  return m ? m[1] : null;
}

// Build helper lookup of products by ID, base filename, and photo number
const prodByPhoto = new Map();
const prodByFilename = new Map();
const prodById = new Map();

for (const p of prods) {
  prodById.set(p.id, p);
  const pImg = p.image || '';
  const base = pImg.split('/').pop().split('?')[0];
  if (base) prodByFilename.set(base, p);
  const num = getPhotoNumber(pImg);
  if (num) prodByPhoto.set(num, p);
}

// Unify in Gallery
gallery = gallery.map(item => {
  const gSrc = (item.src || item.image || item.url || '').trim();
  const gBase = gSrc.split('/').pop().split('?')[0];
  const gPhoto = getPhotoNumber(gSrc);

  let matchedProd = null;
  if (item.id === 'proj-photo-partition-office' || gBase.includes('38e5c8dc')) {
    matchedProd = partitionProd;
  } else if (prodById.has(item.id)) {
    matchedProd = prodById.get(item.id);
  } else if (gBase && prodByFilename.has(gBase)) {
    matchedProd = prodByFilename.get(gBase);
  } else if (gPhoto && prodByPhoto.has(gPhoto)) {
    matchedProd = prodByPhoto.get(gPhoto);
  }

  if (matchedProd) {
    unifiedGalleryCount++;
    const arTitle = matchedProd.arabicName || matchedProd.name;
    const arDesc = matchedProd.arabicDescription || matchedProd.description;
    const enTitle = matchedProd.name || arTitle;
    const enDesc = matchedProd.description || arDesc;
    const kuTitle = matchedProd.kurdishName || arTitle;
    const kuDesc = matchedProd.kurdishDescription || arDesc;

    return {
      ...item,
      title: arTitle,
      description: arDesc,
      category: matchedProd.category || item.category,
      translations: {
        ar: {
          title: arTitle,
          description: arDesc
        },
        en: {
          title: enTitle,
          description: enDesc
        },
        ckb: {
          title: kuTitle,
          description: kuDesc
        }
      }
    };
  }

  return item;
});

// Unify in Homepage Section Slides
slides = slides.map(slide => {
  const sSrc = (slide.image || slide.src || slide.imageUrl || '').trim();
  const sBase = sSrc.split('/').pop().split('?')[0];
  const sPhoto = getPhotoNumber(sSrc);

  let matchedProd = null;
  if (slide.id === 'prod-1793104209359' || sBase.includes('38e5c8dc')) {
    matchedProd = partitionProd;
  } else if (prodById.has(slide.id)) {
    matchedProd = prodById.get(slide.id);
  } else if (sBase && prodByFilename.has(sBase)) {
    matchedProd = prodByFilename.get(sBase);
  } else if (sPhoto && prodByPhoto.has(sPhoto)) {
    matchedProd = prodByPhoto.get(sPhoto);
  }

  if (matchedProd) {
    unifiedSlideCount++;
    const arTitle = matchedProd.arabicName || matchedProd.name;
    const arDesc = matchedProd.arabicDescription || matchedProd.description;
    const enTitle = matchedProd.name || arTitle;
    const enDesc = matchedProd.description || arDesc;
    const kuTitle = matchedProd.kurdishName || arTitle;
    const kuDesc = matchedProd.kurdishDescription || arDesc;

    return {
      ...slide,
      name: arTitle,
      title: arTitle,
      arabicName: arTitle,
      description: arDesc,
      arabicDescription: arDesc,
      category: matchedProd.category || slide.category,
      division: matchedProd.division || slide.division,
      translations: {
        ar: {
          name: arTitle,
          title: arTitle,
          description: arDesc
        },
        en: {
          name: enTitle,
          title: enTitle,
          description: enDesc
        },
        ckb: {
          name: kuTitle,
          title: kuTitle,
          description: kuDesc
        }
      }
    };
  }

  return slide;
});

console.log(`Unified ${unifiedGalleryCount} gallery items with products.`);
console.log(`Unified ${unifiedSlideCount} homepage slides with products.`);

// 6. Clean and refine cms_arch_showcase_db.json
arch = arch.map(item => {
  if (item.id === 'wiek-limiting-hinge-w23045') {
    return {
      ...item,
      title: 'Architectural Limiting Hinge Series',
      titleAr: 'سلسلة مفصلات تحديد الفتح الهندسية المعتمدة',
      titleKu: 'سیستەمی نەرمەلۆی سنوردارکردنی کردنەوەی ئەندازیاری',
      description: 'Extensible/Adjustable limiting hinge set for projected windows. Suitable for Standard Architectural Groove profiles, manufactured in Marine Grade Stainless Steel. Allows window opening in 5 defined positions with adjustable sash positioning.',
      descriptionAr: 'طقم مفصلات تحديد الفتح القابلة للتمديد والضبط للنوافذ القلابة والمعمارية البارزة للخارج. متوافقة مع قطاعات المجرى القياسي وسلسلة القطاعات المعمارية، مصنعة من الفولاذ المقاوم للصدأ عالي التحمل وتتيح فتح النافذة بـ 5 وضعيات محددة مع إمكانية ضبط زاوية الفتح بدقة.',
      descriptionKu: 'کۆمەڵە نەرمەلۆی سنوردارکردنی درێژکراوە و ڕێکخراو بۆ پەنجەرەی دەرپەڕیو البارزة للخارج. گونجاوە بۆ پرۆفایلی ستاندارد، لە ستیلی دژە ژەنگ دروستکراوە بە ٥ دۆخی کردنەوە.',
      brand: 'Architectural System',
      category: 'Limiting Hinge Series'
    };
  }
  if (item.id === 'wiek-precision-bifold-w00006') {
    return {
      ...item,
      title: 'Precision Bi-Folding Architectural Door System',
      titleAr: 'نظام الأبواب القابلة للطي المعماري فائق الخفة والدقة',
      titleKu: 'سیستەمی دەرگای تاپۆشی پێشکەوتووی کێش سووک و ورد',
      description: 'Ultra-lightweight precision folding door system with synchronized rolling carriages and reinforced multi-point central locking mechanism for wide monumental residential openings.',
      descriptionAr: 'نظام حركة معمارية فائق الدقة للأبواب القابلة للطي والتطبيق متعددة الضلف برولرات فولاذية صامتة وتروس أمان مركزية متعددة النقاط لتحقيق أوسع انفتاح بانورامي للحدائق والواجهات.',
      brand: 'Architectural System',
      category: 'Folding Door Systems'
    };
  }
  if (item.id === 'wiek-lift-slide-ls150') {
    return {
      ...item,
      title: 'Heavy-Duty Panoramic Lift & Slide System',
      titleAr: 'نظام السحب والرفع البانورامي فائق التحمل',
      titleKu: 'سیستەمی سلایدینگ و بەرزکردنەوەی پانۆرامای بەهێز',
      description: 'Heavy-duty lift & slide hardware system engineered for monumental thermal sliding panels with high wind-load resistance and smooth transmission gearing.',
      descriptionAr: 'منظومة تروس ورولرات متطورة للأبواب السحابة العملاقة بتقنية السحاب والرفع المعماري، مصممة لتحريك الضلف الزجاجية الثقيلة بسلاسة استثنائية مع عزل محكم ضد العواصف والرياح.',
      brand: 'Architectural System',
      category: 'Lift & Slide Hardware'
    };
  }
  if (item.id === 'wiek-concealed-hinge-system') {
    return {
      ...item,
      title: 'Concealed 180° Flush Hinge System',
      titleAr: 'نظام المفصلات المخفية بالكامل بزاوية 180°',
      titleKu: 'سیستەمی نەرمەلۆی تەواو شاردراوە بە گۆشەی 180°',
      description: 'Converts 180 degrees to 90 degrees flush concealed hinge architecture engineered for modern minimalist profiles with 130 kg sash load capacity and modular locking.',
      descriptionAr: 'مفصلات غاطسة مخفية 100% داخل قطاع الألمنيوم والـ يو بي في سي عالي العزل تمنح خطوطاً معمارية متناسقة وخالية من أي بروز خارجي مع قدرة تحمل أوزان حتى 130 كغم.',
      brand: 'Architectural System',
      category: 'Concealed Window Hardware'
    };
  }
  if (item.id === 'stac-minimalist-handle-delta') {
    return {
      ...item,
      title: 'Minimalist Architectural Handle Series',
      titleAr: 'سلسلة المقابض المعمارية المينيماليست بدون غطاء',
      titleKu: 'دەسکی مۆدێرنی مینیمالیست بێ قەپاغ بۆ پەنجەرە',
      description: 'Minimalist handles for side-hung or tilt & turn systems with concealed mechanism without cover, 8 mm transmission spindle, and precision guide system minimizing clearances.',
      descriptionAr: 'مقابض مينيماليست عصرية بدون غطاء خارجي بآلية مخفية ومحور نقل حركة 8 مم ونظام توجيه هندسي يقلل الخلوص، مصممة للنوافذ المفصلية ونوافذ القلاب الحديثة.',
      brand: 'Architectural System',
      category: 'Minimalist Window Handles'
    };
  }
  return item;
});

// Final deep clean check on all objects
prods = deepClean(prods);
gallery = deepClean(gallery);
slides = deepClean(slides);
arch = deepClean(arch);
divisions = deepClean(divisions);

// 7. Write back all JSON files
fs.writeFileSync(prodsPath, JSON.stringify(prods, null, 2), 'utf8');
fs.writeFileSync(galleryPath, JSON.stringify(gallery, null, 2), 'utf8');
fs.writeFileSync(slidesPath, JSON.stringify(slides, null, 2), 'utf8');
fs.writeFileSync(archPath, JSON.stringify(arch, null, 2), 'utf8');
fs.writeFileSync(divPath, JSON.stringify(divisions, null, 2), 'utf8');

console.log('✓ Successfully written all JSON database files locally.');
