const fs = require('fs');
const path = require('path');

const galPath = path.resolve(__dirname, '../cms_gallery_db.json');
const gal = JSON.parse(fs.readFileSync(galPath, 'utf8'));

for (const it of gal) {
  const src = it.src || '';

  // 1. Fix photo_11 (Balcony glass balustrade mistaken for villa gate)
  if (src.includes('photo_11') || it.id === 'proj-photo-11') {
    it.title = 'درابزين وحواجز شرفات زجاجية معمارية للفلل الحديثة';
    it.description = 'تركيب ميداني متقن لحواجز وشرفات زجاجية معمارية بقوائم ألمنيوم متينة وألواح زجاج مقوى يوفر حماية كاملة وإطلالة نقية مفتوحة على الحديقة والمحيط الخارجي.';
    it.category = 'shorfa';
    it.translations = {
      ar: { title: it.title, description: it.description },
      en: { title: 'Architectural Glass Balcony & Terrace Railing Installation', description: 'Precision on-site installation of heavy architectural glass balustrades with durable aluminum posts for luxury residential villas.' },
      ckb: { title: 'حاجزی شووشەیی بۆ باڵکۆنی ڤێلای مۆدێرن', description: 'دانانی دەربزینی شووشەیی پارێزراو بۆ باڵکۆن و تەراس بە ئەلەمنیۆمی قایم و دیمەنی کراوە.' }
    };
  }

  // 2. Fix commercial promo video (12c6d25c) mistaken for a single door product
  if (src.includes('12c6d25c') || it.id === 'proj-photo-4') {
    it.title = 'فيديو تعريفي لأنظمة وحلول النوافذ والواجهات المعمارية المتكاملة';
    it.description = 'استعراض شامل لأحدث حلول وأنظمة النوافذ والواجهات الزجاجية المعمارية العازلة، التي تجمع بين دقة الهندسة وحرية التصميم لتناسب الفلل والمشاريع السكنية والتجارية.';
    it.category = 'windows';
    it.translations = {
      ar: { title: it.title, description: it.description },
      en: { title: 'Comprehensive Architectural Window & Facade Systems Overview Video', description: 'Comprehensive video showcasing advanced insulated architectural window and facade systems engineered for luxury villas and commercial developments.' },
      ckb: { title: 'ڤیدیۆی ناساندنی گشتیی سیستەمەکانی پەنجەرە و ڕووکاری نژیاروانی', description: 'پیشاندانی ڤیدیۆیی بەرفراوان بۆ باشترین چارەسەرەکانی پەنجەرە و ڕووکاری شووشەیی عازل بۆ بینا و ڤێلا مۆدێرنەکان.' }
    };
  }

  // 3. Ensure any balcony/shorfa asset is never titled door/gate
  if (src.includes('/balconies/') || src.includes('/shorfa/')) {
    it.category = 'shorfa';
    if (it.title.includes('باب') || it.title.includes('بوابة') || it.title.includes('لوفر')) {
      it.title = 'حواجز وشرفات زجاجية فاخرة بتصميم معماري عصري';
      it.description = 'تنفيذ درابزين وحواجز زجاجية عالية الأمان للشرفات والتراسات تمنح المبنى مظهراً حديثاً وتوفر حماية تامة.';
      if (it.translations?.ar) {
        it.translations.ar.title = it.title;
        it.translations.ar.description = it.description;
      }
    }
  }

  // 4. Ensure any stair asset is titled stairs
  if (src.includes('/stairs/')) {
    it.category = 'stairs';
    if (it.title.includes('باب') || it.title.includes('بوابة')) {
      it.title = 'درابزين وحواجز سلالم زجاجية سيكوريت للتصميم الداخلي';
      it.description = 'درابزين زجاجي أنيق للسلالم والدرج الداخلي، يجمع بين الأمان الهندسي المتين واللمسة العصرية الشفافة.';
      if (it.translations?.ar) {
        it.translations.ar.title = it.title;
        it.translations.ar.description = it.description;
      }
    }
  }
}

fs.writeFileSync(galPath, JSON.stringify(gal, null, 2), 'utf8');
console.log('✓ Successfully fixed mismatched project titles and descriptions!');
