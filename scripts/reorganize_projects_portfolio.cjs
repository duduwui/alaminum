const fs = require('fs');
const path = require('path');

// 1. Gather all existing gallery items
const galPath = path.resolve(__dirname, '../cms_gallery_db.json');
let existingItems = [];
if (fs.existsSync(galPath)) {
  existingItems = JSON.parse(fs.readFileSync(galPath, 'utf8'));
}

// 2. Fix known missing src items
for (const it of existingItems) {
  if (!it.src || it.src === 'undefined') {
    if (it.id?.includes('black-zip') || it.title?.includes('زيب سكرين')) {
      it.src = '/uploads/exterior_black_zip_screen_shutter.png';
      it.mediaType = 'image';
    } else if (it.id?.includes('polycarb') || it.title?.includes('بولي كربونات')) {
      it.src = '/uploads/transparent_polycarbonate_rolling_shutter.png';
      it.mediaType = 'image';
    }
  }
}

// 3. Define curated project items grouped logically:
// - Skylights together
// - Doors & Gates together (multiple angles next to each other)
// - Windows & Facades together
// - Balustrades & Stairs together
// - Shutters & Pergolas together

const CURATED_PROJECTS = [
  // --- GROUP 1: SKYLIGHTS & STRUCTURAL GLASS ROOFS ---
  {
    id: 'proj-skylight-baghdad-combined',
    src: '/uploads/skylight_baghdad_laminated_3layers.mp4',
    poster: '/uploads/skylight_baghdad_laminated_3layers.poster.jpg',
    mediaType: 'video',
    title: 'مشروع تنفيذ وتركيب سقف سكاي لايت زجاجي ثلاثي الطبقات في بغداد (قبل وبعد)',
    description: 'توثيق كامل لمراحل تصنيع وتركيب سقف سكاي لايت هرمي معزول لأحد المنازل الراقية في العاصمة بغداد، باستخدام زجاج مصفح سيكوريت ثلاثي الطبقات (3-Layer Laminated Glass) مع معالجة حرارية وفواصل عزل EPDM ألمانية لضمان إضاءة طبيعية نقية مع منع الحرارة وتسريب المياه بنسبة 100%.',
    enTitle: 'Baghdad Villa 3-Layer Laminated Glass Skylight Project (Before & After)',
    enDesc: 'Full before-and-after documentation of a monumental structural skylight installed in Baghdad using certified 3-layer laminated safety glass and precision weatherproofing.',
    ckbTitle: 'پڕۆژەی سەقفی شووشەیی سکای لایت بە شووشەی سێ چینی پارێزراو لە بەغدا (پێش و پاش)',
    ckbDesc: 'دۆکیۆمێنتی تەواوی قۆناغەکانی پێش و پاشی دانانی سەقفی شووشەیی سکای لایت لە بەغدا بە شووشەی سێ چینی پتەو و عەزلی گەرمی و باران.'
  },
  {
    id: 'proj-photo-2',
    src: '/uploads/746f7fc1-3995-4a56-bbcb-1ba48e689f1d.mp4',
    poster: '/uploads/poster_slot2.jpg',
    mediaType: 'video',
    title: 'أسقف زجاجية وسكاي لايت إنشائية قابلة للمشي للفلل والمباني الحديثة',
    description: 'تصميم وتنفيذ أسقف وسكاي لايت زجاجية تتحمل الأوزان والمشي المباشر، مصنعة من زجاج سيكوريت مصفح متعدد الطبقات (Laminated Glass) مع عزل حراري تام وإضاءة طبيعية ساحرة.',
    enTitle: 'Walkable Structural Glass Roofs & Architectural Skylights',
    enDesc: 'Heavy-duty multi-layer tempered laminated glass ceilings engineered to support walking loads while flooding interiors with natural daylight.',
    ckbTitle: 'سەقفی شووشەیی ئەندازیاری بەهێز بۆ ڕۆیشتن و سکای لایت',
    ckbDesc: 'سەقفی شووشەیی فرە چینی زۆر بەهێز کە بەرگەی کێش دەگرێت و ڕۆشنایی سروشتی جوان دەبەخشێت بە ژوورەوە.'
  },
  {
    id: 'proj-photo-3',
    src: '/uploads/e61a2f89-73ee-43b4-9ae3-b58edc8b57e9.jpg',
    mediaType: 'image',
    title: 'اختبارات العزل المائي والحراري الميدانية لأسقف السكاي لايت والواجهات',
    description: 'فحص هندسي شامل لجميع الفواصل والمفاصل والسكاي لايت تحت ضغط المياه المباشر، لضمان عدم حدوث أي تسريب طوال فصول السنة تحت أقصى الظروف المناخية في العراق.',
    enTitle: 'Rigorous Weatherproof Sealing & Water Pressure Testing on Skylights',
    enDesc: 'Intensive on-site testing ensuring zero water leakage and complete thermal air-tightness under the harshest weather extremes.',
    ckbTitle: 'پشکنینی عەزلی ئاو و کەشوهەوای مەیدانی بۆ ڕووکار و سەقفەکان',
    ckbDesc: 'پشکنینی ورد لە ژێر پەستانی ئاودا بۆ دڵنیابوون لەوەی هیچ دزەکردنێک لە درێژایی ساڵدا ڕوونادات لە خراپترین کەشوهەوادا.'
  },
  {
    id: 'proj-photo-6',
    src: '/uploads/00580030-6081-4004-8980-24a3e47f5e24.jpg',
    mediaType: 'image',
    title: 'سكاي لايت وأهرامات زجاجية معمارية لإضاءة طبيعية ساحرة للقصور والفلل',
    description: 'تصاميم هرمية ودائرية مخصصة للأسقف الزجاجية، تحول الفراغات الداخلية إلى مساحات مضيئة ومفعمة بالحيوية مع عزل حراري ثلاثي يمنع دخول الحرارة المفرطة.',
    enTitle: 'Pyramid Glass Skylights & Architectural Roof Canopies',
    enDesc: 'Custom geometric skylights bringing natural light to grand living halls with advanced solar rejection Low-E glass coatings.',
    ckbTitle: 'سکای لایت و سەقفی شووشەیی هەڕەمی بۆ ڤێلا و کۆشکەکان',
    ckbDesc: 'دیزاینی هەڕەمی و بازنەیی بۆ سەقفی شووشە کە ژوورەکان پڕ دەکات لە ڕۆشنایی سروشتی بەبێ دزەکردنی گەرمی.'
  },

  // --- GROUP 2: DOORS, ENTRANCES & GATES ---
  {
    id: 'proj-photo-4',
    src: '/uploads/12c6d25c-c1d7-48f4-8fca-4eff4a88f9d5.mp4',
    poster: '/uploads/poster_slot4.jpg',
    mediaType: 'video',
    title: 'أبواب سحاب رفع وانزلاق (Lift & Slide) بانورامية عازلة بكسر حراري',
    description: 'دمج قطاعات الألمنيوم الأوروبية المعزولة حرارياً بكسر حراري (Thermal Break) مع زجاج دبل معالج ومملوء بغاز الآرغون لعكس 95% من حرارة الشمس الحارقة وحركة انزلاق سلسة بلمسة إصبع.',
    enTitle: 'Doorhome Architectural Thermal Lift & Slide Doors Video',
    enDesc: 'Combining high-performance European thermal profiles with solar-reflective double glazing to withstand severe Iraqi summer heat and save energy.',
    ckbTitle: 'دەرگای سلایدینگی لیفت و سلاید بە عەزلی حەراری ئەوروپی',
    ckbDesc: 'تێکەڵکردنی ئەلەمنیۆمی عازلی ئەوروپی لەگەڵ شووشەی دژە گەرمی بۆ کەمکردنەوەی گەرمای هاوین و کەمکردنەوەی خەرجی فێنککەرەوە.'
  },
  {
    id: 'proj-photo-1',
    src: '/uploads/dbca27fe-933e-4dc9-b374-b77ea4e214c1.jpg',
    mediaType: 'image',
    title: 'تركيب هندسي دقيق لأنظمة أبواب ومداخل الألمنيوم بأيدي مهندسي الشركة',
    description: 'تنفيذ ميداني متقن لكافة فتحات الألمنيوم والواجهات الزجاجية بدقة مليمترية، مع ضبط التوازن وتطبيق عوازل EPDM الألمانية لضمان إحكام تام ضد الهواء والمياه وعزل درجات الحرارة العالية.',
    enTitle: 'Precision Architectural Installation by Certified Doorhome Engineers',
    enDesc: 'Meticulous on-site installation of high-span aluminum and glass systems with laser leveling, complete weatherproofing, and European hardware.',
    ckbTitle: 'دابەستنی ئەندازیاری وردی سیستەمەکانی ئەلەمنیۆم لەلایەن تیمی دەرگای ماڵ',
    ckbDesc: 'کارکردنی مەیدانیی ورد لەسەر جێگیرکردنی پەنجەرە و دەرگا گەورەکان بە بەرزترین تەکنەلۆجیای عەزلی هەوا و ئاو.'
  },
  {
    id: 'proj-photo-10',
    src: '/products-assets/photo_10_2026-09-26_07-36-01.jpg',
    mediaType: 'image',
    title: 'بوابة فيلا خارجية رئيسية بألواح ألمنيوم مودرن وتطعيمات خشبية معمارية',
    description: 'بوابة خارجية فاخرة مصنعة من الألمنيوم الإنشائي المقاوم للصدأ بتصميم شرائح أفقية معاصرة وقفل إلكتروني ذكي، تمنح الفيلا خصوصية تامة وحماية قصوى.',
    enTitle: 'Architectural Modern Villa Exterior Gate with Thermal Slat Accents',
    enDesc: 'Custom fabricated heavy aluminum boundary gate designed for privacy, structural endurance, and smart lock automation.',
    ckbTitle: 'دەروازەی سەرەکی ڤێلا لە ئەلەمنیۆمی مۆدێرن بە تایبەتمەندی بەرز',
    ckbDesc: 'دەروازەی دەرەکی کەشخە لە ئەلەمنیۆمی دژە ژەنگ بە شێوازی مۆدێرن بۆ پاراستنی تایبەتمەندی و ئاسایشی ڤێلا.'
  },
  {
    id: 'proj-photo-13',
    src: '/products-assets/photo_13_2026-09-26_07-36-01.jpg',
    mediaType: 'image',
    title: 'بوابة مداخل وسيارات ثقيلة بتصميم لوفر ألمنيوم متناغم مع واجهة السور',
    description: 'منظومة بوابات متكاملة للسيارات والمشاة مصممة بقطاعات ألمنيوم ثقيلة ومحركات فتح أوتوماتيكية إيطالية الصنع تتحمل الاستخدام اليومي المكثف.',
    enTitle: 'Integrated Vehicle & Pedestrian Villa Gate System',
    enDesc: 'Heavy-duty louvered aluminum gate matching boundary fence architecture, equipped with motorized opening gear.',
    ckbTitle: 'سیستەمی دەروازەی ئۆتۆمبێل و پیادە بە ئەلەمنیۆمی قورس',
    ckbDesc: 'دەروازەی ئۆتۆمبێلی ئەلەمنیۆم بە مۆتۆری ئیتاڵی بۆ بەکارهێنانی ڕۆژانە بە درێژایی ساڵ.'
  },
  {
    id: 'proj-photo-11',
    src: '/products-assets/photo_11_2026-09-26_07-36-01.jpg',
    mediaType: 'image',
    title: 'بوابة فيلا ألمنيوم مودرن بتصميم لوفر أنيق متطابق مع الواجهات الخارجية',
    description: 'تصميم متناسق يجمع بين المتانة والشكل المعماري الجذاب، مع طلاء حراري مقاوم للرطوبة وأشعة الشمس الحارقة يضمن ثبات اللون لسنوات طويلة.',
    enTitle: 'Modern Architectural Villa Gate in Matte Finish',
    enDesc: 'Precision-aligned aluminum slats with UV-stable architectural powder coating engineered for durability in extreme heat.',
    ckbTitle: 'دەروازەی ڤێلا لە ئەلەمنیۆمی مۆدێرن بە بۆیەی تایبەت',
    ckbDesc: 'دیزاینێکی ڕێکخراو کە جوانی و پتەوی کۆدەکاتەوە بە بۆیەی دژە خۆر و شێ بۆ پاراستنی ڕەنگ.'
  },
  {
    id: 'proj-photo-partition-office',
    src: '/uploads/38e5c8dc-3834-4830-beb8-4928718d9f30.jpg',
    mediaType: 'image',
    title: 'نظام قواطع وأبواب زجاجية داخلية (بارتشن) للمكاتب والشركات',
    description: 'قواطع زجاجية ذكية للمكاتب والشركات والمنازل الحديثة، مع زجاج سيكوريت عالي الأمان بسماكة 10 ملم، مزود بخطوط مصنفرة أنيقة وإكسسوارات ومفصلات ومقابض ألمانية معتمدة لتوفير عزل صوتي ممتاز وخصوصية راقية.',
    enTitle: 'Glass Partition & Door System for Corporate Offices & Companies',
    enDesc: 'Smart architectural partition system featuring 10mm tempered safety glass with frosted privacy stripes and certified German hardware.',
    ckbTitle: 'سیستەمی بەربەست و دەرگای شووشەیی (پارتیشن) بۆ ئۆفیس و کۆمپانیا',
    ckbDesc: 'سیستەمی پارتیشنی شووشەیی زیرەک بۆ ئۆفیس، کۆمپانیا و ماڵەکان بە شووشەی ۱۰ ملمی سکۆریت، هێڵی شوشەیی جوان، و ئێکسسواراتی ئەڵمانی.'
  },

  // --- GROUP 3: WINDOWS & PANORAMIC GLASS FACADES ---
  {
    id: 'proj-video-guillotine',
    src: '/products-assets/unclears/WhatsApp Video 2026-10-25 at 5.10.04 PM (1).mp4',
    mediaType: 'video',
    title: 'نظام النوافذ والواجهات الزجاجية البانورامية المتحركة (المقصلة الأوتوماتيكية)',
    description: 'فيديو توثيقي لتشغيل نظام النوافذ والواجهات الزجاجية الأوتوماتيكية الرأسية (Guillotine Glass)، يتحرك بسلاسة وهدوء بلمسة زر عبر محركات أوروبية صامتة لتوفير حماية تامة وإطلالة بانورامية.',
    enTitle: 'Automated Guillotine Panoramic Vertical Glass System in Motion',
    enDesc: 'Showcasing vertical guillotine motorized sliding glass facade operating smoothly with whisper-quiet European drive motors.',
    ckbTitle: 'سیستەمی پەنجەرە و ڕووکاری پانۆرامای گیۆتینی ئۆتۆماتیکی',
    ckbDesc: 'ڤیدیۆی کارکردنی سیستەمی شووشەی جووڵاوی ستوونی بە بێدەنگی و ئۆتۆماتیکی بۆ بینینی کراوە.'
  },
  {
    id: 'proj-photo-showroom-sliding',
    src: '/products-assets/video_2026-09-26_07-36-00 (10).mp4',
    mediaType: 'video',
    title: 'تجربة عملية من المعرض: سلاسة حركة أنظمة الأبواب والنوافذ السحاب الألمانية',
    description: 'شاهد خفة وسلاسة حركة أنظمة السلايدينغ والرفع والسحب (Lift & Slide) ذات الأوزان الثقيلة، حيث تنزلق الدرفة التي تزن 300 كغم بلمسة إصبع واحدة بفضل عجلات الرولر الإيطالية المتطورة.',
    enTitle: 'Showroom Demonstration: Heavy-Duty Lift & Slide Fingertip Operation',
    enDesc: 'Live demonstration showing ultra-smooth sliding motion of heavy multi-pane glass sashes with tandem Italian rollers.',
    ckbTitle: 'تاقیکردنەوەی مەیدانی لە پێشانگا: جووڵەی نەرمی دەرگای سلایدینگ',
    ckbDesc: 'بینینی جووڵەی نەرم و بێ کێشەی دەرگا و پەنجەرە قورسەکان بە یەک پەنجە بە بێدەنگی.'
  },
  {
    id: 'proj-photo-8',
    src: '/uploads/40499425-a7f0-47b5-b6e5-a6f07d5e182f.jpg',
    mediaType: 'image',
    title: 'واجهات فلل عصرية فاخرة وشبابيك بانورامية عازلة بإطلالات مفتوحة',
    description: 'تنفيذ متكامل لواجهات الفلل الحديثة بأنظمة الألمنيوم والزجاج العازل للحرارة والصوت، يعزز الإضاءة الطبيعية ويمنح المنزل إطلالة معمارية مبهرة.',
    enTitle: 'Modern Villa Panoramic Thermal Windows & Glazed Facade Installation',
    enDesc: 'Turnkey architectural window and facade execution delivering thermal comfort, acoustic attenuation, and unobstructed views.',
    ckbTitle: 'ڕووکاری ڤێلای مۆدێرن و پەنجەرەی پانۆراما بە عەزلی بەرز',
    ckbDesc: 'جێبەجێکردنی تەواوی ڕووکاری دەرەوە بە ئەلەمنیۆم و شووشەی عازل بۆ گەرمی و دەنگ بە دیمەنێکی سەرنجڕاکێش.'
  },
  {
    id: 'proj-photo-curtain-wall-tower',
    src: '/products-assets/unclears/WhatsApp Video 2026-10-30 at 6.19.54 PM.mp4',
    mediaType: 'video',
    title: 'واجهات زجاجية هيكلية متصلة (كيرتن وول 50F) للأبراج والمباني التجارية',
    description: 'توثيق لمشروع برج سكني وتجاري فاخر يبرز الواجهات الزجاجية الهيكلية المستمرة (Curtain Wall 50F) المقاومة لأعتى ضغوط الرياح وعواصف الغبار الصيفية.',
    enTitle: 'Curtain Wall 50F High-Span Structural Glazing for Commercial Towers',
    enDesc: 'Engineered mullion-transom structural glazing designed for high-rise commercial structures and prestigious villa living rooms.',
    ckbTitle: 'ڕووکاری شووشەیی کێرتن وۆڵ 50F بۆ باڵەخانە و تاوەرەکان',
    ckbDesc: 'پڕۆژەی ڕووکاری شووشەیی پەیکەری ئەلەمنیۆم بە بەرگری بەرز بەرامبەر پەستانی با و کەشوهەوای توند.'
  },

  // --- GROUP 4: BALUSTRADES, BALCONIES & STAIRS ---
  {
    id: 'proj-photo-pool-railing',
    src: '/products-assets/photo_15_2026-09-26_07-36-01.jpg',
    mediaType: 'image',
    title: 'درابزين وحواجز زجاجية فاخرة بدون إطار للمسابح والتراسات والحدائق',
    description: 'نظام حواجز زجاجية إنشائية للمسابح والحدائق الخارجية مثبت بقواعد استانلس ستيل SS316 المقاومة للكلور والمياه، يمنح أماناً فائقاً مع رؤية مائية صافية دون عوائق.',
    enTitle: 'Frameless Glass Balustrade for Luxury Swimming Pools & Terraces',
    enDesc: 'Marine-grade SS316 spigots with heavy laminated safety glass delivering crystal clear poolside safety.',
    ckbTitle: 'دەربزینی شووشەیی بێ چوارچێوە بۆ مەلەوانگە و باخچە',
    ckbDesc: 'حاجزی شووشەیی پارێزراو بۆ دەوری مەلەوانگە بە جێگیرکەری ستیلی دژە ژەنگ بە دیمەنی ڕوون و سەلامەت.'
  },
  {
    id: 'proj-photo-stair-glass',
    src: '/products-assets/photo_8_2026-09-26_07-36-01.jpg',
    mediaType: 'image',
    title: 'درابزين وحواجز سلالم زجاجية سيكوريت بدون إطار للتصميم الداخلي الحديث',
    description: 'ألواح زجاجية مقواة سماكة 12 ملم أو 16 ملم مثبتة بنظام براغي غاطسة مخفية مع مقبض علوي انسيابي، تضفي اتساعاً وفخامة على الدرج والبهو الداخلي.',
    enTitle: 'Interior Frameless Tempered Glass Staircase Balustrade',
    enDesc: 'Minimalist glass stair railings with concealed architectural fixings maximizing light flow and spaciousness.',
    ckbTitle: 'دەربزینی شووشەیی بۆ قادرمەی ناوەوە بە جێگیرکردنی شاراوە',
    ckbDesc: 'شووشەی سکۆریتی بەهێز بۆ قادرمەی مەڕمەڕ بە دیزاینێکی کراوە و پاک کە فەخامەت دەبەخشێتە هۆڵی ناوەوە.'
  },
  {
    id: 'proj-photo-mezzanine-glass',
    src: '/uploads/84ea0ada-2c4f-4df2-a360-c2123edaa703.jpg',
    mediaType: 'image',
    title: 'حاجز شرفة وميزانين داخلي بزجاج معماري مقوى وقاعدة ألمنيوم غاطسة',
    description: 'تصميم راقٍ للشرفات والميزانين في الفلل ذات الطوابق المفتوحة، يوفر عزلاً صوتياً بين الطوابق مع الحفاظ على الاتصال البصري والانفتاح المعماري.',
    enTitle: 'Recessed Base Glass Mezzanine Railing for Double-Height Living Halls',
    enDesc: 'Continuous base shoe channel glass railing providing acoustic buffer and structural safety for upper levels.',
    ckbTitle: 'حاجزی شووشەیی بۆ باڵکۆنی ناوەوە و قاتی دووەم بە ئەلەمنیۆمی شاراوە',
    ckbDesc: 'دیزاینێکی شیک بۆ نهۆمی سەرەوە بە شووشەی بەهێز و بنکەی ئەلەمنیۆمی ژێرخاک بۆ سەلامەتی و جوانی.'
  },

  // --- GROUP 5: SHUTTERS, ZIP-SCREENS & OUTDOOR LIVING ---
  {
    id: 'gallery-proj-black-zip-screen-shutter',
    src: '/uploads/exterior_black_zip_screen_shutter.png',
    mediaType: 'image',
    title: 'مشروع تظليل وحماية واجهة خارجية بستائر وشترات زيب سكرين المعزولة',
    description: 'تنفيذ وتركيب متقن لنظام ستائر وشترات زيب سكرين الأوتوماتيكية لحماية الواجهات الخارجية والجلسات من أشعة الشمس المباشرة والأتربة والرياح مع عزل حراري فائق وتشغيل هادئ بلمسة زر.',
    enTitle: 'Motorized Drop Zip-Screen Facade Solar Protection Project',
    enDesc: 'Turnkey exterior drop zip-screen project executed with precision by Doorhome engineers. Features automated flame-retardant mesh for thermal control and weather resistance.',
    ckbTitle: 'پڕۆژەی دانانی پەردەی زیپ سکرینی ئۆتۆماتیکی بۆ پاراستنی ڕووکاری دەرەوە',
    ckbDesc: 'دانانی سیستەمی زیپ سکرینی دەرەکی بە کۆنتڕۆڵ بۆ پاراستن لە خۆر و تۆز و گەرمی بە جووڵەی نەرم و بێدەنگ.'
  },
  {
    id: 'gallery-proj-polycarb-transparent-shutter',
    src: '/uploads/transparent_polycarbonate_rolling_shutter.png',
    mediaType: 'image',
    title: 'مشروع تركيب شتر رول شفاف لكابينة وحديقة فيلا فاخرة (دراب شفاف)',
    description: 'تركيب شتر أمني شفاف من شرائح البولي كربونات المقاومة للكسر والصدمات، يمنح الجلسات الخارجية حماية كاملة من الأتربة والأمطار مع الحفاظ على الإطلالة البانورامية الشفافة.',
    enTitle: 'Transparent Polycarbonate Rolling Shutter Pavilion Project',
    enDesc: 'Custom installation featuring impact-resistant clear polycarbonate slats for luxury villas, providing weather insulation while retaining complete garden visibility.',
    ckbTitle: 'پڕۆژەی دانانی دەڕابەی شووشەیی شەفاف لە پۆلیکاربۆنات بۆ باخچە و ڤێلا',
    ckbDesc: 'دانانی دەڕابەی ئەمنیی شەفافی دژە شکاندن بۆ باڵکۆن و باخچەکان بە عەزلی باران و تۆز لەگەڵ بینینی کراوە.'
  },
  {
    id: 'proj-photo-pergola-garden',
    src: '/products-assets/photo_9_2026-09-26_07-36-01.jpg',
    mediaType: 'image',
    title: 'برجولات ألمنيوم متحركة معزولة وإغلاقات زجاجية للحدائق والتراسات',
    description: 'استمتع بحديقتك وتراسك طوال فصول السنة مع نظام البرجولات الأوتوماتيكية المعزولة بشفرات ألمنيوم متحركة للتحكم بدرجة الإضاءة والتهوية والعزل التام ضد الأمطار.',
    enTitle: 'Bioclimatic Motorized Louvered Aluminum Pergola & Terrace Enclosure',
    enDesc: 'Adjustable motorized roof louvers providing all-season outdoor weather protection and smart climate control.',
    ckbTitle: 'پێرگۆلای ئەلەمنیۆمی جووڵاو و شووشەبەندی باخچە و تەراس',
    ckbDesc: 'سوودمەندبوون لە باخچە لە هەموو وەرزەکاندا بە سیستەمی پێرگۆلای زیرەک بۆ کۆنتڕۆڵی ڕووناکی و باران.'
  },
  {
    id: 'proj-photo-zip-video',
    src: '/products-assets/unclears/video_2026-09-26_07-36-00 (8).mp4',
    mediaType: 'video',
    title: 'تشغيل آلي صامت لنظام ستائر الحماية الخارجية للتراسات والحدائق',
    description: 'فيديو توضيحي لتشغيل نظام الستائر الخارجية (Zip Screen) الأوتوماتيكي بلمسة زر، يوضح قوة الشد ومقاومة الرياح العاتية وحجب الشمس المباشرة.',
    enTitle: 'Zip Screen Automated Wind & Solar Defense Video Demonstration',
    enDesc: 'Demonstrating silent motorized descent and tensioned side-track wind stability under active conditions.',
    ckbTitle: 'ڤیدیۆی کارکردنی ئۆتۆماتیکی بێدەنگی پەردەی زیپ سکرین بۆ باخچە',
    ckbDesc: 'ڕوونکردنەوەی ڤیدیۆیی جووڵەی نەرمی پەردەی دەرەوە بۆ پاراستنی تەراس لە با و تیشکی خۆر.'
  }
];

// Helper to fill translations cleanly
function formatProject(p) {
  const arTitle = p.title || p.arTitle;
  const arDesc = p.description || p.arDesc;
  const enTitle = p.enTitle || arTitle;
  const enDesc = p.enDesc || arDesc;
  const ckbTitle = p.ckbTitle || arTitle;
  const ckbDesc = p.ckbDesc || arDesc;

  return {
    id: p.id,
    title: arTitle,
    description: arDesc,
    src: p.src,
    poster: p.poster,
    mediaType: p.mediaType || (/\.(mp4|webm|mov)(\?|#|$)/i.test(p.src) ? 'video' : 'image'),
    category: p.category || (p.title.includes('سكاي لايت') || p.title.includes('سقف') ? 'windows' : p.title.includes('باب') || p.title.includes('بوابة') ? 'doors' : p.title.includes('نافذ') || p.title.includes('شباك') ? 'windows' : p.title.includes('درابزين') || p.title.includes('حاجز') || p.title.includes('شرفة') ? 'shorfa' : 'doors'),
    location: p.location || '',
    system: p.system || 'Doorhome Certified European Systems',
    translations: {
      ar: { title: arTitle, description: arDesc },
      en: { title: enTitle, description: enDesc },
      ckb: { title: ckbTitle, description: ckbDesc }
    }
  };
}

// Map existing items to descriptive names instead of #14, #15, etc.
const DESCRIPTIVE_TITLES = [
  {
    pattern: /معارض ومقرات الشركات|photo_14|photo_22|photo_30|photo_38|photo_46|photo_54|photo_62|photo_70|photo_78/,
    arTitle: 'واجهات وأبواب زجاجية بانورامية لمعارض ومقرات الشركات والمكاتب الحديثة',
    arDesc: 'واجهات زجاجية عصرية تعتمد نظام الإطارات النحيفة (Slim Frame) وزجاج سيكوريت عازل، صممت خصيصاً للمعارض ومقرات الشركات لتوفير رؤية متصلة وفخامة معمارية لا تضاهى.',
    enTitle: 'Corporate Commercial Panoramic Facade & Sliding System',
    enDesc: 'Minimalist slim-profile glass facades engineered for commercial headquarters and luxury storefronts.',
    ckbTitle: 'ڕووکاری شووشەیی پانۆراما بۆ پێشانگا و کۆمپانیاکان',
    ckbDesc: 'ڕووکاری مۆدێرن بە چوارچێوەی باریک و شووشەی پارێزراو بۆ پێشانگا و ئۆفیسی کۆمپانیاکان.'
  },
  {
    pattern: /المسابح والتراسات والحدائق|photo_15|photo_23|photo_31|photo_39|photo_47|photo_55|photo_63|photo_71|photo_79/,
    arTitle: 'درابزين وحواجز زجاجية فاخرة بدون إطار للمسابح والتراسات الخارجية',
    arDesc: 'نظام حواجز زجاجية إنشائية للمسابح والحدائق الخارجية مثبت بقواعد استانلس ستيل SS316 المقاومة للكلور والمياه، يمنح أماناً فائقاً مع رؤية مائية صافية دون عوائق.',
    enTitle: 'Frameless Glass Balustrade for Pool Decks & Gardens',
    enDesc: 'Engineered structural glass railing anchored with marine-grade stainless steel spigots.',
    ckbTitle: 'دەربزینی شووشەیی بێ چوارچێوە بۆ دەوری مەلەوانگە و باخچە',
    ckbDesc: 'حاجزی شووشەیی ئەندازیاری بۆ دەوری مەلەوانگە بە ستیلی دژە ژەنگ بە دیمەنی ڕوون.'
  },
  {
    pattern: /لورينزو 70LS|photo_16|photo_24|photo_32|photo_40|photo_48|photo_56|photo_64|photo_72|photo_80/,
    arTitle: 'أبواب سحاب بانورامية عازلة للحرارة والصوت بنظام لورينزو 70LS الإيطالي',
    arDesc: 'نظام السحب والرفع الإيطالي الرائد للمساحات الكبيرة، يتيح فتح الألواح الزجاجية الضخمة بلمسة يد خفيفة، مع إحكام كامل ضد مياه الأمطار والرياح والغبار بفضل آليات القفل الهوائي المتطورة.',
    enTitle: 'Lorenzo 70LS Thermal-Break Minimalist Sliding Patio Door',
    enDesc: 'Italian sliding door system engineered for oversized openings with thermal barriers and airtight weatherproofing.',
    ckbTitle: 'دەرگای سلایدینگی لۆرێنزۆ 70LS بە عەزلی گەرمی و دەنگ',
    ckbDesc: 'سیستەمی ئیتاڵی پێشکەوتوو بۆ دەرگای گەورە بە جووڵەی نەرم و عەزلی تۆز و باران.'
  },
  {
    pattern: /باب فيلا رئيسي محوري|photo_17|photo_25|photo_33|photo_41|photo_49|photo_57|photo_65|photo_73|photo_81/,
    arTitle: 'باب فيلا رئيسي محوري فاخر بتصميم ألمنيوم مودرن وعوازل حرارية مدمجة',
    arDesc: 'أبواب مداخل رئيسية ضخمة مع أقفال إلكترونية ذكية وعوازل حرارية ومائية مدمجة، تمنح الفيلا هيبة معمارية وتوفر أماناً استثنائياً يدوم لعقود.',
    enTitle: 'Luxury Architectural Pivot Entrance Door for Modern Villas',
    enDesc: 'Grand monumental pivot entrance door with smart biometric locking and concealed German pivot hardware.',
    ckbTitle: 'دەرگای سەرەکی ڤێلا لە ئەلەمنیۆمی مۆدێرن بە عەزلی گەرمی',
    ckbDesc: 'دەرگای دەروازەی شاهانەی ڤێلا بە قوفڵی زیرەک و ڕاگرتنی گەرمی و پاراستنی بەرز.'
  },
  {
    pattern: /كيرتن وول 50F|photo_18|photo_26|photo_34|photo_42|photo_50|photo_58|photo_66|photo_74|photo_82/,
    arTitle: 'واجهات زجاجية هيكلية متصلة (كيرتن وول 50F) للفلل والمباني الحديثة',
    arDesc: 'واجهات زجاجية معمارية مستمرة تعتمد قطاعات ألمنيوم بعرض 50 ملم مصممة لتحمل ضغط الرياح العاتية في الطوابق المرتفعة، مع زجاج مزدوج عاكس للحرارة.',
    enTitle: 'Curtain Wall 50F High-Span Structural Facade System',
    enDesc: 'Engineered mullion-transom stick curtain wall for open-concept modern villa facades and offices.',
    ckbTitle: 'ڕووکاری شووشەیی پەیکەری کێرتن وۆڵ 50F',
    ckbDesc: 'ڕووکاری ئەندازیاری شووشەیی بۆ بەرگەگرتنی پەستانی با و ڕێگری لە گەرمای هاوین.'
  },
  {
    pattern: /درج وسلالم زجاجية معلقة|photo_19|photo_27|photo_35|photo_43|photo_51|photo_59|photo_67|photo_75/,
    arTitle: 'درج وسلالم زجاجية معلقة وحواجز سيكوريت فائقة الشفافية والأمان',
    arDesc: 'درابزين زجاجي داخلي للسلالم المودرن بدون قواطع مرئية، مصنع من زجاج سيكوريت معالج حرارياً ضد الصدمات، ليعطي شعوراً بالاتساع والضوء الطبيعي.',
    enTitle: 'Suspended Tempered Glass Interior Staircase Railing',
    enDesc: 'Minimalist floating stair balustrade crafted from certified tempered impact-resistant safety glass.',
    ckbTitle: 'دەربزینی شووشەیی بۆ قادرمەی ناوەوە بە ڕوونی تەواو',
    ckbDesc: 'حاجزی شووشەیی مۆدێرن بۆ قادرمە بە زۆرترین شەفافیەت و پارێزگاری لە کەوتنەخوارەوە.'
  },
  {
    pattern: /شبابيك بي في سي عازلة|Legend 80|photo_20|photo_28|photo_36|photo_44|photo_52|photo_60|photo_68|photo_76/,
    arTitle: 'شبابيك بي في سي عازلة للصوت والحرارة بست حجرات هوائية (Legend 80)',
    arDesc: 'نظام شبابيك بي في سي أوروبي متطور يمنح عزلاً حرارياً وصوتياً فائقاً يصل إلى 45 ديسيبل، لمنع الضوضاء الخارجية والحرارة الصيفية وتوفير أجواء داخلية هادئة.',
    enTitle: 'Deceuninck Legend 80 Multi-Chamber Acoustic uPVC Windows',
    enDesc: 'High-performance 6-chamber uPVC profiles delivering 45 dB noise insulation and certified thermal savings.',
    ckbTitle: 'پەنجەرەی یو پی ڤی سی لێجەند 80 بە عەزلی دەنگ و گەرمی',
    ckbDesc: 'سیستەمی پێشکەوتووی ٦ خانەیی بە عەزلی ٤٥ دێسیبڵ بۆ دەنگ و پاراستنی گەرمای ژوورەوە.'
  },
  {
    pattern: /أبواب سحاب ثقيلة بنظام الرفع|photo_21|photo_29|photo_37|photo_45|photo_53|photo_61|photo_69|photo_77/,
    arTitle: 'أبواب سحاب ثقيلة بنظام الرفع والسحب للمساحات الكبيرة والمفتوحة',
    arDesc: 'أبواب سحاب تتحمل دلفات زجاجية ضخمة حتى وزن 400 كغم، تفتح وتغلق بكل سلاسة وهدوء، وتوفر عزلاً محكماً ضد العواصف الرملية ومياه الأمطار.',
    enTitle: 'Heavy-Duty Lift & Slide Patio Door for Expansive Living Areas',
    enDesc: 'Capable of supporting oversized 400kg sashes with fingertip ease and airtight multi-lock security.',
    ckbTitle: 'دەرگای گەورەی سلایدینگ بۆ هۆڵ و باڵکۆنی گەورە',
    ckbDesc: 'دەرگای ئەلەمنیۆمی قورس بە تایبەتمەندی جووڵەی نەرم بۆ دابینکردنی گەورەترین دیمەن.'
  }
];

// Rebuild clean gallery list starting with curated items
const finalGallery = [];
const usedSrcs = new Set();

// 1. Add all Curated Projects first (these include the top 12 slides and logical groups)
for (const p of CURATED_PROJECTS) {
  const formatted = formatProject(p);
  finalGallery.push(formatted);
  usedSrcs.add(formatted.src);
}

// 2. Add remaining existing items with cleaned-up descriptive titles (NO # numbers!)
for (const it of existingItems) {
  if (!it.src || it.src === 'undefined' || usedSrcs.has(it.src)) continue;

  let chosenTitle = it.title || '';
  let chosenDesc = it.description || '';
  let chosenEn = it.translations?.en?.title || '';
  let chosenEnDesc = it.translations?.en?.description || '';
  let chosenCkb = it.translations?.ckb?.title || '';
  let chosenCkbDesc = it.translations?.ckb?.description || '';

  // Clean trailing # numbers
  chosenTitle = chosenTitle.replace(/\s*#\d+\s*$/, '').trim();

  // Match against descriptive patterns
  for (const d of DESCRIPTIVE_TITLES) {
    if (d.pattern.test(it.src) || d.pattern.test(chosenTitle)) {
      chosenTitle = d.arTitle;
      chosenDesc = d.arDesc;
      chosenEn = d.enTitle;
      chosenEnDesc = d.enDesc;
      chosenCkb = d.ckbTitle;
      chosenCkbDesc = d.ckbDesc;
      break;
    }
  }

  // Ensure description is never empty
  if (!chosenDesc) {
    chosenDesc = 'مشروع معماري متكامل تم تنفيذه بأعلى معايير الدقة الهندسية والتركيب المعتمد من مهندسي باب المنزل، مع تطبيق عوازل ومفصلات أوروبية أصلية تضمن الأمان التام وطول العمر الافتراضي.';
  }

  finalGallery.push({
    id: it.id || `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: chosenTitle,
    description: chosenDesc,
    src: it.src,
    poster: it.poster,
    mediaType: it.mediaType || (/\.(mp4|webm|mov)(\?|#|$)/i.test(it.src) ? 'video' : 'image'),
    category: it.category || 'doors',
    location: it.location || '',
    system: it.system || 'Doorhome Certified European Systems',
    translations: {
      ar: { title: chosenTitle, description: chosenDesc },
      en: { title: chosenEn || chosenTitle, description: chosenEnDesc || chosenDesc },
      ckb: { title: chosenCkb || chosenTitle, description: chosenCkbDesc || chosenDesc }
    }
  });

  usedSrcs.add(it.src);
}

// Write result
fs.writeFileSync(galPath, JSON.stringify(finalGallery, null, 2), 'utf8');
console.log(`✓ Reorganized portfolio! Total projects in gallery: ${finalGallery.length}`);
console.log(`Top 12 3D carousel items configured:`);
finalGallery.slice(0, 12).forEach((it, idx) => {
  console.log(`[Slot #${String(idx + 1).padStart(2, '0')}] (${it.mediaType.toUpperCase()}) ${it.title}`);
});
