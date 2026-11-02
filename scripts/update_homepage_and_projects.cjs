const fs = require('fs');
const path = require('path');

// 1. UPDATE HOMEPAGE SECTION SLIDES
const slidesPath = path.resolve(__dirname, '../cms_homepage_section_slides_db.json');
if (fs.existsSync(slidesPath)) {
  const slides = JSON.parse(fs.readFileSync(slidesPath, 'utf8'));

  const SLIDE_UPDATES = {
    'prod-1793179501744': {
      arName: 'نظام النوافذ والواجهات الزجاجية البانورامية المتحركة (المقصلة الأوتوماتيكية)',
      arDesc: 'ارتقِ بمساحتك الخارجية إلى أفق جديد من الفخامة والعملية مع نظام النوافذ والواجهات الزجاجية البانورامية الأوتوماتيكية (Guillotine Glass). يتميز بفتحات زجاجية واسعة تتحرك رأسياً بسلاسة وهدوء بلمسة زر عبر محركات أوروبية صامتة، ليوفر حماية متكاملة من الرياح والغبار والأمطار مع عزل حراري استثنائي وإطلالة بانورامية مفتوحة.',
      enName: 'Automated Guillotine Panoramic Glass & Window System for Restaurants & Terraces',
      enDesc: 'Elevate your outdoor space with our automated vertical guillotine glass system. Operates smoothly with silent European motors, offering complete weather and dust protection with panoramic vistas.',
      ckbName: 'سیستەمی پەنجەرە و ڕووکاری شووشەیی پانۆرامای جووڵاو (گیۆتینی ئۆتۆماتیکی)',
      ckbDesc: 'پێشکەوتووترین سیستەمی شووشەی جووڵاوی ستوونی بۆ باڵکۆن، چێشتخانە و هۆڵەکان، بە کارکردنی ئۆتۆماتیکی بێدەنگ و پارێزگاری تەواو لە با و سەرما و تۆز.'
    },
    'prod-1793119550776': {
      arName: 'حاجز سلم زجاجي فاخر بدون إطار مع مثبتات أرضية مخفية',
      arDesc: 'تصميم معماري عصري يضفي انشراحاً وفخامة استثنائية على السلالم والدرج الرخامي الداخلي، باستخدام زجاج سيكوريت مقوى متعدد الطبقات مع مثبتات مخفية ومقبض علوي انسيابي مريح ومقاوم للاهتزاز.',
      enName: 'Frameless Luxury Glass Stair Balustrade with Concealed Floor Anchors',
      enDesc: 'Modern architectural stair balustrade featuring heavy-duty laminated tempered glass and concealed anchor systems for maximum interior elegance.',
      ckbName: 'دەربزینی شووشەیی بێ چوارچێوە بۆ قادرمە بە جێگیرکەری شاراوە',
      ckbDesc: 'دیزاینێکی مۆدێرن و سەرنجڕاکێش بە بەکارهێنانی شووشەی سکۆریتی فرە چین بە جێگیرکەری شاراوە لەسەر قادرمەی مەڕمەڕ.'
    },
    'prod-1793119531579': {
      arName: 'حاجز سلم زجاجي معلق بتصميم معماري فائق الشفافية للفلل الحديثة',
      arDesc: 'يمنح السلم الداخلي المعلق مظهراً هندسياً خفيفاً يعزز الإضاءة الطبيعية وانسيابية المساحة، مصنع بأعلى معايير الأمان مع زجاج سيكوريت مصفح ضد الصدمات وإكسسوارات ستانلس ستيل SS304.',
      enName: 'Floating Glass Stair Railing for Contemporary Luxury Villas',
      enDesc: 'Enhances suspended staircase architecture with maximum natural light transmission and impact-resistant tempered laminated glass.',
      ckbName: 'حاجزی شووشەیی هەڵواسراو بۆ قادرمەی مۆدێرن',
      ckbDesc: 'دیمەنێکی ئەندازیاری سووک و بێهاوتا دەبەخشێتە قادرمەی ناوەوە بە ڕێژەی بەرزی ڕووناکی و شووشەی پارێزراو.'
    },
    'prod-1793119525109': {
      arName: 'درابزين وحاجز درج زجاجي بانورامي بنظام تثبيت جانبي عصري',
      arDesc: 'يثبت على جانب الدرج لتوفير أقصى اتساع ممكن للممر، مع زجاج مقوى ومقاوم للاهتزازات، يجمع بين الأمان الهندسي المعتمد واللمسة المعمارية الفاخرة المفتوحة على الصالة الرئيسية.',
      enName: 'Side-Mounted Panoramic Glass Stair Railing System',
      enDesc: 'Mounted directly to the stair edge to maximize usable corridor width while delivering certified impact safety and open-concept luxury.',
      ckbName: 'دەربزینی شووشەیی پانۆراما بە بەستنی تەنیشتی',
      ckbDesc: 'بەستراو لە تەنیشتی قادرمە بۆ بەدەستهێنانی زۆرترین پانتایی هاتوچۆ و دیمەنی کراوەی سەرنجڕاکێش.'
    },
    'prod-1793119509247': {
      arName: 'نظام حواجز الشرفات والتراسات الزجاجية المعزولة للفلل والمباني الفاخرة',
      arDesc: 'حواجز زجاجية متطورة للشرفات الخارجية والأسطح، تمنحك إطلالة بانورامية نقية دون حواجز بصرية، مع قدرة فائقة على تحمل ضغط الرياح العاتية ومقاومة الصدأ والعوامل الجوية بمظهر أسود فخم.',
      enName: 'High-Load Glass Balcony & Terrace Railing System for Luxury Villas',
      enDesc: 'Engineered structural glass balustrades built to withstand high wind loads and harsh weather with a refined architectural aesthetic.',
      ckbName: 'سیستەمی حەجزی شووشەیی بەهێز بۆ باڵکۆن و تەراس',
      ckbDesc: 'سیستەمێکی پێشکەوتوو بە بەرگری بەرز بەرامبەر پەستانی با و بارودۆخی کەشوهەوا بە دیمەنێکی پانۆرامای ڕوون.'
    },
    'prod-1793119488236': {
      arName: 'حاجز شرفة وميزانين داخلي بزجاج مظلل أنيق وقطاعات ألمنيوم معمارية',
      arDesc: 'يضفي فخامة هادئة على الطوابق العلوية والصالات المفتوحة، مع زجاج مظلل يوفر الخصوصية والانعكاس الجمالي، مدعوم بهيكل ألمنيوم أسود مطفي عالي الجودة ومقبض خشبي دافئ.',
      enName: 'Interior Mezzanine Tinted Glass Balustrade with Warm Handrail',
      enDesc: 'Offers sophisticated acoustic buffer and visual privacy for upper-level galleries and open floor living spaces.',
      ckbName: 'دەربزینی شووشەیی تاریککراو بۆ باڵکۆنی ناوەوە و نهۆمی دووەم',
      ckbDesc: 'فەخامەتێکی ئارام بە نهۆمی سەرەوە دەبەخشێت بە شووشەی ڕەنگدار بۆ پاراستنی تایبەتمەندی و دەستەوانەی شیک.'
    },
    'prod-1793119479189': {
      arName: 'حاجز شرفة وتراس خارجي بزجاج إنشائي مقوى بدون أعمدة ظاهرة',
      arDesc: 'نظام تثبيت أرضي غاطس يوفر شرفة زجاجية متصلة بالكامل بدون أي قواطع أو أعمدة مرئية، مثالي للواجهات الحجرية والرخامية المودرن مع إحكام عالي للأمان والسلامة.',
      enName: 'Continuous Base-Shoe Frameless Glass Balcony System',
      enDesc: 'Recessed floor base channel supporting clean continuous glass panes for modern stone and architectural facades.',
      ckbName: 'حاجزی شووشەیی دەرەکی بێ کۆڵەکە بۆ ڕووکاری مۆدێرن',
      ckbDesc: 'جێگیرکردنی ژێرخاک بە شێوازێکی تەواو پێشکەوتوو بۆ پێدانی دیمەنێکی یەکپارچە بەبێ هیچ بەربەستێک.'
    },
    'prod-1793119470599': {
      arName: 'حاجز شرفة وتراس زجاجي شفاف بقاعدة ألمنيوم متينة وأعمدة كلاسيكية',
      arDesc: 'حماية متكاملة للشرفات والمداخل الخارجية، مصمم بألواح زجاجية مزدوجة معالجة حرارياً، لتحقيق أعلى مستويات الأمان ومقاومة الصدمات مع ثبات هيكلي ممتاز.',
      enName: 'Heavy-Duty Glass Balcony Railing with Robust Aluminum Posts',
      enDesc: 'Combining classic strength with transparent modern design for entrance terraces and outdoor balconies.',
      ckbName: 'حاجزی شووشەیی شیک بە کۆڵەکەی ئەلەمنیۆمی قایم',
      ckbDesc: 'پاراستنی تەواو بۆ باڵکۆن و دەروازەی دەرەوە بە شووشەی دوولایەنەی پتەو و پەیکەری ئەلەمنیۆم.'
    },
    'acc-1793104571391': {
      arName: 'آلية وقفل أبواب داخلي متعدد النقاط من الستانلس ستيل المقاوم للصدأ',
      arDesc: 'قلب قفل ألماني احترافي معتمد يوفر أعلى درجات الأمان ومقاومة الاقتحام، مصنع من الفولاذ المقاوم للصدأ SS304 لضمان عمل سلس وموثوق على مدار سنوات طويلة دون تآكل.',
      enName: 'Multi-Point High-Security Stainless Steel Door Lock Mechanism',
      enDesc: 'Precision-engineered German multi-point locking core offering certified burglary resistance and corrosion-free operation.',
      ckbName: 'قوفڵی ئاستبەرزی فرەخاڵی ئەڵمانی لە ستیلی دژە ژەنگ',
      ckbDesc: 'میکانیزمی پێشکەوتووی قوفڵی ئەڵمانی لە ستیلی SS304 بۆ بەرزترین ئاستی پاراستن و بەکارهێنانی نەرم.'
    },
    'acc-1793104548255': {
      arName: 'مقبض ألمنيوم معماري عصري للنوافذ والأبواب بطلاء أسود مطفي فاخر',
      arDesc: 'مقبض انسيابي بتصميم مريح وملمس فاخر، مطلي بتقنية الطلاء الكهروستاتيكي المضاد للبصمات والخدوش، متوافق مع كافة أنظمة السحاب والقلاب الأوروبية المعتمدة.',
      enName: 'Architectural Matte Black Ergonomic Window & Door Handle',
      enDesc: 'Modern ergonomic handle finished with electrostatic anti-scratch coating, compatible with European tilt-and-turn and sliding systems.',
      ckbName: 'دەسکەوانەی ئەلەمنیۆمی ڕەشی ماتی مۆدێرن بۆ پەنجەرە و دەرگا',
      ckbDesc: 'دیزاینێکی دەستی سەرنجڕاکێش بە بۆیەی کارۆستاتیکی دژە ڕووشان و گونجاو لەگەڵ هەموو سیستەمەکانی ئەوروپی.'
    },
    'prod-1793104501054': {
      arName: 'نظام نوافذ وواجهات زجاجية بانورامية سحاب بإطارات نحيفة وعزل حراري',
      arDesc: 'نظام سحاب متطور بتصميم إطار نحيف (Slim Frame) يمنحك أوسع زاوية رؤية بانورامية دون عوائق، مع عزل حراري ومائي متكامل وزجاج دبل معزول بغاز الآرغون لتوفير أعلى كفاءة طاقة وهدوء منزلي تام.',
      enName: 'Thermal-Break Slim-Frame Panoramic Sliding Window System',
      enDesc: 'Engineered slim profile sliding windows maximizing visual transparency with high thermal and acoustic performance.',
      ckbName: 'سیستەمی پەنجەرەی سلایدینگی چوارچێوە باریک بە عەزلی حەراری',
      ckbDesc: 'پەنجەرەی خلیسکێنەی پێشکەوتوو بە چوارچێوەی باریک بۆ بەدەستهێنانی گەورەترین دیمەن لەگەڵ عەزلی گەرمی و دەنگ.'
    },
    'prod-1793104451707': {
      arName: 'نوافذ وأبواب رفع وسحب عازلة (Lift & Slide) للمساحات الواسعة',
      arDesc: 'نظام الرفع والسحب الألماني الرائد للفتحات الكبيرة، يتيح فتح الألواح الزجاجية الضخمة بلمسة يد خفيفة، مع إحكام كامل ضد مياه الأمطار والرياح والغبار بفضل آليات القفل الهوائي المتطورة.',
      enName: 'Heavy-Duty Lift & Slide Thermal Aluminum Patio Doors',
      enDesc: 'Effortless sliding operation for oversized glass panels with perimeter pneumatic sealing against storm winds and dust.',
      ckbName: 'دەرگا و پەنجەرەی بەرزکەرەوە و سلایدینگ (Lift & Slide) بۆ پانتایی گەورە',
      ckbDesc: 'سیستەمی پێشەنگی ئەڵمانی بۆ دەرگا گەورەکان، جووڵەی نەرم بە دەستلێدانی سووک و عەزلی تەواو لە با و باران.'
    },
    'prod-1793104349609': {
      arName: 'نظام الواجهات الزجاجية الهيكلية (كرتن وول) وسكاي لايت أوتوماتيكي',
      arDesc: 'واجهات زجاجية معمارية مستمرة للفلل والمباني والشركات، توفر إضاءة طبيعية شاملة وعزلاً صوتياً فائقاً مع زجاج ثلاثي الطبقات ومقاومة للأحمال الهيكلية والطقس القاسي.',
      enName: 'Structural Curtain Wall & Automated Roof Skylight Facade System',
      enDesc: 'Continuous facade glazing delivering abundant natural daylight, superior sound reduction, and triple-glaze thermal barriers.',
      ckbName: 'سیستەمی ڕووکاری پەردەی شووشەیی (کەرتن وۆڵ) و سکای لایت',
      ckbDesc: 'ڕووکاری شووشەیی بەردەوام بۆ بینا و ڤێلاکانی سەردەم بە شووشەی سێ قاتی عازل و بەرگری بێهاوتا.'
    },
    'prod-1793104209359': {
      arName: 'نظام قواطع وأبواب زجاجية داخلية (بارتشن) للمكاتب والشركات والمنازل',
      arDesc: 'نظام قواطع زجاجية ذكية للمكاتب والشركات والمنازل الحديثة، مع زجاج سيكوريت عالي الأمان بسماكة 10 ملم أو زجاج دبل معزول، مزود بخطوط مصنفرة أنيقة وإكسسوارات ومفصلات ومقابض ألمانية معتمدة لتوفير عزل صوتي ممتاز وخصوصية راقية.',
      enName: 'Glass Partition & Door System for Offices, Companies and Modern Homes',
      enDesc: 'Smart architectural partition system featuring 10mm tempered security glass or double glazed soundproof panels, frosted privacy stripes, and certified German hardware.',
      ckbName: 'سیستەمی بەربەست و دەرگای شووشەیی (پارتیشن) بۆ ئۆفیس و کۆمپانیا',
      ckbDesc: 'سیستەمی پارتیشنی شووشەیی زیرەک بۆ ئۆفیس، کۆمپانیا و ماڵەکان بە شووشەی ۱۰ ملمی سکۆریت، هێڵی شوشەیی جوان، و ئێکسسواراتی ئەڵمانی.'
    },
    'prod-1793104191840': {
      arName: 'بوابة وباب فيلا خارجي فاخر بتصميم هندسي مدمج وعزل حراري',
      arDesc: 'أبواب وبوابات فلل ومنازل رئيسية مصنوعة من قطاعات ألمنيوم سميكة معالجة بأعلى المعايير، مقاومة للشمس والعوامل الجوية القاسية في العراق، مزودة بأقفال أمان إلكترونية متعددة النقاط وإكسسوارات أوروبية متينة.',
      enName: 'Architectural Geometric Aluminum Villa Entrance Gate & Door',
      enDesc: 'Engineered heavy-gauge aluminum entrance door with multi-point smart security locks built to withstand the harshest Iraqi summer climate.',
      ckbName: 'دەروازە و دەرگای دەرەوەی ڤێلا بە ئەلەمنیۆمی ئەندازیاری بەهێز',
      ckbDesc: 'دەرگای سەرەکی و دەروازەی ڤێلا لە ئەلەمنیۆمی ئەستووری عەزلکراو، بەرگری بەرامبەر گەرمای توند و قوفڵی فرەخاڵی ئەلکترۆنی.'
    },
    'prod-1793104176513': {
      arName: 'باب مدخل رئيسي فاخر يدمج بين خشب التيك المعالج والألمنيوم المعماري',
      arDesc: 'تصميم عصري فخم للمداخل الرئيسية للفلل والقصور والشركات، يجمع بين دفء الخشب المعماري المقاوم للرطوبة والحرارة وهيكل الألمنيوم الأسود المتين مع مفصلات محورية ألمانية مخفية.',
      enName: 'Luxury Teak Wood & Architectural Aluminum Hybrid Entrance Door',
      enDesc: 'Contemporary entrance statement blending weather-treated architectural teak with structural matte black aluminum frames and concealed pivot hinges.',
      ckbName: 'دەرگای سەرەکی شاهانە بە تێکەڵەی داری تیک و ئەلەمنیۆمی تەلارسازی',
      ckbDesc: 'دیزاینێکی شیک بۆ دەروازەی ڤێلا کە جوانی داری سروشتی چارەسەرکراو و ئەلەمنیۆمی قایمی ڕەش تێکەڵ دەکات بە لولای پیڤۆت.'
    },
    'prod-1793104157630': {
      arName: 'باب وبوابة خارجية بشرائح ألمنيوم طولية حديثة مع عزل وحماية متكاملة',
      arDesc: 'تصميم معماري متناسق للأسوار ومداخل الفلل والشركات، يوفر أقصى درجات الخصوصية والأمان مع انسيابية تدفق الهواء، مطلي بطلاء حراري كهرستاتيكي مقاوم للخدوش والتآكل.',
      enName: 'Modern Vertical Slat Aluminum Security Entrance Gate',
      enDesc: 'Architectural privacy perimeter gate featuring vertical linear louvers, electrostatically coated against dust, UV rays, and corrosion.',
      ckbName: 'دەروازەی دەرەکی بە پەڕەی ستوونی ئەلەمنیۆم بۆ پاراستن و ڕازاوەیی',
      ckbDesc: 'دیزاینێکی جوان بۆ حەوشە و دەروازەی ڤێلا کە تایبەتمەندی و ئاسایش دەبەخشێت بە بۆیەی گەرمی دژە ژەنگ.'
    },
    'prod-1793100169454': {
      arName: 'باب فيلا محوري فاخر (Pivot Door) بتصميم ألمنيوم مودرن ضخم',
      arDesc: 'أبواب محورية عصرية ضخمة للمداخل الرئيسية، تدور بسلاسة فائقة بفضل مفصلات بيفوت أوروبية تتحمل حتى 500 كغم، مع عوازل حرارية ومائية مدمجة وأقفال ذكية ببصمة الإصبع ورمز سري.',
      enName: 'Monumental Architectural Pivot Entrance Door with Smart Lock',
      enDesc: 'Grand pivot entrance system supporting panels up to 500kg with effortless rotation, advanced perimeter thermal isolation, and biometric biometric locking.',
      ckbName: 'دەرگای پیڤۆتی گەورەی ڤێلا بە سیستەمی لولای تەوەرەیی و قوفڵی زیرەک',
      ckbDesc: 'دەرگایەکی شاهانەی گەورەی دەوری بە لولای ئەوروپی کە بەرگەی ٥٠٠ کگم دەگرێت، بە عەزلی تەواوی گەرمی و ئاو و قوفڵی پەنجەمۆر.'
    }
  };

  const updatedSlides = slides.map(slide => {
    const update = SLIDE_UPDATES[slide.id];
    if (!update) return slide;
    return {
      ...slide,
      name: update.arName,
      arabicName: update.arName,
      description: update.arDesc,
      arabicDescription: update.arDesc,
      translations: {
        ar: { name: update.arName, title: update.arName, description: update.arDesc },
        en: { name: update.enName, title: update.enName, description: update.enDesc },
        ckb: { name: update.ckbName, title: update.ckbName, description: update.ckbDesc }
      }
    };
  });

  fs.writeFileSync(slidesPath, JSON.stringify(updatedSlides, null, 2), 'utf8');
  console.log('✓ Successfully updated cms_homepage_section_slides_db.json with all 18 customized slides!');
}

// 2. UPDATE GALLERY / PROJECTS
const galPath = path.resolve(__dirname, '../cms_gallery_db.json');
if (fs.existsSync(galPath)) {
  const gallery = JSON.parse(fs.readFileSync(galPath, 'utf8'));

  // Mapping of common patterns to natural, complete Arabic titles & descriptions
  const PATTERNS = [
    {
      match: (it) => it.id === 'gallery-proj-black-zip-screen-shutter' || it.title?.includes('Zip Screen'),
      arTitle: 'مشروع تظليل وحماية واجهة خارجية بستائر زيب سكرين المعزولة',
      arDesc: 'تنفيذ وتركيب متقن لنظام ستائر وشترات زيب سكرين الأوتوماتيكية لحماية الواجهات الخارجية من أشعة الشمس المباشرة والأتربة والرياح مع عزل حراري فائق وتشغيل هادئ بلمسة زر.',
      enTitle: 'Motorized Drop Zip-Screen Facade Solar Protection Project',
      enDesc: 'Turnkey exterior drop zip-screen project executed with precision by Doorhome engineers. Features automated flame-retardant mesh for thermal control and weather resistance.',
      ckbTitle: 'پڕۆژەی دانانی پەردەی زیپ سکرینی ئۆتۆماتیکی بۆ پاراستنی ڕووکاری دەرەوە',
      ckbDesc: 'دانانی سیستەمی زیپ سکرینی دەرەکی بە کۆنتڕۆڵ بۆ پاراستن لە خۆر و تۆز و گەرمی بە جووڵەی نەرم و بێدەنگ.'
    },
    {
      match: (it) => it.id === 'gallery-proj-polycarb-transparent-shutter' || it.title?.includes('Polycarbonate'),
      arTitle: 'مشروع تركيب شتر رول شفاف لكابينة وحديقة فيلا فاخرة',
      arDesc: 'تركيب شتر أمني شفاف من شرائح البولي كربونات المقاومة للكسر والصدمات، يمنح الجلسات الخارجية حماية كاملة من الأتربة والأمطار مع الحفاظ على الإطلالة البانورامية الشفافة.',
      enTitle: 'Transparent Polycarbonate Rolling Shutter Pavilion Project',
      enDesc: 'Custom installation featuring impact-resistant clear polycarbonate slats for luxury villas, providing weather insulation while retaining complete garden visibility.',
      ckbTitle: 'پڕۆژەی دانانی دەڕابەی شووشەیی شەفاف لە پۆلیکاربۆنات بۆ باخچە و ڤێلا',
      ckbDesc: 'دانانی دەڕابەی ئەمنیی شەفافی دژە شکاندن بۆ باڵکۆن و باخچەکان بە عەزلی باران و تۆز لەگەڵ بینینی کراوە.'
    },
    {
      match: (it) => it.id === 'proj-photo-1' || it.title?.includes('Precision On-Site'),
      arTitle: 'تركيب هندسي دقيق لأنظمة الألمنيوم والواجهات بأيدي مهندسي باب المنزل',
      arDesc: 'تنفيذ ميداني متقن لكافة فتحات الألمنيوم والواجهات الزجاجية بدقة مليمترية، مع ضبط التوازن وتطبيق عوازل EPDM الألمانية لضمان إحكام تام ضد الهواء والمياه وعزل درجات الحرارة العالية.',
      enTitle: 'Precision Architectural Installation by Certified Doorhome Engineers',
      enDesc: 'Meticulous on-site installation of high-span aluminum and glass systems with laser leveling, complete weatherproofing, and European hardware.',
      ckbTitle: 'دابەستنی ئەندازیاری وردی سیستەمەکانی ئەلەمنیۆم لەلایەن تیمی دەرگای ماڵ',
      ckbDesc: 'کارکردنی مەیدانیی ورد لەسەر جێگیرکردنی پەنجەرە و دەرگا گەورەکان بە بەرزترین تەکنەلۆجیای عەزلی هەوا و ئاو.'
    },
    {
      match: (it) => it.id === 'proj-photo-2' || it.title?.includes('Walkable Structural'),
      arTitle: 'أسقف زجاجية وسكاي لايت إنشائية قابلة للمشي للفلل والمباني الحديثة',
      arDesc: 'تصميم وتنفيذ أسقف وسكاي لايت زجاجية تتحمل الأوزان والمشي المباشر، مصنعة من زجاج سيكوريت مصفح متعدد الطبقات (Laminated Glass) مع عزل حراري تام وإضاءة طبيعية ساحرة.',
      enTitle: 'Walkable Structural Glass Roofs & Architectural Skylights',
      enDesc: 'Heavy-duty multi-layer tempered laminated glass ceilings engineered to support walking loads while flooding interiors with natural daylight.',
      ckbTitle: 'سەقفی شووشەیی ئەندازیاری بەهێز بۆ ڕۆیشتن و سکای لایت',
      ckbDesc: 'سەقفی شووشەیی فرە چینی زۆر بەهێز کە بەرگەی کێش دەگرێت و ڕۆشنایی سروشتی جوان دەبەخشێت بە ژوورەوە.'
    },
    {
      match: (it) => it.id === 'proj-photo-3' || it.title?.includes('Weatherproof Sealing'),
      arTitle: 'اختبارات العزل المائي والحراري الميدانية للأسقف والواجهات',
      arDesc: 'فحص هندسي شامل لجميع الفواصل والمفاصل والسكاي لايت تحت ضغط المياه المباشر، لضمان عدم حدوث أي تسريب طوال فصول السنة تحت أقصى الظروف المناخية في العراق.',
      enTitle: 'Rigorous Weatherproof Sealing & Field Testing',
      enDesc: 'Intensive on-site testing ensuring zero water leakage and complete thermal air-tightness under the harshest weather extremes.',
      ckbTitle: 'پشکنینی عەزلی ئاو و کەشوهەوای مەیدانی بۆ ڕووکار و سەقفەکان',
      ckbDesc: 'پشکنینی ورد لە ژێر پەستانی ئاودا بۆ دڵنیابوون لەوەی هیچ دزەکردنێک لە درێژایی ساڵدا ڕوونادات لە خراپترین کەشوهەوادا.'
    },
    {
      match: (it) => it.id === 'proj-photo-4' || it.title?.includes('Built for Iraqi Climate'),
      arTitle: 'أنظمة دور هوم المعمارية الفاخرة: مصممة خصيصاً لمناخ العراق الشديد',
      arDesc: 'دمج قطاعات الألمنيوم الأوروبية المعزولة حرارياً بكسر حراري (Thermal Break) مع زجاج دبل معالج ومملوء بغاز الآرغون لعكس 95% من حرارة الشمس الحارقة وتوفير استهلاك التكييف.',
      enTitle: 'Doorhome Architectural Systems: Engineered for Iraqi Climate Extremes',
      enDesc: 'Combining high-performance European thermal profiles with solar-reflective double glazing to withstand severe Iraqi summer heat and save energy.',
      ckbTitle: 'سیستەمە پێشکەوتووەکانی دەرگای ماڵ: تایبەت بە کەشوهەوای عێراق',
      ckbDesc: 'تێکەڵکردنی ئەلەمنیۆمی عازلی ئەوروپی لەگەڵ شووشەی دژە گەرمی بۆ کەمکردنەوەی گەرمای هاوین و کەمکردنەوەی خەرجی فێنککەرەوە.'
    },
    {
      match: (it) => it.id === 'proj-photo-5' || it.title?.includes('Care & Protection'),
      arTitle: 'عناية وحماية فائقة: فريق النقل واللوجستيات المعتمد من دور هوم',
      arDesc: 'أسطول سيارات مجهز بحوامل زجاجية مخصصة وعمالة مدربة لضمان وصول الألواح الزجاجية الضخمة وقطاعات الألمنيوم إلى موقع العمل بحالة مثالية دون أي خدوش.',
      enTitle: 'Specialized Transport & Logistics for Architectural Glass',
      enDesc: 'Dedicated vehicle fleet with specialized glass racks and trained handlers ensuring zero damage delivery to installation sites.',
      ckbTitle: 'گواستنەوەی پارێزراوی تیمی دەرگای ماڵ بۆ شووشە و ئەلەمنیۆم',
      ckbDesc: 'ئۆتۆمبێلی تایبەت بە هەڵگرتنی شووشەی گەورە و کارمەندی ڕاهێنراو بۆ گەیاندنی کەرەستەکان بەبێ هیچ خەوشێک.'
    },
    {
      match: (it) => it.id === 'proj-photo-6' || it.title?.includes('Pyramid Glass Skylights'),
      arTitle: 'سكاي لايت وأهرامات زجاجية معمارية لإضاءة طبيعية ساحرة للقصور والفلل',
      arDesc: 'تصاميم هرمية ودائرية مخصصة للأسقف الزجاجية، تحول الفراغات الداخلية إلى مساحات مضيئة ومفعمة بالحيوية مع عزل حراري ثلاثي يمنع دخول الحرارة المفرطة.',
      enTitle: 'Architectural Pyramid Glass Skylights & Custom Atriums',
      enDesc: 'Custom pyramid and lantern skylights engineered with solar control glass to flood luxury residences with daylight while blocking extreme heat.',
      ckbTitle: 'سکای لایتی هەرەمی و قوبەی شووشەیی بۆ کۆشک و ڤێلاکانی سەردەم',
      ckbDesc: 'دیزاینی هەرەمی سەرنجڕاکێش بۆ سەقف بە شووشەی عازل کە دیمەنێکی ڕۆشن بە ناو ماڵ دەبەخشێت بەبێ گەرمابوون.'
    },
    {
      match: (it) => it.id === 'proj-photo-7' || it.title?.includes('Modern Villa Facades'),
      arTitle: 'واجهات فلل عصرية فاخرة وشبابيك بانورامية عازلة بإطلالات مفتوحة',
      arDesc: 'تنفيذ متكامل لواجهات الفلل الحديثة بأنظمة سحاب ورفع عازلة، توفر إطلالة واسعة على الحدائق والمسابح مع هدوء تام وعزل كامل للضوضاء والغبار.',
      enTitle: 'Signature Modern Villa Facades & Panoramic Insulated Glazing',
      enDesc: 'Complete turnkey architectural fenestration for modern villas with heavy-duty lift-slide doors and panoramic picture windows.',
      ckbTitle: 'ڕووکاری ڤێلای مۆدێرن و پەنجەرەی پانۆرامای عازلی سەرنجڕاکێش',
      ckbDesc: 'جێبەجێکردنی ڕووکاری تەواوی ڤێلاکانی سەردەم بە پەنجەرەی گەورە و عەزلی دەنگ و گەرمی.'
    },
    {
      match: (it) => it.id === 'proj-photo-8' || it.title?.includes('Frameless Tempered Glass Stair'),
      arTitle: 'درابزين وحواجز سلالم زجاجية سيكوريت بدون إطار للتصميم الداخلي الحديث',
      arDesc: 'ألواح زجاجية مقواة سماكة 12 ملم أو 16 ملم مع مثبتات أرضية غاطسة، تمنح الصالات والسلالم الداخلية شعوراً بالاتساع والرحابة مع أمان هندسي معتمد.',
      enTitle: 'Frameless Tempered Glass Stair Balustrades & Railings',
      enDesc: 'Structural 12mm-16mm tempered safety glass with hidden shoe channels, creating open-concept stairways and balconies.',
      ckbTitle: 'حاجزی شووشەیی سکیوریتی بێ چوارچێوە بۆ قادرمەی ناوەوە',
      ckbDesc: 'شووشەی ئەستووری ۱۲ بۆ ۱٦ ملم بۆ قادرمە کە هەستی کراوەیی و فەخامەت بە ماڵ دەبەخشێت.'
    },
    {
      match: (it) => it.title?.includes('Corporate Showroom Panoramic') || it.title?.includes('المعارض'),
      arTitle: 'واجهات وأبواب زجاجية بانورامية لمعارض ومقرات الشركات والمكاتب الحديثة',
      arDesc: 'أنظمة واجهات زجاجية مستمرة وأبواب أوتوماتيكية وسحاب للمقرات التجارية والمعارض، تعكس هوية راقية وتوفر إضاءة طبيعية مع عزل صوتي وحراري متكامل.',
      enTitle: 'Commercial Showroom Panoramic Glass Facades & Smart Entrances',
      enDesc: 'Continuous structural glass storefronts and commercial entrance systems engineered for corporate showrooms and headquarters.',
      ckbTitle: 'ڕووکار و دەرگای شووشەیی پانۆراما بۆ پێشانگا و ئۆفیسی کۆمپانیاکان',
      ckbDesc: 'سیستەمی ڕووکاری شووشەی بەردەوام بۆ بارەگای کۆمپانیاکان بە دیمەنێکی پرۆفیشناڵ و عەزلی دەنگ.'
    },
    {
      match: (it) => it.title?.includes('Swimming Pool') || it.title?.includes('المساب'),
      arTitle: 'درابزين وحواجز زجاجية فاخرة بدون إطار للمسابح والتراسات والحدائق',
      arDesc: 'حواجز زجاجية مصفحة ضد الصدمات والرطوبة، توفر رؤية واضحة لحوض السباحة مع أمان عالي للأطفال وإكسسوارات ستانلس ستيل SS316 المقاوم للكلور والأملاح.',
      enTitle: 'Modern Swimming Pool & Terrace Frameless Glass Railings',
      enDesc: 'Impact-resistant laminated security glass fences offering uninterrupted pool views, child safety, and marine-grade SS316 hardware.',
      ckbTitle: 'حاجزی شووشەیی بێ چوارچێوە بۆ مەلەوانگە و باخچە و تەراس',
      ckbDesc: 'بەربەستی شووشەیی شەفاف و پتەو بۆ مەلەوانگە و دڵنیایی سەلامەتی منداڵان لەگەڵ ستینلێسی دژە ژەنگ.'
    },
    {
      match: (it) => it.title?.includes('Lorenzo 70LS') || it.title?.includes('لورينزو'),
      arTitle: 'أبواب سحاب بانورامية عازلة للحرارة والصوت بنظام لورينزو 70LS الإيطالي',
      arDesc: 'نظام سحاب ثقيل للمساحات الكبيرة والفتحات الواسعة في الفلل والقصور، يتميز بحركة انسيابية خفيفة وعوازل ثلاثية تضمن حماية متكاملة من الرياح والغبار.',
      enTitle: 'Lorenzo 70LS Heavy-Duty Panoramic Lift & Slide Thermal Doors',
      enDesc: 'Premium European lift & slide system for grand openings, providing whisper-quiet sliding, robust weather sealing, and expansive glass vistas.',
      ckbTitle: 'دەرگای سلایدینگی لۆرینزۆ 70LS ی بەهێز بۆ پانتاییە گەورەکان',
      ckbDesc: 'سیستەمی ئیتاڵی بەرز بۆ دەرگا گەورەکانی ڤێلا بە جووڵەی نەرم و عەزلی پەستانی با و گەرمی.'
    },
    {
      match: (it) => it.title?.includes('Minimalist Pivot') || it.title?.includes('محوري'),
      arTitle: 'باب فيلا رئيسي محوري فاخر بتصميم ألمنيوم مودرن وعوازل حرارية مدمجة',
      arDesc: 'أبواب مداخل رئيسية ضخمة تدور على محور مركزي بمفصلات هيدروليكية ألمانية، تجمع بين الهيبة المعمارية والأمان المتقدم مع أقفال إلكترونية ذكية.',
      enTitle: 'Architectural Minimalist Pivot Villa Entrance Door System',
      enDesc: 'Monumental pivot entry doors operating on concealed heavy-duty pivots, engineered with integrated thermal breaks and smart lock integration.',
      ckbTitle: 'دەرگای پیڤۆتی سەرەکیی ڤێلا بە ئەلەمنیۆمی مۆدێرن و عەزلی حەراری',
      ckbDesc: 'دەرگای سەرەکی گەورە لەسەر لولای دەوریی ئەڵمانی بە عەزلی گەرمی و قوفڵی زیرەکی پەنجەمۆر.'
    },
    {
      match: (it) => it.title?.includes('Curtain Wall 50F') || it.title?.includes('كيرتن وول') || it.title?.includes('كورتن'),
      arTitle: 'واجهات زجاجية هيكلية متصلة (كيرتن وول 50F) للمباني والفلل الحديثة',
      arDesc: 'نظام واجهات زجاجية كيرتن وول بعرض قطاع 50 ملم، يوفر إضاءة طبيعية وانسيابية معمارية مستمرة، مع زجاج مزدوج أو ثلاثي الطبقات عازل لأقسى درجات الحرارة.',
      enTitle: 'High-Span Curtain Wall 50F Structural Glass Facade',
      enDesc: 'Engineered 50mm mullion curtain wall facade system delivering expansive uninterrupted glazing, structural integrity, and acoustic comfort.',
      ckbTitle: 'ڕووکاری پەردەی شووشەیی (کەرتن وۆڵ 50F) بۆ بینا و ڤێلاکانی سەردەم',
      ckbDesc: 'سیستەمی کەرتن وۆڵی ٥٠ ملمی بەهێز بۆ پڕکردنەوەی ناو بینا بە ڕووناکی و عەزلی دەنگ و گەرمی.'
    },
    {
      match: (it) => it.title?.includes('Cantilevered Tempered') || it.title?.includes('معلقة'),
      arTitle: 'درج وسلالم زجاجية معلقة وحواجز سيكوريت فائقة الشفافية والأمان',
      arDesc: 'درجات وسلالم زجاجية إنشائية مصممة لتحمل الأوزان العالية، مع حواجز زجاجية بدون أعمدة، لتمنح الفيلا تصميماً داخلياً استثنائياً يبهر الضيوف.',
      enTitle: 'Cantilevered Tempered Glass Stairs & Structural Railings',
      enDesc: 'Floating glass stair treads and seamless glass guardrails engineered for high structural load capacities and architectural elegance.',
      ckbTitle: 'قادرمەی شووشەیی هەڵواسراوی زۆر بەهێز و دەربزینی سکیوریت',
      ckbDesc: 'پلیکانەی شووشەیی پتەو کە بەرگەی کێشی بەرز دەگرێت و فەخامەتێکی تایبەت بە ناوەوەی ڤێلا دەبەخشێت.'
    },
    {
      match: (it) => it.title?.includes('Legend 80') || it.title?.includes('بي في سي'),
      arTitle: 'شبابيك بي في سي عازلة للصوت والحرارة بست حجرات هوائية (Legend 80)',
      arDesc: 'نظام شبابيك uPVC ألماني بست حجرات عازلة مع زجاج دبل معزول، يوفر أقصى هدوء وانخفاض في فواتير الطاقة مع مقاومة تامة للرطوبة والأمطار والرياح.',
      enTitle: 'Legend 80 6-Chamber Acoustic & Thermal uPVC Window System',
      enDesc: 'Six-chamber high-insulation uPVC profile window system providing extreme noise cancellation, solar heat reflection, and zero maintenance.',
      ckbTitle: 'پەنجەرەی یو پی ڤی سی (uPVC) عازلی دەنگ و گەرمی بە ٦ ژوور',
      ckbDesc: 'سیستەمی پێشکەوتووی uPVC بە ٦ ژووری عازل بۆ بەدەستهێنانی بێدەنگی تەواو و کەمکردنەوەی خەرجی فێنککەرەوە.'
    },
    {
      match: (it) => it.title?.includes('Lift & Slide') || it.title?.includes('سحاب ثقيلة'),
      arTitle: 'أبواب سحاب ثقيلة بنظام الرفع والسحب للمساحات الكبيرة والمفتوحة',
      arDesc: 'أبواب ألمنيوم معمارية ضخمة بإطارات عازلة حرارياً وزجاج دبل سيكوريت، تنزلق بسلاسة فائقة وتغلق بإحكام هوائي تام لمنع دخول الأتربة والعواصف.',
      enTitle: 'Heavy-Duty Lift & Slide Thermal Aluminum Patio Doors',
      enDesc: 'Monumental thermal break sliding patio systems providing smooth rolling mechanism, airtight compression seals, and maximum daylight exposure.',
      ckbTitle: 'دەرگای سلایدینگی قورس بە سیستەمی بەرزکەرەوە بۆ پانتایی گەورە',
      ckbDesc: 'دەرگای ئەلەمنیۆمی گەورە بە عەزلی حەراری و شووشەی دوولایەنە، داخستنی تەواو بەبێ دزەکردنی تۆز و با.'
    }
  ];

  let updatedCount = 0;
  const updatedGallery = gallery.map((item, idx) => {
    // Find matching pattern
    let match = PATTERNS.find(p => p.match(item));

    let arTitle = match ? match.arTitle : (item.translations?.ar?.title || item.arabicTitle || `مشروع معماري متكامل بأنظمة دور هوم #${idx + 1}`);
    let arDesc = match ? match.arDesc : (item.translations?.ar?.description || item.arabicDescription || `تنفيذ وتوريد أنظمة الألمنيوم والواجهات الزجاجية المعمارية من شركة باب المنزل بأعلى معايير الجودة والمواصفات الأوروبية المعتمدة.`);
    let enTitle = match ? match.enTitle : (item.translations?.en?.title || item.title || `Doorhome Architectural Installation Project #${idx + 1}`);
    let enDesc = match ? match.enDesc : (item.translations?.en?.description || item.description || `Turnkey architectural aluminum and glazing solutions executed with European standards by Doorhome.`);
    let ckbTitle = match ? match.ckbTitle : (item.translations?.ckb?.title || item.ckbTitle || `پڕۆژەی تەلارسازی دەرگای ماڵ #${idx + 1}`);
    let ckbDesc = match ? match.ckbDesc : (item.translations?.ckb?.description || item.ckbDescription || `جێبەجێکردنی سیستەمەکانی ئەلەمنیۆم و شووشەی تەلارسازی بە بەرزترین کوالیتی ئەوروپی لەلایەن دەرگای ماڵەوە.`);

    // If title has a trailing number, append appropriately
    const numMatch = (item.title || '').match(/#(\d+)$/);
    if (numMatch && !arTitle.includes('#')) {
      arTitle = `${arTitle} #${numMatch[1]}`;
      enTitle = `${enTitle} #${numMatch[1]}`;
      ckbTitle = `${ckbTitle} #${numMatch[1]}`;
    }

    updatedCount++;

    return {
      ...item,
      title: arTitle,
      description: arDesc,
      arabicTitle: arTitle,
      arabicDescription: arDesc,
      translations: {
        ar: { title: arTitle, description: arDesc },
        en: { title: enTitle, description: enDesc },
        ckb: { title: ckbTitle, description: ckbDesc }
      }
    };
  });

  fs.writeFileSync(galPath, JSON.stringify(updatedGallery, null, 2), 'utf8');
  console.log(`✓ Successfully updated ${updatedCount} gallery project items in cms_gallery_db.json!`);
}
