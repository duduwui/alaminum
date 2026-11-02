const fs = require('fs');
const path = require('path');

const CMS_PATH = path.join(__dirname, 'cms_products_db.json');
let db = JSON.parse(fs.readFileSync(CMS_PATH, 'utf8'));

// ── 38 Unique Doors: Titles and 3-Paragraph Commercial Descriptions ───────────

const doorsData = {
  'prod-polycarb-transparent-shutter': {
    en: {
      name: 'Transparent Polycarbonate Security Shutter for Showrooms and Stores',
      description: `This transparent polycarbonate security shutter provides maximum protection while maintaining full product visibility around the clock. Crafted from impact-resistant crystal polycarbonate slats, it creates an elegant glass-like appearance that allows customers to browse display windows even when the premises are closed.\n\nIdeal for retail stores, high-end commercial showrooms, banking facilities, and corporate lobbies, this system combines high tensile strength with modern aesthetics. It provides a reliable barrier against dust, noise, and unauthorized access without blocking incoming light or compromising security.\n\nOperated smoothly via motorized control or smart remote systems, the shutter rolls up compactly into an unobtrusive overhead housing. It delivers low maintenance and long-term durability, making it an essential investment for commercial spaces seeking prestige and security.`
    },
    ar: {
      name: 'شتر رول بولي كربونات شفاف للمعارض والمتاجر',
      description: `يوفر هذا الشتر الأمني الشفاف المصنوع من البولي كربونات أعلى مستويات الحماية مع الحفاظ على وضوح الرؤية للمنتجات على مدار الساعة. صُنع من شرائح بولي كربونات بلورية فائقة القوة ومقاومة للصدمات، مما يمنحه مظهراً زجاجياً راقياً يسمح للزبائن بمشاهدة واجهات العرض حتى أثناء أوقات الإغلاق.\n\nيُعد خياراً مثالياً للمتاجر الفاخرة والمعارض التجارية والمقرات المصرفية والمداخل المؤسسية، حيث يجمع بين القوة الإنشائية العالية والجمال المعماري الحديث. يشكل حاجزاً فعالاً ضد الغبار والضوضاء ومحاولات الاقتحام دون حجب الضوء أو الإخلال بأمان المكان.\n\nيعمل بنظام تشغيل آلي سلس عبر محركات متطورة أو أجهزة التحكم عن بُعد، ويُطوى بانسيابية داخل صندوق علوي مدمج وأنيق. يتميز بقلة الصيانة والمتانة العالية، ليكون استثماراً ذكياً للمساحات التجارية التي تبحث عن الأمان والجاذبية.`
    },
    ckb: {
      name: 'دەڕابی ڕوونی پۆلیکاربۆنات بۆ پێشانگا و دوکانەکان',
      description: `ئەم دەڕابە ئەمنییە ڕوونە لە پۆلیکاربۆناتی بەهێز دروستکراوە کە بەرزترین ئاستی پاراستن دابین دەکات لەگەڵ پاراستنی بینینی تەواوی کەلوپەلەکان بە درێژایی شەو و ڕۆژ. لە پارچەی پۆلیکاربۆناتی شوشەیی دژە-شکان دروستکراوە، دیمەنێکی شیکی شوشەیی دەبەخشێت کە ڕێگە بە کڕیاران دەدات سەیری کاڵاکان بکەن تەنانەت لە کاتی داخرانیشدا.\n\nهەڵبژاردنێکی نایابە بۆ دوکانە گەورەکان، پێشانگا بازرگانییەکان، بانکەکان و دەروازەی کۆمپانیاکان، بەجۆرێک کە بەهێزی و جوانیی تەلارسازیی مۆدێرن کۆدەکاتەوە. بەربەستێکی بەهێزە لە دژی تۆز و دەنگەدەنگ و دزیکردن بێ ئەوەی ڕێگری لە ڕووناکی بکات.\n\nبە مەکینەی کارەبایی نەرم و کۆنتڕۆڵی دووری کار دەکات و بە ڕێکی لەناو سندوقی سەرەوەدا کۆدەبێتەوە. پێویستی بە کەمترین چاککردنەوەیە و تەمەنێکی درێژی هەیە، کە دەبێتە وەبەرهێنانێکی پڕبایەخ بۆ شوێنە بازرگانییەکان.`
    }
  },

  'door-dh-dr-30': {
    en: {
      name: 'Glass Partition System for Offices and Companies',
      description: `This modern interior glass partition system is purposefully designed for corporate offices, executive suites, conference rooms, and commercial centers. Engineered with 10mm heavy-duty tempered safety glass or an insulated double-glazed configuration, it provides acoustic privacy while allowing daylight to flow freely between spaces.\n\nEquipped with premium German hardware and concealed hydraulic floor pivot hinges, the door swings smoothly in both directions with controlled soft-close and 90-degree hold-open positioning. Elegant horizontal frosted privacy bands provide visual discretion at eye level while preserving an open, prestigious corporate environment.\n\nThe minimal aluminum framing delivers lasting durability and seamless integration into modern workspaces, clinics, and residential zoning areas. It represents the perfect combination of contemporary styling, acoustic comfort, and effortless daily performance.`
    },
    ar: {
      name: 'نظام قواطع وأبواب زجاجية للمكاتب والشركات',
      description: `صُمم هذا النظام المعماري من القواطع والأبواب الزجاجية الداخلية خصيصاً للمكاتب التنفيذية والشركات وقاعات الاجتماعات والمراكز التجارية الحديثة. يتوفر بزجاج سيكوريت مقسى عالي المتانة سماكة 10 ملم أو بنظام الزجاج المزدوج العازل، مما يوفر هدوءاً وخصوصية صوتية ممتازة مع تدفق كامل للضوء الطبيعي.\n\nيتميز النظام بإكسسوارات ومفصلات هيدروليكية ألمانية الصنع فائقة الدقة مدمجة بالأرضية، تتيح فتح الباب بسلاسة في الاتجاهين مع خاصية التثبيت والإغلاق الهادئ والمحكوم. تمنح الشرائط الأفقية المصنفرة خصوصية بصرية ذكية وأنيقة للمكاتب دون التأثير على رحابة المكان.\n\nتمنح الإطارات المعدنية النحيفة تصميماً راقياً يناسب بيئات العمل الاحترافية والمستشفيات والعيادات والتقسيمات الداخلية للمنازل المعاصرة. يجمع بين الفخامة المعمارية والعزل المريح والاعتمادية الطويلة بأقل قدر من الصيانة.`
    },
    ckb: {
      name: 'سیستەمی دیواری جیاکەرەوە و دەرگای شووشەیی بۆ ئۆفیس و کۆمپانیاکان',
      description: `ئەم سیستمە مۆدێرنەی دیواری جیاکەرەوە و دەرگای شووشەیی ناوخۆیی بە تایبەتی بۆ ئۆفیسی کۆمپانیاکان، ژووری بەڕێوەبەران، هۆڵی کۆبوونەوە و سەنتەرە بازرگانییەکان دیزاین کراوە. بە شوشەی سیکیوریتی بەهێزی ١٠ ملم یان شوشەی دووجۆڕی عازل بەردەستە، کە ئارامی و تایبەتمەندی دەنگی دابین دەکات لەگەڵ بڵاوبوونەوەی ڕووناکی سروشتی.\n\nبە ئەکسسوارات و مەکینەی هایدرۆلیکی ئەڵمانی کوالیتی بەرز لەسەر زەوی کار دەکات، کە دەرگاکە بە نەرمی بە هەردوو لادا دەکرێتەوە و بە هێمنی دادەخرێتەوە. شریتە تەڵخە شیکەکان تایبەتمەندی و پارێزگاری لە بینین دابین دەکەن بەبێ تێکدانی کراوەیی و ڕووناکیی ژینگەی کار.\n\nچوارچێوەی ئەلەمنیۆمی تەنک دیمەنێکی سەرنجڕاکێش بە ئۆفیسەکان، کلینیکەکان و بەشە ناوخۆییەکانی ماڵ دەبەخشێت. تێکەڵەیەکی نموونەییە لە جوانی هاوچەرخ، ئارامی دەنگی، و کارکردنی متمانەپێکراو بۆ ساڵانی درێژ.`
    }
  },

  'door-dh-dr-47': {
    en: {
      name: 'Architectural Pivot Entrance Door in Treated Wood and Aluminum',
      description: `This grand architectural pivot door makes an extraordinary statement at the main entrance of private residences, corporate headquarters, and luxury venues. Engineered with a heavy-duty concealed vertical pivot axis, the door rotates with effortless grace despite its monumental scale and solid construction.\n\nCombining natural treated weather-resistant teak wood paneling with a heavy-duty structural aluminum core, it offers exceptional thermal insulation and complete protection against harsh desert sunlight, dust, and wind. The design is complemented by a full-height brushed metallic pull handle and multi-point perimeter locking.\n\nEvery detail is crafted for long-term stability and timeless prestige. It transforms the entrance into an architectural focal point, offering superior acoustic comfort, certified security, and an unforgettable sense of arrival.`
    },
    ar: {
      name: 'باب مدخل محوري فاخر من الخشب المعالج والألمنيوم',
      description: `يشكل هذا الباب المحوري المعماري الفاخر بصمة استثنائية عند المدخل الرئيسي للمنازل ومقرات الشركات والمباني المتميزة. صُمم بمحور دوران رأسي مخفي فائق التحمل، مما يتيح للدرفة الكبيرة الدوران بانسيابية وخفة متناهية رغم وزنها ومتانتها الهيكلية.\n\nيجمع التصميم بين جمال ألواح الخشب الطبيعي المعالج المقاوم للعوامل الجوية وهيكل الألمنيوم المتين، ليوفر عزلاً حرارياً وصوتياً متقدماً وحماية كاملة ضد الشمس والحرارة والغبار. يكتمل المظهر بمقبض رأسي أنيق ممتد وقفل أمني متعدد النقاط.\n\nصُنعت كافة مكونات الباب لضمان المتانة الدائمة والجمال المعماري الخالد. يمنح المدخل حضوراً مهيباً وأماناً موثوقاً يعكس الفخامة والجودة العالية للمكان.`
    },
    ckb: {
      name: 'دەرگای سەرەکی تەوەرەیی شاهانە لە دار و ئەلەمنیۆم',
      description: `ئەم دەرگا تەوەرەییە سەرنجڕاکێشە دیمەنێکی ناوازە و شکۆدار بە دەروازەی سەرەکی ماڵەکان، بارەگای کۆمپانیاکان و بینا تایبەتەکان دەبەخشێت. بە مەکینەی تەوەرەیی ستوونی قورس دروستکراوە کە وا دەکات دەرگایەکی گەورە و بەهێز بە نەرمی و بە پەنجەیەک بخولێتەوە.\n\nتێکەڵکردنی تەختەی سروشتیی چارەسەرکراو لەگەڵ پەیکەری ئەلەمنیۆمی ئەستوور، عەزلێکی تەواو لە گەرمی، دەنگ، تۆز و تیشکی خۆر دابین دەکات. دیزاینەکەی بە دەسکێکی بەرزی ستوونی شیک و قوفڵی فرە-خاڵ تەواو کراوە.\n\nهەموو وردەکارییەکی بۆ بەردەوامی و مانەوەی درێژخایەن ئەندازیاری کراوە. دەروازەی چوونەژوورەوە دەکاتە شوێنێکی سەرنجڕاکێش کە ئاسایش، متمانە و فەخامەت بەیەکەوە کۆدەکاتەوە.`
    }
  },

  'door-dh-dr-51': {
    en: {
      name: 'Modern Entrance Door with Vertical Wood Paneling',
      description: `This contemporary main entrance door combines the organic warmth of vertical timber paneling with a precision-engineered dark architectural aluminum frame. Designed to suit upscale residences, executive offices, and reception lounges, it delivers an inviting yet refined first impression.\n\nBuilt with high-density thermal break insulation and heavy-duty European hinges, the door effectively seals interiors against temperature extremes, road noise, and dust. The flush-mounted finish and sleek vertical lines create a balanced, architectural aesthetic that complements modern facade materials.\n\nEquipped with secure multi-point deadbolt mechanisms and an integrated ergonomic pull bar, this door guarantees smooth daily operation and lasting peace of mind with minimal upkeep.`
    },
    ar: {
      name: 'باب مدخل عصري بشرائح خشبية رأسية وإطار ألمنيوم',
      description: `يجمع هذا الباب العصري بين دفء الخشب الطبيعي بشرائحه الرأسية الأنيقة وإطار الألمنيوم المعماري الداكن والمتين. صُمم ليلائم مداخل المنازل الحديثة والمكاتب التنفيذية وصالات الاستقبال، ليمنح المكان انطباعاً أولياً راقياً ومريحاً.\n\nمُزوّد بطبقات عزل حراري وصوتي عالية الكثافة ومفصلات أوروبية قوية، مما يضمن إغلاقاً محكماً يحجب الحرارة الخارجية والضوضاء والغبار. ينسجم تصميمه المتناسق بخطوطه الرأسية بنعومة مع مختلف الواجهات الحجرية والخرسانية الحديثة.\n\nيحتوي الباب على نظام أقفال أمان متعددة النقاط ومقبض طولي مريح، ليضمن استخداماً يومياً سلساً وأماناً تاماً يدوم لسنوات طويلة بأقل قدر من الصيانة.`
    },
    ckb: {
      name: 'دەرگای مدخەلی مۆدێرن بە تەختەی ستوونی و چوارچێوەی ئەلەمنیۆم',
      description: `ئەم دەرگایە سەرەکییە هاوچەرخە گەرمیی تەختەی سروشتی و پتەویی چوارچێوەی ئەلەمنیۆمی داپۆشراوی مۆدێرن کۆدەکاتەوە. گونجاوە بۆ دەروازەی ماڵە مۆدێرنەکان، ئۆفیسەکان و هۆڵەکانی پێشوازی، دیمەنێکی سەرنجڕاکێش و بەفەخامەت دروست دەکات.\n\nبە عازلی گەرمی و دەنگی کوالیتی بەرز و نەرمەی بەهێزی ئەوروپی دروستکراوە کە ڕێگری لە گەرمای هاوین، سەرمای زستان، تۆز و دەنگی دەرەوە دەکات. هێڵە ستوونییە ڕێکەکانی بە تەواوی لەگەڵ تەلارسازیی سەردەمدا دەگونجێن.\n\nبە سیستەمی قوفڵی ئەمنی فرە-خاڵ و دەسکی درێژی شیک دابین کراوە، بۆ بەخشینی کارکردنێکی ئاسان و متمانەپێکراو بۆ چەندین ساڵ.`
    }
  },

  'door-dh-dr-72': {
    en: {
      name: 'Contemporary Villa Entrance Door with Full-Height Sidelight',
      description: `This striking entrance door system features a full-height architectural glass sidelight that bathes interior foyers in natural daylight while maintaining secure, insulated protection. It is a favored choice for modern villas, company offices, and luxury residential projects.\n\nThe door leaf combines a reinforced thermal core with horizontal decorative reveals and a full-length architectural pull handle. The matching glass sidelight is engineered with heavy-duty safety glass, providing an open, spacious welcome without sacrificing energy efficiency or privacy.\n\nEngineered for exceptional durability against weather extremes, the system incorporates magnetic perimeter seals and multi-point perimeter locks, ensuring quiet operation, superior insulation, and dependable everyday security.`
    },
    ar: {
      name: 'باب مدخل فيلا عصري مع زجاج جانبي بكامل الارتفاع',
      description: `يتميز هذا النظام المتكامل لباب المدخل بوجود نافذة زجاجية جانبية بكامل الارتفاع تغمر بهو المدخل بالضوء الطبيعي مع الحفاظ على أعلى درجات الأمان والعزل. يُعد خياراً مثالياً للمنازل الحديثة ومكاتب الشركات والمشاريع السكنية الراقية.\n\nتجمع درفة الباب بين العزل الحراري المتقدم والخطوط الأفقية المعمارية الأنيقة ومقبض سحب رأسي فاخر. تم تزويد الواجهة الزجاجية الجانبية بزجاج أمان مزدوج عازل يمنح شعوراً بالاتساع والرحابة دون المساس بكفاءة الطاقة أو الخصوصية.\n\nصُمم النظام ليقاوم أقسى الظروف الجوية بفضل الجوانات المطاطية المحكمة وأنظمة الأقفال المتعددة النقاط، مما يوفر أداءً هادئاً وسلساً وأماناً مستمراً على مدار السنين.`
    },
    ckb: {
      name: 'دەرگای مدخەلی ڤێلا بە شوشەی درێژی تەنیشت و دیزاینی مۆدێرن',
      description: `ئەم سیستمە دەرگایە تایبەتمەندە بە بوونی پەنجەرەیەکی شووشەیی درێژ لە تەنیشتیەوە کە بە درێژایی ڕۆژ ڕووناکی سروشتی دەهێنێتە ناو هۆڵی پێشوازی بەبێ کەمکردنەوەی ئاستی ئاسایش و عەزل. هەڵبژاردنێکی زۆر گونجاوە بۆ ڤێلا هاوچەرخەکان و بارەگای کۆمپانیاکان.\n\nدەرگاکە لە پەیکەری ئەلەمنیۆمی بەهێزی عازل و هێڵە ئەندازەییەکان پێکهاتووە لەگەڵ دەسکی درێژی ستیلی شیک. شووشەی تەنیشتی بە شووشەی پارێزراوی دووجۆڕ دروستکراوە کە هەستی فراوانی و دڵڕفێنی بە شوێنەکە دەبەخشێت.\n\nبەرگەی هەموو کەشوهەوایەک دەگرێت بەهۆی بەربەستی لاستیکی موگناتیسی و قوفڵی فرە-خاڵ، ئاسایشی تەواو و کارکردنی نەرم و بێدەنگ بۆ ماڵەکەت دابین دەکات.`
    }
  }
};

// ── Systematic Unique Generation for Gates (door-dh-gt-...) ──────────────────

const gateIDs = [
  'door-dh-gt-02', 'door-dh-gt-06', 'door-dh-gt-14', 'door-dh-gt-15', 'door-dh-gt-17',
  'door-dh-gt-19', 'door-dh-gt-21', 'door-dh-gt-22', 'door-dh-gt-23', 'door-dh-gt-25',
  'door-dh-gt-27', 'door-dh-gt-29', 'door-dh-gt-32', 'door-dh-gt-33', 'door-dh-gt-34',
  'door-dh-gt-38', 'door-dh-gt-40', 'door-dh-gt-42', 'door-dh-gt-44', 'door-dh-gt-46',
  'door-dh-gt-48', 'door-dh-gt-50', 'door-dh-gt-52', 'door-dh-gt-53', 'door-dh-gt-54',
  'door-dh-gt-61', 'door-dh-gt-62', 'door-dh-gt-65', 'door-dh-gt-66', 'door-dh-gt-71',
  'door-dh-gt-73', 'door-dh-gt-74', 'door-dh-gt-77'
];

const gateSpecs = {
  'door-dh-gt-02': {
    titleEn: 'Modern Horizontal Slat Driveway Gate with Privacy Glass Panels',
    titleAr: 'بوابة خارجية عصرية بشرائح أفقية ولوحات زجاجية خاصة',
    titleCkb: 'دەروازەی مۆدێرن بە شریتی ئاسۆیی و شووشەی تایبەت',
    themeEn: 'clean horizontal aluminum slats with dual frosted glass accent panels',
    themeAr: 'شرائح الألمنيوم الأفقية المصقولة واللوحات الزجاجية المعمارية العازلة للرؤية',
    themeCkb: 'شریتە ئەلەمنیۆمە ئاسۆییەکان و لەوحە شووشەییە تەڵخەکان'
  },
  'door-dh-gt-06': {
    titleEn: 'Sliding Driveway Gate with Natural Warm Timber Accents',
    titleAr: 'بوابة سحابة خارجية بلمسات الخشب الطبيعي الدافئ',
    titleCkb: 'دەروازەی سلایدینگی دەرەوە بە دەستکاری تەختەی سروشتی',
    themeEn: 'seamless sliding operation accented by vertical warm teakwood inlays',
    themeAr: 'حركة السحب الانسيابية المطعمة بخشب التيك الطبيعي المعالج',
    themeCkb: 'جوڵەی سلایدینگی نەرم بە تەختەی تیکی سروشتی'
  },
  'door-dh-gt-14': {
    titleEn: 'Charcoal Aluminum Sliding Gate with Wood Finish Inlays',
    titleAr: 'بوابة سحابة بلون الفحم مع تطعيمات خشبية أنيقة',
    titleCkb: 'دەروازەی سلایدینگی ڕەنگی خەڵوزی بە نەخشی تەختە',
    themeEn: 'deep charcoal louvers integrated with rich architectural wood accents',
    themeAr: 'شرائح الألمنيوم الفحمية الداكنة المتناسقة مع التطعيمات الخشبية',
    themeCkb: 'شریتی ئەلەمنیۆمی ڕەنگی خەڵوزی لەگەڵ نەخشی داری شیک'
  },
  'door-dh-gt-15': {
    titleEn: 'Horizontal Slat Security Gate with Translucent Accent Panel',
    titleAr: 'بوابة أمان بشرائح أفقية مع لوح زجاجي مضيء',
    titleCkb: 'دەروازەی ئەمنیی بە شریتی ئاسۆیی و لەوحەی شووشەیی ڕووناک',
    themeEn: 'robust horizontal slats featuring a contemporary translucent glass reveal',
    themeAr: 'الشرائح الأفقية المتينة مع الفاصل الزجاجي المعماري الأنيق',
    themeCkb: 'شریتی ئاسۆیی بەهێز بە شووشەی تەلارسازیی مۆدێرن'
  },
  'door-dh-gt-17': {
    titleEn: 'Matte Black Aluminum Entrance Gate with Vertical Wood Accents',
    titleAr: 'بوابة مدخل ألمنيوم باللون الأسود المطفي مع تفاصيل خشبية',
    titleCkb: 'دەروازەی مدخەلی ئەلەمنیۆمی ڕەشی ماتی بە تەختەی ستوونی',
    themeEn: 'matte black structural aluminum contrasted by warm vertical wood siding',
    themeAr: 'الألمنيوم الأسود المطفي الفاخر مع الألواح الخشبية العمودية الدافئة',
    themeCkb: 'ئەلەمنیۆمی ڕەشی ماتی لەگەڵ تەختەی ستوونی گەرم'
  },
  'door-dh-gt-19': {
    titleEn: 'Sculptural Geometric Grid Entrance Gate with Integrated Lighting',
    titleAr: 'بوابة مدخل هندسية مجسمة مع مسارات إضاءة مدمجة',
    titleCkb: 'دەروازەی ئەندازەیی سەرنجڕاکێش بە ڕووناکیی لیدی ناوەکی',
    themeEn: 'dynamic angular grid framing with recessed architectural ambient lighting',
    themeAr: 'التصميم الهندسي الزاوي المجسم مع قنوات الإضاءة المخفية الدافئة',
    themeCkb: 'دیزاینی ئەندازەیی سەرنجڕاکێش بە کەناڵی ڕووناکیی شیک'
  },
  'door-dh-gt-21': {
    titleEn: 'Modern Matte Black Villa Gate with Polished Stainless Steel Inlays',
    titleAr: 'بوابة فيلا سوداء عصرية بخطوط الستانلس ستيل المصقول',
    titleCkb: 'دەروازەی ڤێلای ڕەشی مۆدێرن بە هێڵی ستیلی بریقەدار',
    themeEn: 'monolithic matte black panels accented by horizontal polished stainless steel',
    themeAr: 'الألواح السوداء المطفية الفاخرة المطرزة بخطوط الستانلس ستيل اللامعة',
    themeCkb: 'تەختەی ڕەشی مات بە هێڵە بریقەدارەکانی ستیلی دژە-ژەنگ'
  },
  'door-dh-gt-22': {
    titleEn: 'Sliding Driveway Gate with Horizontal Louvers and Matching Pedestrian Door',
    titleAr: 'بوابة سحابة للسيارات بشرائح أفقية مع باب مشاة متناسق',
    titleCkb: 'دەروازەی سلایدینگی ئۆتۆمبێل بە شریتی ئاسۆیی و دەرگای پیادە',
    themeEn: 'wide driveway sliding gate coordinated with a dedicated pedestrian entry door',
    themeAr: 'بوابة المركبات السحابة العريضة المرفقة بباب جانبي مستقل ومتناسق للمشاة',
    themeCkb: 'دەروازەی پان و گەورەی سلایدینگ لەگەڵ دەرگایەکی تەنیشتی تایبەت بە پیادە'
  },
  'door-dh-gt-23': {
    titleEn: 'Contemporary Matte Black Gate with Horizontal Viewport Windows',
    titleAr: 'بوابة سوداء عصرية بنوافذ رؤية أفقية مصنفرة',
    titleCkb: 'دەروازەی هاوچەرخی ڕەش بە پەنجەرەی بینینی ئاسۆیی',
    themeEn: 'clean minimalist black louvers punctuated by three horizontal viewports',
    themeAr: 'الشرائح السوداء الناعمة المزودة بثلاث نوافذ أفقية مصنفرة لرؤية راقية',
    themeCkb: 'شریتی ڕەشی مۆدێرن بە سێ پەنجەرەی ئاسۆیی تەڵخ'
  },
  'door-dh-gt-25': {
    titleEn: 'Architectural Dual-Panel Slat Gate for Vehicle and Pedestrian Access',
    titleAr: 'بوابة ألمنيوم معمارية متناسقة للمركبات والأفراد',
    titleCkb: 'دەروازەی ئەلەمنیۆمی تەلارسازی بۆ ئۆتۆمبێل و پیادە',
    themeEn: 'balanced composition of horizontal driveway slats and vertical pedestrian slats',
    themeAr: 'التناغم بين شرائح المركبات العريضة وباب الأفراد العمودي الأنيق',
    themeCkb: 'هاوسەنگی نێوان شریتی ئاسۆیی ئۆتۆمبێل و شریتی ستوونی پیادە'
  },
  'door-dh-gt-27': {
    titleEn: 'Double Swing Modern Gate with Stainless Steel Inlays and Long Pulls',
    titleAr: 'بوابة مزدوجة بدرفتين مع خطوط ستانلس ومقابض طولية فاخرة',
    titleCkb: 'دەروازەی جووت باڵی مۆدێرن بە نەخشی ستیل و دەسکی درێژ',
    themeEn: 'wide dual-swing configuration with inlaid metallic accents and heavy pulls',
    themeAr: 'التصميم المزدوج بدرفتين متناظرتين تزدانان بخطوط الستانلس والمقابض الطولية',
    themeCkb: 'دیزاینی جووت باڵی بەهێز بە نەخشی مێتاڵیک و دەسکی ستوونی شیک'
  },
  'door-dh-gt-29': {
    titleEn: 'Two-Tone Architectural Driveway Gate with Warm Center Wood Siding',
    titleAr: 'بوابة خارجية بدرجتين لونيتين مع كسوة خشبية وسطية',
    titleCkb: 'دەروازەی دوو-ڕەنگی دەرەوە بە تەختەی گەرمی ناوەڕاست',
    themeEn: 'graphite grey aluminum framing flanking warm vertical wood center cladding',
    themeAr: 'إطار الألمنيوم الرمادي الداكن المحيط بكسوة الخشب الطبيعي الوسطية الدافئة',
    themeCkb: 'ئەلەمنیۆمی ڕەساسی تۆخ لەگەڵ تەختەی سروشتیی گەرم لە ناوەڕاستدا'
  },
  'door-dh-gt-32': {
    titleEn: 'Sleek Minimalist Sliding Gate with Horizontal Panel Accents',
    titleAr: 'بوابة سحابة بتصميم بسيط وألواح ألمنيوم انسيابية',
    titleCkb: 'دەروازەی سلایدینگی سادە بە تەختەی ئەلەمنیۆمی نەرم',
    themeEn: 'seamless horizontal paneling delivering ultimate privacy and refined minimalism',
    themeAr: 'الألواح الأفقية الانسيابية التي توفر الخصوصية التامة بمظهر بسيط وأنيق',
    themeCkb: 'تەختەی ئاسۆیی نەرم کە تایبەتمەندی تەواو بە شێوازێکی سادە دابین دەکات'
  },
  'door-dh-gt-33': {
    titleEn: 'Luxury Estate Black Aluminum Gate with Side Pedestrian Access',
    titleAr: 'بوابة قصر سوداء فخمة مع باب مدخل جانبي للأفراد',
    titleCkb: 'دەروازەی کۆشکی ڕەشی شیک بە دەرگای تەنیشتی پیادە',
    themeEn: 'heavy-duty architectural black aluminum built for monumental residential portals',
    themeAr: 'هيكل الألمنيوم الأسود الثقيل المصمم للمداخل الفاخرة والقصور الراقية',
    themeCkb: 'پەیکەری ئەلەمنیۆمی قورسی ڕەش کە بۆ دەروازە گەورەکانی نیشتەجێبوون دروستکراوە'
  },
  'door-dh-gt-34': {
    titleEn: 'Double Swing Modern Villa Gate with Metallic Accent Reveal Lines',
    titleAr: 'بوابة فيلا مزدوجة بخطوط فاصلة فضية أنيقة',
    titleCkb: 'دەروازەی جووت باڵی ڤێلا بە هێڵی کانزایی جیاکەرەوە',
    themeEn: 'contemporary double-leaf swing gate accented by subtle silver geometric reveals',
    themeAr: 'الدرفتان المزدوجتان المزخرفتان بفواصل فضية هندسية تضفي عمقاً بصرياً',
    themeCkb: 'دوو باڵی هاوچەرخ کە بە هێڵی زیوی جوان نەخشێنراون'
  },
  'door-dh-gt-38': {
    titleEn: 'Minimalist Horizontal Slat Gate Integrated with Natural Stone Portals',
    titleAr: 'بوابة شرائح أفقية مدمجة بأناقة مع واجهات الحجر الطبيعي',
    titleCkb: 'دەروازەی شریتی ئاسۆیی کە بە جوانی لەگەڵ بەردی سروشتی دەگونجێت',
    themeEn: 'flush horizontal louvers tailored to mount within natural stone masonry portals',
    themeAr: 'الشرائح الأفقية المتناسقة المصممة لتتكامل بسلاسة مع بوابات الحجر الطبيعي',
    themeCkb: 'شریتە ئاسۆییەکان کە بە تەواوی لەگەڵ دەروازەی بەردی سروشتی یەکدەگرن'
  },
  'door-dh-gt-40': {
    titleEn: 'Charcoal Sliding Gate with Stainless Accent Strips and Glass Sidelight',
    titleAr: 'بوابة سحابة فحمية بشرائط ستانلس ونافذة زجاجية جانبية',
    titleCkb: 'دەروازەی سلایدینگی خەڵوزی بە شریتی ستیل و شووشەی تەنیشت',
    themeEn: 'deep charcoal sliding panels detailed with polished stainless lines and glass',
    themeAr: 'ألواح السحب بلون الفحم المطعمة بخطوط الستانلس اللامعة والزجاج الجانبي',
    themeCkb: 'لەوحەی سلایدینگی ڕەنگی خەڵوزی بە هێڵی ستیل و شووشەی جوان'
  },
  'door-dh-gt-42': {
    titleEn: 'Contoured Wave Privacy Gate with Dynamic Louver Geometry',
    titleAr: 'بوابة الخصوصية بتصميم موجي انسيابي وشرائح متتالية',
    titleCkb: 'دەروازەی تایبەتمەندی بە دیزاینی شەپۆلی نەرم',
    themeEn: 'dynamic wave-contoured louvers that provide complete privacy with artistic flair',
    themeAr: 'الشرائح المنحنية بانسيابية موجية توفر الخصوصية المطلقة بلمسة فنية مميزة',
    themeCkb: 'شریتە کەوانەییە شەپۆلییەکان کە پاراستنی بینین بە شێوازێکی هونەری دەبەخشن'
  },
  'door-dh-gt-44': {
    titleEn: 'Double Swing Gate with Natural Vertical Hardwood Slats and Black Frame',
    titleAr: 'بوابة مزدوجة بشرائح خشبية طبيعية وهيكل أسود متين',
    titleCkb: 'دەروازەی جووت باڵ بە داری سروشتی ستوونی و چوارچێوەی ڕەش',
    themeEn: 'warm vertical hardwood slats bordered by a robust matte black aluminum frame',
    themeAr: 'شرائح الخشب الصلب الطبيعي المعالج المحاطة بهيكل ألمنيوم أسود مطفي',
    themeCkb: 'تەختەی ڕەقی سروشتیی ستوونی بە چوارچێوەیەکی بەهێزی ڕەشی مات'
  },
  'door-dh-gt-46': {
    titleEn: 'Modern Sliding Driveway Gate with Wide Aluminum Panels',
    titleAr: 'بوابة سحاب عصرية بألواح ألمنيوم عريضة ومصمتة',
    titleCkb: 'دەروازەی سلایدینگی مۆدێرن بە لەوحەی پان و ئەستوور',
    themeEn: 'broad architectural aluminum panels engineered for heavy-duty smooth sliding',
    themeAr: 'ألواح الألمنيوم المعمارية العريضة المصممة لحركة سحب ناعمة وقوة استثنائية',
    themeCkb: 'لەوحە ئەلەمنیۆمییە پانەکان کە بۆ جوڵەیەکی نەرم و بەهێزی بێوێنە دروستکراون'
  },
  'door-dh-gt-48': {
    titleEn: 'Full Privacy Louvered Sliding Driveway Gate in Anthracite Grey',
    titleAr: 'بوابة سحابة بشرائح حماية خصوصية كاملة بلون رمادي أنثراسيت',
    titleCkb: 'دەروازەی سلایدینگی شریتی پارێزراوی تەواو بە ڕەنگی ئەنتراسیت',
    themeEn: 'angled privacy louvers blocking sightlines while permitting natural airflow',
    themeAr: 'الشرائح المائلة بزاوية هندسية تحجب الرؤية تماماً مع السماح بمرور الهواء',
    themeCkb: 'شریتە لارە ئەندازیارییەکان کە بینین دادەخەن بەڵام ڕێگە بە هەوا دەدەن'
  },
  'door-dh-gt-50': {
    titleEn: 'Modern Privacy Gate with Angled Louvers and Integrated Pedestrian Door',
    titleAr: 'بوابة خصوصية بشرائح مائلة وباب مشاة مدمج متناسق',
    titleCkb: 'دەروازەی مۆدێرن بە شریتی پارێزراو و دەرگای پیادەی یەکگرتوو',
    themeEn: 'coordinated angled louvers spanning both main vehicle gate and pedestrian entry',
    themeAr: 'الشرائح المائلة المتناسقة التي تمتد عبر بوابة المركبات وباب المشاة المدمج',
    themeCkb: 'شریتە پارێزراوە یەکگرتووەکان بەسەر دەروازەی ئۆتۆمبێل و دەرگای پیادەدا'
  },
  'door-dh-gt-52': {
    titleEn: 'Heavy-Duty Security Gate with Modern Translucent Window Grid',
    titleAr: 'بوابة أمان عالية التحمل بنوافذ زجاجية مضيئة وشبكة هندسية',
    titleCkb: 'دەروازەی ئەمنی بەهێز بە تۆڕی پەنجەرەی ڕووناک',
    themeEn: 'high-security structural panels detailed with a grid of frosted safety glass',
    themeAr: 'الألواح الإنشائية فائقة الأمان المطعمة بشبكة نوافذ زجاجية مصنفرة راقية',
    themeCkb: 'لەوحە ئەمنییە قورسەکان کە بە پەنجەرەی شووشەی سیکیوریتی نەخشێنراون'
  },
  'door-dh-gt-53': {
    titleEn: 'Wide Horizontal Slat Villa Gate with Frosted Architectural Glass Reveal',
    titleAr: 'بوابة فيلا بشرائح أفقية عريضة وفاصل زجاجي مصنفر',
    titleCkb: 'دەروازەی ڤێلا بە شریتی ئاسۆیی پان و شووشەی تەڵخی تەلارسازی',
    themeEn: 'bold wide horizontal slats complemented by an illuminated frosted glass insert',
    themeAr: 'الشرائح الأفقية العريضة المزينة بفاصل زجاجي مصنفر يمرر الضوء بأناقة',
    themeCkb: 'شریتی ئاسۆیی پان و بەهێز بە شووشەی تەڵخی تێپەڕێنەری ڕووناکی'
  },
  'door-dh-gt-54': {
    titleEn: 'High-Contrast Matte Black Gate Framed by Natural Marble Columns',
    titleAr: 'بوابة سوداء فاخرة بتباين معماري جذاب مع الأعمدة الرخامية',
    titleCkb: 'دەروازەی ڕەشی فەخامەت بە شێوازی جوان لەگەڵ ستوونی مەڕمەڕ',
    themeEn: 'deep matte black horizontal slats designed to contrast against light stone pillars',
    themeAr: 'الشرائح السوداء المطفية التي تشكل تبايناً معمارياً مبهراً مع الأعمدة الحجرية',
    themeCkb: 'شریتی ڕەشی ماتی کە دیمەنێکی سەرنجڕاکێش لەگەڵ ستوونی بەردی مەڕمەڕ دروست دەکات'
  },
  'door-dh-gt-61': {
    titleEn: 'Horizontal Privacy Gate with Warm Natural Wood Pedestrian Inlay',
    titleAr: 'بوابة خصوصية بشرائح أفقية داكنة وتطعيم خشبي لباب المشاة',
    titleCkb: 'دەروازەی شریتی ئاسۆیی تاریک بە دەرگای پیادەی تەختەی سروشتی',
    themeEn: 'sleek dark aluminum slats paired with a warm treated wood pedestrian portal',
    themeAr: 'شرائح الألمنيوم الداكنة المتناسقة مع باب الأفراد المكسو بالخشب الطبيعي الدافئ',
    themeCkb: 'شریتی ئەلەمنیۆمی تاریک لەگەڵ دەرگای پیادەی تەختەی سروشتیی گەرم'
  },
  'door-dh-gt-62': {
    titleEn: 'Double Swing Estate Gate with Mosaic Natural Wood and Metal Tiles',
    titleAr: 'بوابة قصر مزدوجة بتصميم فسيفسائي يجمع بين الخشب والمعدن',
    titleCkb: 'دەروازەی کۆشکی جووت باڵ بە مۆزاییکی تەختەی سروشتی و کانزا',
    themeEn: 'alternating tiles of treated natural timber and precision-anodized metal panels',
    themeAr: 'الألواح المتبادلة بين الخشب الطبيعي المعالج والألمنيوم المؤكسد فائق الفخامة',
    themeCkb: 'نەخشی مۆزاییکی تەختەی سروشتیی چارەسەرکراو و ئەلەمنیۆمی بەهێز'
  },
  'door-dh-gt-65': {
    titleEn: 'High-Security Vertical Slat Aluminum Gate with Integrated Access',
    titleAr: 'بوابة ألمنيوم أمنية بشرائح رأسية متقاربة مع باب دخول متكامل',
    titleCkb: 'دەروازەی ئەلەمنیۆمی ئەمنی بە شریتی ستوونی و دەرگای چوونەژوورەوە',
    themeEn: 'closely spaced vertical aluminum slats providing maximum privacy and strength',
    themeAr: 'الشرائح الرأسية المتراصة بدقة لتوفير أعلى درجات الحماية والخصوصية البصرية',
    themeCkb: 'شریتی ستوونی بەهێز و نزیک لەیەک بۆ بەرزترین ئاستی پاراستن و تایبەتمەندی'
  },
  'door-dh-gt-66': {
    titleEn: 'Modern Dark Sliding Gate with Integrated Sidelight Pedestrian Portal',
    titleAr: 'بوابة سحابة داكنة مع مدخل مشاة زجاجي معماري متناسق',
    titleCkb: 'دەروازەی سلایدینگی تاریک لەگەڵ دەرگای پیادەی شووشەیی شیک',
    themeEn: 'wide dark sliding panels with an adjacent full-height architectural glass pedestrian door',
    themeAr: 'ألواح السحب الداكنة العريضة المجاورة لباب مشاة زجاجي بكامل الارتفاع',
    themeCkb: 'لەوحەی سلایدینگی پان لەگەڵ دەرگایەکی تەنیشتی شووشەیی درێژ بۆ پیادە'
  },
  'door-dh-gt-71': {
    titleEn: 'Two-Tone Architectural Gate with Natural Timber and Slate Aluminum',
    titleAr: 'بوابة معمارية بتناغم الخشب الطبيعي والألمنيوم الرمادي',
    titleCkb: 'دەروازەی تەلارسازی بە تێکەڵەی تەختەی سروشتی و ئەلەمنیۆمی ڕەساسی',
    themeEn: 'harmonious split composition blending warm timber paneling with slate aluminum',
    themeAr: 'المزيج المعماري المتناسق بين ألواح الخشب الدافئة ومعدن الألمنيوم الرمادي الرصين',
    themeCkb: 'تێکەڵەیەکی تەلارسازیی جوان لەنێوان داری سروشتی و ئەلەمنیۆمی ڕەساسی تۆخ'
  },
  'door-dh-gt-73': {
    titleEn: 'Monolithic Matte Black Driveway Gate Framed by Stone Portals',
    titleAr: 'بوابة سوداء مصمتة فاخرة بإطار الأعمدة الحجرية المصقولة',
    titleCkb: 'دەروازەی ڕەشی بێ هێڵ بە چوارچێوەی بەردی پۆڵیشکراو',
    themeEn: 'solid monolithic matte black leaves designed to sit flush between polished pillars',
    themeAr: 'الدرف المصمتة باللون الأسود المطفي المصممة لتتوسط الأعمدة الحجرية الفخمة',
    themeCkb: 'دەرگای تەواو داپۆشراوی ڕەشی ماتی کە لەنێوان ستوونی بەردی شیکدا دادەنرێت'
  },
  'door-dh-gt-74': {
    titleEn: 'Architectural Gate with Laser-Cut Geometric Screens and Timber Framing',
    titleAr: 'بوابة معمارية بنقوش ليزر هندسية وإطار خشبي طبيعي',
    titleCkb: 'دەروازەی تەلارسازی بە نەخشی لێزەری ئەندازەیی و چوارچێوەی تەختە',
    themeEn: 'precision CNC laser-cut aluminum latticework framed by treated natural hardwood',
    themeAr: 'النقوش الهندسية المفرغة بقص الليزر عالي الدقة والمحاطة بإطار من الخشب الطبيعي',
    themeCkb: 'نەخشی ئەندازەیی بڕینی لەیزەری لەگەڵ چوارچێوەی تەختەی سروشتیی بەهێز'
  },
  'door-dh-gt-77': {
    titleEn: 'Vertical Louver Gate with Integrated Warm Ambient LED Light Channels',
    titleAr: 'بوابة شرائح رأسية معمارية مع قنوات إضاءة ليد دافئة متوهجة',
    titleCkb: 'دەروازەی شریتی ستوونی بە ڕووناکیی لیدی زەردی دڵڕفێن',
    themeEn: 'vertical architectural louvers illuminated by concealed weatherproof warm LED channels',
    themeAr: 'الشرائح الرأسية المعمارية المزودة بقنوات إضاءة ليد دافئة مخفية ومقاومة للعوامل الجوية',
    themeCkb: 'شریتی ستوونی سەرنجڕاکێش بە کەناڵی ڕووناکیی لیدی زەردی دژە-کەشوهەوا'
  }
};

// Fill in unique data for all gates
for (const gid of gateIDs) {
  const spec = gateSpecs[gid];
  if (!spec) continue;

  doorsData[gid] = {
    en: {
      name: spec.titleEn,
      description: `This premium architectural gate features ${spec.themeEn}, delivering an exceptional balance of security, privacy, and contemporary exterior elegance. Built from heavy-duty structural aluminum profiles with marine-grade powder coating, it withstands intense sunlight, sandstorms, and seasonal temperature swings without fading or corroding.\n\nIdeal for luxury villas, private estates, residential compounds, and corporate entryways, the gate can be configured for automated sliding or swing operation. Smooth, whisper-quiet motorization ensures effortless daily convenience, compatible with smart remote controls, intercoms, and keypad systems.\n\nEvery structural joint and weld is engineered for lifelong durability and low maintenance, ensuring your property entrance maintains its prestigious appearance and dependable security year after year.`
    },
    ar: {
      name: spec.titleAr,
      description: `تتميز هذه البوابة المعمارية الفاخرة بـ ${spec.themeAr}، مما يوفر توازناً استثنائياً بين الأمان والخصوصية والجمال الخارجي المعاصر. صُنعت من مقاطع ألمنيوم إنشائية متينة ومطلية بدهان حراري عالي الجودة يقاوم حرارة الصيف الشديدة والعواصف الرملية والرطوبة دون بهتان أو تآكل.\n\nتُعد خياراً مثالياً للفلل والقصور والمجمعات السكنية الراقية ومداخل الشركات، حيث يمكن تجهيزها للعمل بنظام السحب الآلي أو الفتح المزدوج السلس. تضمن المحركات الكهربائية الهادئة تشغيلاً سلساً ومريحاً يومياً، مع توافق كامل مع أجهزة التحكم الذكية والإنتركم.\n\nتم تنفيذ جميع التوصيلات والمفاصل الهيكلية بدقة فائقة لضمان المتانة الدائمة والاعتمادية الطويلة بأقل جهد صيانة، لتبقى واجهة مدخل عقارك رمزاً للفخامة والأمان الراسخ عبر السنين.`
    },
    ckb: {
      name: spec.titleCkb,
      description: `ئەم دەروازە نژیاروانییە سەرنجڕاکێشە بە ${spec.themeCkb} تایبەتمەندە، کە هاوسەنگییەکی نایاب لەنێوان ئاسایش، تایبەتمەندی و جوانیی دەرەوەی هاوچەرخدا دابین دەکات. لە ئەلەمنیۆمی ئەستوور و بۆیەی گەرمی کوالیتی بەرز دروستکراوە کە بەرگەی تیشکی توندی خۆر، تۆز و گۆڕانی کەشوهەوا دەگرێت بێ ئەوەی تێکبچێت.\n\nهەڵبژاردنێکی نایابە بۆ ڤێلا، کۆشک، کۆمەڵگە نیشتەجێبوونەکان و بارەگای کۆمپانیاکان، و دەکرێت بە سیستەمی سلایدینگی کارەبایی یان جووت باڵی نەرم دابنرێت. مەکینەی کارەبایی بێدەنگ کارکردنی ڕۆژانەی زۆر ئاسان دەکات لەگەڵ کۆنتڕۆڵی دووری و ئینتەرکۆم.\n\nهەموو جومگە و بەستەرەکان بە وردی بۆ بەردەوامی و تەمەنی درێژ ئەندازیاری کراون بە کەمترین پێویستی بە چاککردنەوە، تا دەروازەی ماڵەکەت هەمیشە وەک هێمایەکی فەخامەت و ئاسایش بمێنێتەوە.`
    }
  };
}

// ── Apply updates to database ────────────────────────────────────────────────

let count = 0;
for (const [id, data] of Object.entries(doorsData)) {
  const idx = db.findIndex(p => p.id === id);
  if (idx === -1) {
    console.log('Product not found in db:', id);
    continue;
  }

  const p = db[idx];
  p.name = data.en.name;
  p.description = data.en.description;
  p.arabicName = data.ar.name;
  p.arabicDescription = data.ar.description;
  p.kurdishName = data.ckb.name;
  p.kurdishDescription = data.ckb.description;

  if (!p.translations) p.translations = {};
  if (!p.translations.en) p.translations.en = {};
  if (!p.translations.ar) p.translations.ar = {};
  if (!p.translations.ckb) p.translations.ckb = {};

  p.translations.en.name = data.en.name;
  p.translations.en.description = data.en.description;
  p.translations.ar.name = data.ar.name;
  p.translations.ar.description = data.ar.description;
  p.translations.ckb.name = data.ckb.name;
  p.translations.ckb.description = data.ckb.description;

  db[idx] = p;
  count++;
}

fs.writeFileSync(CMS_PATH, JSON.stringify(db, null, 2), 'utf8');
console.log(`Successfully updated ${count} doors in ${CMS_PATH}`);
