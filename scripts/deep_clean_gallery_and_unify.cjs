const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
  // Argon / Gas
  [/بغاز الآرغون|بغاز الارغون|بغاز الأرجون|بغاز الارجون/gi, 'بتقنية العزل الحراري المزدوج'],
  [/ومملوء بغاز الآرغون|ومملوء بغاز الارغون|مملوء بغاز الآرغون|مملوء بغاز الارغون/gi, 'بتقنية العزل المفرغ المزدوج'],
  [/غاز الآرغون|غاز الارغون|غاز الأرجون|غاز الارجون/gi, 'العزل الحراري المفرغ'],
  [/الآرغون|الارغون|الأرجون|الارجون/gi, 'العزل المعماري'],
  [/Argon/gi, 'Thermal-Break Insulation'],

  // Countries
  [/ألمانية الصنع|المانية الصنع|ألماني الصنع|الماني الصنع/gi, 'معتمدة الجودة والمواصفات'],
  [/إيطالية الصنع|ايطالية الصنع|إيطالي الصنع|ايطالي الصنع/gi, 'معمارية عالية التحمل'],
  [/إسبانية الصنع|اسبانية الصنع|إسباني الصنع|اسباني الصنع/gi, 'فائقة الدقة والاعتمادية'],
  [/تركية الصنع|تركية الصنع|تركي الصنع|تركي الصنع/gi, 'عالية الجودة'],
  [/ألمانية|الالمانية|ألماني|الالماني|ألمانيا|المانيا/gi, 'المعتمدة'],
  [/إيطالية|الايطالية|إيطالي|الايطالي|إيطاليا|ايطاليا/gi, 'المعمارية'],
  [/إسبانية|الاسبانية|إسباني|الاسباني|إسبانيا|اسبانيا/gi, 'المتطورة'],
  [/بلجيكية|البلجيكية|بلجيكي|البلجيكي|بلجيكا/gi, 'المعتمدة'],
  [/تركية|التركية|تركي|التركي|تركيا/gi, 'المعمارية'],
  [/أوروبية|الاوروبية|أوروبي|الاوروبي|أوروبا|اوروبا/gi, 'الهندسية'],
  [/German(y)?/gi, 'Architectural'],
  [/Italian(y)?/gi, 'Architectural'],
  [/Spanish|Spain/gi, 'Architectural'],
  [/Belgium|Belgian/gi, 'Architectural'],
  [/Turkish|Turkey/gi, 'Architectural'],
  [/European|Europe/gi, 'Architectural'],

  // Brands / Models / Hardware
  [/Lorenzo 70LS|Lorenzo/gi, 'نظام السحب المعماري'],
  [/Deceuninck Legend 80|Deceuninck|Legend 80/gi, 'أنظمة يو بي في سي عازلة'],
  [/STAC/gi, 'المعتمدة'],
  [/AISI 304|SS304|304/gi, 'الفولاذ المقاوم للصدأ عالي التحمل'],
  [/AISI 316|SS316|316/gi, 'الفولاذ المقاوم للصدأ البحري'],
  [/EPDM/gi, 'مطاط هندسي عازل'],
  [/Dorma|Geze/gi, 'المعتمدة'],

  // Duplicate / Glitched words
  [/عالي الأمان عالي الأمان/g, 'عالي الأمان'],
  [/المجرى القياسي القياسي/g, 'المجرى المعماري القياسي'],
  [/المجرى الأوروبي المجري الأوروبي/g, 'المجرى المعماري'],
  [/المجرى الأوروبي/g, 'المجرى المعماري'],
  [/المقاوم للصدأ المقاوم للصدأ/g, 'المقاوم للصدأ'],
  [/الفولاذ المقاوم للصدأ الفولاذ المقاوم للصدأ/g, 'الفولاذ المقاوم للصدأ'],
  [/المعتمدة المعتمدة/g, 'المعتمدة'],
  [/المعمارية المعمارية/g, 'المعمارية'],
  [/الهندسية الهندسية/g, 'الهندسية'],
  [/المعتمدة عالية الدقة المعتمدة/g, 'المعتمدة عالية الدقة'],
  [/فائق فائق/g, 'فائق'],
  [/أحدث أحدث/g, 'أحدث'],
  [/Architectural Architectural/g, 'Architectural'],
  [/Heavy-Duty Hydraulic Heavy-Duty Hydraulic/g, 'Heavy-Duty Hydraulic'],
  [/المقاوم للصدأ5/g, '25'],

  // Country Flags
  [/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '']
];

function cleanString(text) {
  if (!text || typeof text !== 'string') return text;
  let s = text;
  for (const [re, rep] of REPLACEMENTS) {
    s = s.replace(re, rep);
  }
  return s.trim();
}

function cleanObjectDeep(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(cleanObjectDeep);
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      result[k] = cleanString(v);
    } else if (typeof v === 'object' && v !== null) {
      result[k] = cleanObjectDeep(v);
    } else {
      result[k] = v;
    }
  }
  return result;
}

// English title replacements for gallery items that have English titles
const ENGLISH_GALLERY_TITLE_MAP = {
  'Precision On-Site Installation by Certified Doorhome Technicians': 'فريق باب المنزل المتخصص أثناء عمليات القياس والتركيب الميداني المعتمد',
  'Walkable Structural Glass Roofs & Architectural Glass Floors': 'سقف وأرضيات سكاي لايت زجاجية إنشائية قابلة للمشي وتحمل الأوزان',
  'Commercial Panoramic Glass Entrance Systems': 'واجهات وأنظمة أبواب زجاجية بانورامية للمعارض والمقرات التجارية',
  'Structural Glass Balustrade for Luxury Villas': 'حواجز زجاجية إنشائية فاخرة للفلل والمساحات المفتوحة',
  'Minimalist Pivot Villa Entrance Door': 'باب مدخل فيلا محوري بتصميم ألمنيوم مينيماليست فاخر',
  'High-Performance Thermal Break Aluminum Windows': 'أنظمة نوافذ ألمنيوم معمارية عازلة للحرارة والصوت',
  'Corporate Showroom Panoramic Glass En': 'واجهات زجاجية بانورامية للمعارض والشركات التجارية',
  'Corporate Showroom Panoramic Glass Entrance Door': 'أبواب وواجهات زجاجية بانورامية للمعارض والشركات التجارية',
  'Modern Swimming Pool & Terrace Framel': 'حواجز زجاجية سيكوريت للتراسات وأحواض السباحة',
  'Modern Swimming Pool & Terrace Frameless Glass Balustrade': 'حواجز زجاجية سيكوريت للتراسات وأحواض السباحة',
  'Luxury Villa Lorenzo 70LS Lift & Slide Do': 'أبواب سحاب ورفع بانورامية عازلة للفلل والقصور',
  'Luxury Villa Lorenzo 70LS Lift & Slide Doors': 'أبواب سحاب ورفع بانورامية عازلة للفلل والقصور',
  'Architectural Minimalist Pivot Villa Entra': 'باب مدخل فيلا رئيسي محوري بتصميم ألمنيوم حديث',
  'Architectural Minimalist Pivot Villa Entrance Door': 'باب مدخل فيلا رئيسي محوري بتصميم ألمنيوم حديث',
  'High-Span Curtain Wall 50F Structural Gla': 'واجهات كيرتن وول زجاجية هيكلية شاهقة للمباني والفلل',
  'High-Span Curtain Wall 50F Structural Glass Facade': 'واجهات كيرتن وول زجاجية هيكلية شاهقة للمباني والفلل',
  'Cantilevered Tempered Glass Stairs & Fra': 'درج وسلالم زجاجية معلقة مع درابزين زجاجي بدون إطار',
  'Cantilevered Tempered Glass Stairs & Frameless Railings': 'درج وسلالم زجاجية معلقة مع درابزين زجاجي بدون إطار',
  'Deceuninck Legend 80 6-Chamber Acoust': 'نوافذ بي في سي عازلة متعددة الحجرات لعزل الصوت والحرارة',
  'Deceuninck Legend 80 6-Chamber Acoustic Windows': 'نوافذ بي في سي عازلة متعددة الحجرات لعزل الصوت والحرارة',
  'Heavy-Duty Lift & Slide Thermal Aluminu': 'أبواب ونوافذ رفع وسحب ألمنيوم للمساحات الواسعة',
  'Heavy-Duty Lift & Slide Thermal Aluminum Patio Doors': 'أبواب ونوافذ رفع وسحب ألمنيوم للمساحات الواسعة'
};

// 1. CLEAN PRODUCTS
console.log('1. Cleaning products...');
const productsFile = path.resolve('cms_products_db.json');
let products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
products = products.map(cleanObjectDeep);
fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));

// Build product map by filename
const productByFilename = new Map();
for (const p of products) {
  if (p.image) productByFilename.set(path.basename(p.image), p);
  if (p.fallbackImage) productByFilename.set(path.basename(p.fallbackImage), p);
}

// 2. CLEAN & UNIFY GALLERY
console.log('2. Cleaning and unifying gallery...');
const galleryFile = path.resolve('cms_gallery_db.json');
let gallery = JSON.parse(fs.readFileSync(galleryFile, 'utf8'));

gallery = gallery.map((item, idx) => {
  let cleaned = cleanObjectDeep(item);
  const filename = path.basename(cleaned.src || '');
  const matchedProd = productByFilename.get(filename);

  if (matchedProd) {
    // Unify with product catalog 1:1
    const arName = matchedProd.translations?.ar?.name || matchedProd.arabicName || matchedProd.name;
    const arDesc = matchedProd.translations?.ar?.description || matchedProd.arabicDescription || matchedProd.description;
    const enName = matchedProd.translations?.en?.name || matchedProd.name;
    const enDesc = matchedProd.translations?.en?.description || matchedProd.description;
    const ckbName = matchedProd.translations?.ckb?.name || matchedProd.kurdishName || arName;
    const ckbDesc = matchedProd.translations?.ckb?.description || matchedProd.kurdishDescription || arDesc;

    cleaned.title = cleanString(arName);
    cleaned.description = cleanString(arDesc);
    cleaned.system = 'نظام معماري معتمد';
    cleaned.translations = {
      ar: { title: cleanString(arName), description: cleanString(arDesc) },
      en: { title: cleanString(enName), description: cleanString(enDesc) },
      ckb: { title: cleanString(ckbName), description: cleanString(ckbDesc) }
    };
  } else {
    // Media not in products catalog (skylights, site installations, custom projects)
    let arTitle = cleaned.translations?.ar?.title || cleaned.title || '';
    let arDesc = cleaned.translations?.ar?.description || cleaned.description || '';

    // Check if title is in English
    for (const [enPrefix, arReplace] of Object.entries(ENGLISH_GALLERY_TITLE_MAP)) {
      if (arTitle.toLowerCase().includes(enPrefix.toLowerCase()) || (cleaned.title && cleaned.title.toLowerCase().includes(enPrefix.toLowerCase()))) {
        arTitle = arReplace;
        break;
      }
    }

    if (/^[A-Za-z]/.test(arTitle)) {
      arTitle = `مشروع معماري معتمد #${idx + 1}`;
    }
    if (/^[A-Za-z]/.test(arDesc) || !arDesc.trim()) {
      arDesc = 'تنفيذ معماري متكامل بإشراف فريق عمل شركة باب المنزل الهندسي المتخصص بأعلى معايير الدقة والجودة.';
    }

    arTitle = cleanString(arTitle);
    arDesc = cleanString(arDesc);

    cleaned.title = arTitle;
    cleaned.description = arDesc;
    cleaned.system = 'نظام معماري معتمد';
    cleaned.translations = {
      ...(cleaned.translations || {}),
      ar: { title: arTitle, description: arDesc },
      ckb: cleaned.translations?.ckb || { title: arTitle, description: arDesc }
    };
  }

  return cleaned;
});

fs.writeFileSync(galleryFile, JSON.stringify(gallery, null, 2));

// 3. CLEAN & UNIFY HOMEPAGE SECTION SLIDES
console.log('3. Cleaning homepage section slides...');
const slidesFile = path.resolve('cms_homepage_section_slides_db.json');
let slides = JSON.parse(fs.readFileSync(slidesFile, 'utf8'));

slides = slides.map((slide) => {
  let cleaned = cleanObjectDeep(slide);
  const filename = path.basename(cleaned.image || '');
  const matchedProd = productByFilename.get(filename);

  if (matchedProd) {
    const arName = matchedProd.translations?.ar?.name || matchedProd.arabicName || matchedProd.name;
    const arDesc = matchedProd.translations?.ar?.description || matchedProd.arabicDescription || matchedProd.description;
    cleaned.name = cleanString(arName);
    cleaned.arabicName = cleanString(arName);
    cleaned.description = cleanString(arDesc);
    cleaned.arabicDescription = cleanString(arDesc);
    cleaned.translations = {
      ...(cleaned.translations || {}),
      ar: {
        name: cleanString(arName),
        title: cleanString(arName),
        description: cleanString(arDesc)
      }
    };
  }
  return cleaned;
});

fs.writeFileSync(slidesFile, JSON.stringify(slides, null, 2));

// 4. CLEAN ARCH SHOWCASE
console.log('4. Cleaning arch showcase...');
const archShowcaseFile = path.resolve('cms_arch_showcase_db.json');
let archShowcase = JSON.parse(fs.readFileSync(archShowcaseFile, 'utf8'));
archShowcase = archShowcase.map((item) => {
  const cleaned = cleanObjectDeep(item);
  if (cleaned.id.includes('المقاوم للصدأ')) {
    cleaned.id = 'wiek-limiting-hinge-w25';
  }
  if (cleaned.id.includes('المعتمدة-minimalist')) {
    cleaned.id = 'minimalist-handle-delta';
  }
  cleaned.titleAr = cleanString(cleaned.titleAr);
  cleaned.descriptionAr = cleanString(cleaned.descriptionAr);
  return cleaned;
});

// Explicitly set Card #1
if (archShowcase[0]) {
  archShowcase[0].id = 'wiek-limiting-hinge-w25';
  archShowcase[0].title = 'WIEK LIMITING HINGE SERIES (W25)';
  archShowcase[0].titleAr = 'سلسلة مفصلات تحديد الفتح الهندسية المعتمدة';
  archShowcase[0].description = 'Extensible and adjustable limiting hinge set for projected architectural windows with precision sash positioning.';
  archShowcase[0].descriptionAr = 'طقم مفصلات تحديد الفتح القابلة للتمديد والضبط للنوافذ القلابة والمعمارية البارزة للخارج، متوافقة مع قطاعات المجرى المعماري القياسي، مصنعة من الفولاذ المقاوم للصدأ عالي التحمل وتتيح ضبط زاوية الفتح بدقة.';
  archShowcase[0].buttonTextAr = 'معاينة المخطط الفني بالكتالوج';
}

fs.writeFileSync(archShowcaseFile, JSON.stringify(archShowcase, null, 2));

// 5. DO NOT TOUCH PARTNER LOGOS (User specifically requested partner logos preserved as-is)

// 6. UPDATE SEED FILES
console.log('6. Updating seed files...');

// galleryData.ts
const gallerySeedContent = `import { GalleryMediaItem } from '../services/galleryContentService';\n\nexport const MASTER_GALLERY_ITEMS: GalleryMediaItem[] = ${JSON.stringify(gallery, null, 2)};\n`;
fs.writeFileSync(path.resolve('src/data/galleryData.ts'), gallerySeedContent, 'utf8');

// productionProductsSeed.ts
const productsSeedContent = `import { ProductItem } from './winhomeData';\n\nexport const PRODUCTION_PRODUCTS_SEED: ProductItem[] = ${JSON.stringify(products, null, 2)};\n`;
fs.writeFileSync(path.resolve('src/data/productionProductsSeed.ts'), productsSeedContent, 'utf8');

// homepageSectionItemsSeed.ts
const slidesSeedContent = `import { ProductItem } from './winhomeData';\n\nexport const HOMEPAGE_SECTION_ITEMS_SEED: ProductItem[] = ${JSON.stringify(slides, null, 2)};\n`;
fs.writeFileSync(path.resolve('src/data/homepageSectionItemsSeed.ts'), slidesSeedContent, 'utf8');

console.log('✅ All data files and seed files cleaned and synchronized successfully.');
