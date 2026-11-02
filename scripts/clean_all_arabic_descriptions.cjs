const fs = require('fs');
const path = require('path');

function sanitizeArabic(text) {
  if (!text || typeof text !== 'string') return text;
  let s = text;

  // 1. Remove any mentions of argon gas or gases
  s = s.replace(/ومملوء بغاز الآرغون/g, '');
  s = s.replace(/مملوء بغاز الآرغون/g, '');
  s = s.replace(/بغاز الآرغون/g, '');
  s = s.replace(/غاز الآرغون/g, '');
  s = s.replace(/غاز/g, '');

  // 2. Remove English technical jargon in parentheses
  s = s.replace(/\s*\(\s*Guillotine Glass\s*\)/gi, '');
  s = s.replace(/\s*\(\s*Lift & Slide\s*\)/gi, '');
  s = s.replace(/\s*\(\s*Slim Frame\s*\)/gi, '');
  s = s.replace(/\s*\(\s*Thermal Break\s*\)/gi, '');
  s = s.replace(/\s*\(\s*3-Layer Laminated Glass\s*\)/gi, '');
  s = s.replace(/\s*\(\s*Laminated Glass\s*\)/gi, '');
  s = s.replace(/\s*\(\s*Curtain Wall 50F\s*\)/gi, '');
  s = s.replace(/\s*\(\s*Pivot Door\s*\)/gi, '');
  s = s.replace(/\s*\(\s*Zip Screen\s*\)/gi, '');
  s = s.replace(/\s*\(\s*Legend 80\s*\)/gi, '');
  s = s.replace(/\s*\(\s*Low-E\s*\)/gi, '');

  // 3. Replace acronyms and technical names with pure Arabic terms
  s = s.replace(/EPDM الألمانية/g, 'الألمانية');
  s = s.replace(/EPDM/g, 'المطاطية المعتمدة');
  s = s.replace(/SS304/g, 'المقاوم للصدأ');
  s = s.replace(/SS316/g, 'المقاوم للمياه والأملاح');
  s = s.replace(/لورينزو 70LS الإيطالي/g, 'الألمنيوم العازل');
  s = s.replace(/لورينزو 70LS/g, 'الألمنيوم العازل');
  s = s.replace(/50F/g, '');
  s = s.replace(/Legend 80/g, 'المتطور');

  // 4. Remove any remaining Latin words inside parentheses or standalone
  s = s.replace(/\([a-zA-Z0-9\s&/-]+\)/g, '');
  s = s.replace(/[a-zA-Z]+/g, '');

  // 5. Clean up awkward spaces and punctuation
  s = s.replace(/\s{2,}/g, ' ');
  s = s.replace(/\s+([،.])/g, '$1');
  s = s.replace(/،\s*،/g, '،');
  s = s.replace(/مع مع/g, 'مع');
  s = s.replace(/دبل معزول/g, 'مزدوج معزول');
  s = s.replace(/دبل/g, 'مزدوج');
  s = s.trim();

  return s;
}

// Clean cms_homepage_section_slides_db.json
const slidesPath = path.resolve(__dirname, '../cms_homepage_section_slides_db.json');
if (fs.existsSync(slidesPath)) {
  const slides = JSON.parse(fs.readFileSync(slidesPath, 'utf8'));
  for (const s of slides) {
    // Specific fix for slide prod-1793104501054
    if (s.id === 'prod-1793104501054') {
      const fixedDesc = 'استمتع بإطلالة بانورامية مفتوحة وإضاءة طبيعية تغمر المكان مع نظام النوافذ والواجهات الزجاجية الممتدة بإطارات نحيفة وعزل حراري متكامل. يمنحك ارتباطاً بصرياً ساحراً مع المساحات الخارجية، مع عزل حراري ومائي متكامل وزجاج مزدوج معزول لتوفير أعلى كفاءة طاقة وهدوء منزلي تام.';
      s.description = fixedDesc;
      s.arabicDescription = fixedDesc;
      if (s.translations?.ar) {
        s.translations.ar.description = fixedDesc;
      }
    } else {
      if (s.name) s.name = sanitizeArabic(s.name);
      if (s.arabicName) s.arabicName = sanitizeArabic(s.arabicName);
      if (s.description) s.description = sanitizeArabic(s.description);
      if (s.arabicDescription) s.arabicDescription = sanitizeArabic(s.arabicDescription);
      if (s.translations?.ar) {
        if (s.translations.ar.name) s.translations.ar.name = sanitizeArabic(s.translations.ar.name);
        if (s.translations.ar.title) s.translations.ar.title = sanitizeArabic(s.translations.ar.title);
        if (s.translations.ar.description) s.translations.ar.description = sanitizeArabic(s.translations.ar.description);
      }
    }
  }
  fs.writeFileSync(slidesPath, JSON.stringify(slides, null, 2), 'utf8');
  console.log('✓ Cleaned cms_homepage_section_slides_db.json');
}

// Clean cms_gallery_db.json
const galPath = path.resolve(__dirname, '../cms_gallery_db.json');
if (fs.existsSync(galPath)) {
  const gal = JSON.parse(fs.readFileSync(galPath, 'utf8'));
  for (const it of gal) {
    if (it.title) it.title = sanitizeArabic(it.title);
    if (it.description) it.description = sanitizeArabic(it.description);
    if (it.translations?.ar) {
      if (it.translations.ar.title) it.translations.ar.title = sanitizeArabic(it.translations.ar.title);
      if (it.translations.ar.description) it.translations.ar.description = sanitizeArabic(it.translations.ar.description);
    }
  }
  fs.writeFileSync(galPath, JSON.stringify(gal, null, 2), 'utf8');
  console.log('✓ Cleaned cms_gallery_db.json');
}
