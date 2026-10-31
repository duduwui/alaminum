const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const detailedProducts = {
  "prod-1793466818013": {
    name: "Architectural Pivot Aluminum Entrance Door with Integrated Vertical Pull Handle",
    arabicName: "باب فيلا محوري فاخر من الألمنيوم المعماري بمقبض طولي مدمج وتصميم هندسي",
    ckbName: "دەرگای سەرەکی ڤێلای مۆدێرن بە دەسکەوانەی درێژ و دیزاینی ئەندازیاری",
    description: "Architectural pivot aluminum entrance door engineered for luxury residences and modern villas. Built from structural-grade extruded aluminum profiles with superior weather and scratch resistance.\n\nFeatures a high-precision hydraulic pivot hinge mechanism, integrated full-height pull handle, and multi-point perimeter security locking system.\n\nDelivers exceptional thermal and acoustic insulation with timeless contemporary aesthetics.",
    arabicDescription: "باب رئيسي فاخر مصمم للفلل والمداخل المعمارية الراقية، يجمع بين متانة قطاعات الألمنيوم المعالجة حرارياً والمقاومة للخدش والظروف الجوية القاسية.\n\nمزود بنظام دوران محوري هيدروليكي فائق النعومة، مع مقبض طولي مدمج وأقفال أمان متعددة النقاط توفر أعلى درجات الحماية والعزل الحراري والصوتي.\n\nتصميم هندسي بديع يمنح واجهة منزلك إطلالة فخمة وحضوراً استثنائياً يدوم طويلاً دون الحاجة إلى صيانة مستمرة.",
    ckbDescription: "دەرگایەکی سەرەکی شاهانە بۆ ڤێلا و باڵەخانە مۆدێرنەکان، لە ئەلەمنیۆمی بەهێز دروستکراوە کە بەرگەی هەموو جۆرە کەشوهەوایەک دەگرێت.\n\nخاوەن سیستەمی خولانەوەی تەوەرەیی نەرم و دەسکەوانەی ئەندازیاری درێژ، بە قفڵی پێشکەوتووی چەند خاڵی کە سەلامەتی و ئارامی تەواو دابین دەکات.\n\nعازلی دەنگ و گەرمای هەیە و دیمەنێکی بێهاوتا و ناوازە بە دەروازەی ماڵەکەت دەبەخشێت.",
    category: "doors",
    division: "doors",
    image: "/uploads/b136078c-e8f4-43cd-869a-ad1de83fec12.jpg",
    fallbackImage: "/uploads/b136078c-e8f4-43cd-869a-ad1de83fec12.jpg"
  },
  "prod-1793466754617": {
    name: "Curtain Wall Skylight FC 50 System with Double Laminated Insulated Glass",
    arabicName: "نظام سكاي لايت كيرتن وول إف سي 50 بزجاج عازل مصفح مزدوج",
    ckbName: "سیستەمی سەربانی شووشەیی و ڕووکاری کیرتن ۆڵ FC 50 بە جامی دوو قاتی لامینەیت",
    description: "Architectural curtain wall skylight system utilizing the heavy-duty FC 50 structural mullion profile series. Specifically engineered for sloped roofs, atriums, and grand glass canopies.\n\nGlazed with double laminated insulated safety glass units that reject solar heat and UV radiation while delivering robust structural safety and absolute watertightness.\n\nProvides boundless daylight and high thermal efficiency for luxury villas and prestigious commercial complexes.",
    arabicDescription: "نظام هندسي متكامل للسكاي لايت والقباب الزجاجية الإنشائية بنظام كيرتن وول إف سي 50 عالي المتانة. صمم خصيصاً للأسقف والواجهات المائلة لضمان تصريف مياه الأمطار بكفاءة وعزل حراري فائق.\n\nيحتوي على زجاج مزدوج مصفح ومفرغ يمنع تسرب الحرارة والأشعة فوق البنفسجية ويقاوم الصدمات والضغط الجوي، مدعوماً بهيكل ألمنيوم إنشائي صلب مع قواطع عازلة محكمة.\n\nيغمر المساحات الداخلية بإضاءة طبيعية ساحرة وممتدة مع ضمان الأمان التام والحماية الشاملة من العواصف والتسريبات لسنوات طويلة.",
    ckbDescription: "سیستەمێکی تەلارسازی پێشکەوتووی سەربانی شووشەیی کیرتن ۆڵ FC 50 بە جامی دەبڵی لامینەیتی پارێزراو بۆ دابینکردنی ڕووناکی سروشتی بێ سنوور.\n\nبە پرۆفایلی بەهێزی ئەلەمنیۆم و عازلی تەواوی باران و گەرما دروستکراوە کە ڕێگری تەواو لە چوونەژوورەوەی گەرما و تیشکی زیانبەخشی خۆر دەکات.\n\nشێوازێکی مۆدێرن و شکۆدار بە هۆڵ و باڵەخانە و ڤێلا دەبەخشێت بە بەرزترین ئاستی سەلامەتی و متمانە.",
    category: "windows",
    division: "windows",
    image: "/uploads/2c41a8b1-69c9-4580-828a-c929e3cc5bcc.mp4",
    fallbackImage: "/uploads/2c41a8b1-69c9-4580-828a-c929e3cc5bcc.poster.jpg"
  },
  "prod-1793466704980": {
    name: "Structural Curtain Wall Glazing System for High-Span Facades & Insulated Domes",
    arabicName: "نظام كيرتن وول إنشائي للواجهات الزجاجية الشاهقة والقباب السماوية العازلة",
    ckbName: "سیستەمی ڕووکاری بینا و قوبەی شووشەیی کیرتن ۆڵی عازل",
    description: "Structural curtain wall facade glazing system engineered for large glass facades and geometric atriums. Crafted with high-grade aluminum mullions and thermally separated transoms.\n\nProvides exceptional acoustic attenuation and wind-load endurance, preventing energy loss in both hot summers and harsh winters.\n\nEnables dramatic open views and luminous spaces for distinguished architectural projects.",
    arabicDescription: "واجهات زجاجية هيكلية عازلة تجمع بين قطاعات الألمنيوم الإنشائية المتطورة والزجاج الحراري المزدوج المفرغ، مخصصة للمباني الحديثة والواجهات المرتفعة.\n\nتتميز بقدرة فائقة على مقاومة ضغوط الرياح العاتية وتوفير أعلى معايير العزل الصوتي والحراري لمنع هدر الطاقة والمحافظة على اعتدال درجات الحرارة الداخلية.\n\nتتيح تصاميم معمارية مرنة تشمل الواجهات المستمرة والقباب السماوية البانورامية بلمسات جمالية راقية تعزز القيمة الجمالية للعقار.",
    ckbDescription: "ڕووکاری شووشەیی پێکهاتەیی بەهێز بۆ باڵەخانە بەرزەکان و ڤێلا مۆدێرنەکان بە پرۆفایلی ئەلەمنیۆمی ئەندازیاری و جامی دوو قاتی عازل.\n\nبەرگرییەکی بێ وێنەی هەیە لە بەرامەر زریان و پەستانی با و باشترین پارێزەری وزەیە بە هێشتنەوەی کەشێکی فێنک و ئارام لە ژوورەوە.\n\nدیمەنێکی دڵڕفێنی پانۆڕامی پێشکەش دەکات کە تیشکی ڕۆژ بە جوانی دەگوازێتەوە ناو باڵەخانەکە.",
    category: "windows",
    division: "windows",
    image: "/uploads/5ba1a871-1b71-4e49-9b7e-d2b466c97ff9.mp4",
    fallbackImage: "/uploads/5ba1a871-1b71-4e49-9b7e-d2b466c97ff9.poster.jpg"
  },
  "prod-1793466579185": {
    name: "Panoramic Curtain Wall Glazing Facade with Integrated Concealed Ventilation",
    arabicName: "واجهة زجاجية بانورامية بنظام كيرتن وول مع وحدات تهوية مخفية متكاملة",
    ckbName: "ڕووکاری شووشەیی کیرتن ۆڵ بە پەنجەرەی هەواگۆڕکێی شاراوە",
    description: "Architectural curtain wall glazing featuring seamlessly integrated concealed vents that preserve exterior profile lines without visible sash frames.\n\nEquipped with triple-barrier EPDM weather gaskets, thermal break barriers, and solar-control double glazing for superior comfort.\n\nBlends high functionality with visual minimalism for premier commercial and residential architecture.",
    arabicDescription: "حل معماري متطور يدمج بين الواجهات الزجاجية المستمرة وفتحات التهوية المخفية التي تحافظ على تناسق الخطوط البصرية للواجهة الخارجية دون تشويه.\n\nيحتوي على فواصل عازلة حرارياً ومطاط إحكام ثلاثي يضمن عدم تسرب الهواء أو الغبار، مع زجاج عاكس ومظلل يوفر الخصوصية والراحة البصرية.\n\nتوزيع متوازن للهواء النقي وإطلالة زجاجية مفتوحة تلبي متطلبات الفلل العصرية والمكاتب الفخمة بأعلى مقاييس الجودة.",
    ckbDescription: "سیستەمێکی پێشکەوتووی کیرتن ۆڵ کە ڕووکاری شووشەیی و پەنجەرەی هەواگۆڕکێی شاراوە تێکەڵ دەکات بەبێ تێکدانی هێڵە جوانەکانی بیناکە.\n\nخاوەن تایبەتمەندی تەواوی عازلکردنە بەرامبەر تۆز و هەوا، بە جامی پەردەدار و تایبەت کە ڕێگری لە گەرمی دەکات و نهێنی دەپارێزێت.\n\nهەوایەکی پاک و نوێ بۆ ژوورەوە دەهێنێت و هەستێکی فراوان و ڕووناکی بێ سنور دەبەخشێت.",
    category: "windows",
    division: "windows",
    image: "/uploads/6c87490f-dc0b-45eb-a6e6-25d51083071b.mp4",
    fallbackImage: "/uploads/6c87490f-dc0b-45eb-a6e6-25d51083071b.poster.jpg"
  },
  "prod-1793466567022": {
    name: "Architectural Tilt & Turn Thermal Break Window System",
    arabicName: "نوافذ ألمنيوم قلاب وسحاب بأنظمة إغلاق متعددة النقاط وعزل فائق",
    ckbName: "پەنجەرەی ئەلەمنیۆمی دوو ئاڕاستەیی بە عازلی بەهێزی دەنگ و کەشوهەوا",
    description: "European-engineered tilt-and-turn thermal break aluminum window system providing dual-action inward swing and tilt ventilation.\n\nConstructed with high-insulation polyamide thermal struts and double-glazed low-emissivity glass to keep living areas quiet and cool.\n\nFitted with robust German multi-point perimeter gear hardware ensuring smooth operation and airtight closure.",
    arabicDescription: "نظام نوافذ ألمنيوم متطور يعمل بنظام الفتح المزدوج للداخل والقلاب العلوي، ليوفر تهوية آمنة وسهولة فائقة في الاستخدام والتنظيف.\n\nمصنع من سبائك الألمنيوم المعالجة حرارياً مع مقاطع كسر حراري عازلة تمنع انتقال الحرارة والصوت، وزجاج مزدوج عالي النقاوة.\n\nمزود بإكسسوارات ومقابض ألمانية أصلية تضمن إحكام الإغلاق ومقاومة التآكل لسنوات طويلة من الأداء الموثوق.",
    ckbDescription: "پەنجەرەی ئەلەمنیۆمی پێشکەوتوو بە جوڵەی دوو ئاراستەیی کە دەکرێتەوە و لەسەرەوەش لار دەبێتەوە بۆ هەواگۆڕکێی پارێزراو.\n\nبە ئەلەمنیۆمی کواڵێتی بەرز و عازلی پۆلیئەمید دروستکراوە کە پێش بە دزەکردنی گەرما و ژاوەژاو دەگرێت.\n\nدەسکەوانە و کەرەستەی ئەڵمانی ئەسڵی لەسەرە کە بەکارهێنانی ئاسان و تەمەن درێژی بۆ مسۆگەر دەکات.",
    category: "windows",
    division: "windows",
    image: "/uploads/9a5432d9-7c39-46d1-9447-71be2828c820.mp4",
    fallbackImage: "/uploads/9a5432d9-7c39-46d1-9447-71be2828c820.poster.jpg"
  },
  "prod-1793466556935": {
    name: "Heavy-Duty Lift & Slide Thermal Aluminum Patio Window System",
    arabicName: "نظام نوافذ وأبواب سحاب ذات رفع هيدروليكي عازل للرياح والأمطار",
    ckbName: "سیستەمی دەرگا و پەنجەرەی بەرزکەرەوەی سلاید بە عازلی تەواوی باران و با",
    description: "High-performance lift-and-slide thermal architectural sliding system engineered for oversized glass leaves with effortless glide mechanics.\n\nThe mechanism raises the sash onto precision ball-bearing rollers when moving, then lowers and seals firmly against perimeter gaskets when locked.\n\nDelivers unmatched weather tightness, acoustic silencing, and panoramic floor-to-ceiling connectivity.",
    arabicDescription: "نظام سحاب هيدروليكي فاخر يرفع الدرفة عند التحريك وينزلها عند التوقف لترتكز على جوانات الإحكام المطاطية، مما يوفر عزلاً تاماً ضد الماء والهواء.\n\nيتيح فتح درفات زجاجية ضخمة وثقيلة الوزن بحركة انسيابية خفيفة بلمسة يد واحدة، ليفتح صالاتك على الحدائق الخارجية بإطلالة بانورامية لا تنقطع.\n\nهيكل ألمنيوم متين معالَج بأرقى الدهانات البودرة المقاومة لأشعة الشمس والخدوش، مع زجاج أمان مزدوج عازل للطاقة.",
    ckbDescription: "سیستەمێکی بەهێزی سلایدی بەرزکەرەوە کە لە کاتی جوڵاندا باڵەکە بەرز دەکاتەوە و لە کاتی وەستاندا دادەبەزێت بۆ داخستنێکی مۆربوو.\n\nڕێگە دەدات بە جوڵاندنی جامی گەورە و قورس بە پەنجەیەک و بە بێدەنگی تەواو، بۆ کردنەوەی ژوورەکان بەڕووی باخچەدا.\n\nڕووپۆشی دژە ژەنگ و جامی دەبڵی عازلی هەیە کە بەهایەکی مەزن بە هەر پڕۆژەیەک دەبەخشێت.",
    category: "windows",
    division: "windows",
    image: "/uploads/e04af174-e43b-4143-8fb5-187111d2870a.mp4",
    fallbackImage: "/uploads/e04af174-e43b-4143-8fb5-187111d2870a.poster.jpg"
  },
  "prod-1793466548476": {
    name: "Motorized Architectural Automated Vent Glazing System",
    arabicName: "نوافذ زجاجية ذكية بمحركات كهربائية مدمجة للتهوية الأوتوماتيكية",
    ckbName: "پەنجەرەی شووشەیی زیرەک بە ماتۆڕی کارەبایی بۆ هەواگۆڕکێی خۆکار",
    description: "Motorized smart window system integrated with concealed linear chain actuators for automated ventilation and high-reach roof glazed modules.\n\nOperates via handheld remote controls, wall switches, or automated climatic rain and wind sensors for smart-home enabled comfort.\n\nConstructed from thermally broken aluminum profiles with double safety glass for total peace of mind.",
    arabicDescription: "نظام نوافذ متطور مدعوم بمحركات كهربائية خطية مخفية تتيح فتح وإغلاق النوافذ المرتفعة والسكاي لايت عبر جهاز التحكم أو حساسات الطقس والمطر.\n\nيوفر تهوية طبيعية ذكية للمباني والفلل مع إمكانية الربط بأنظمة الأتمتة والتحكم الذكي، مع الحفاظ على عزل محكم عند الإغلاق التام.\n\nمقاطع ألمنيوم كسر حراري عازلة وزجاج مزدوج مقسى يضمن راحة البال وأمان المنشأة في شتى الظروف المناخية.",
    ckbDescription: "پەنجەرەی ئەندازیاری زیرەک بە ماتۆڕی کارەبایی شاراوە کە بە کۆنتڕۆڵ یان هەستەوەری باران و با بە ئۆتۆماتیکی دەکرێتەوە و دادەخرێت.\n\nگونجاوە بۆ پەنجەرە بەرزەکان و سەقفی شووشەیی بۆ دەستەبەرکردنی هەواگۆڕکێی ئاسان و پارێزراو.\n\nخاوەن ئەلەمنیۆمی بەهێز و جامی سکوریتی دوو قاتە کە لە کاتی داخستندا عازلێکی تەواو دروست دەکات.",
    category: "windows",
    division: "windows",
    image: "/uploads/12160f32-5f93-429b-839e-e3a5bfe7ee8b.mp4",
    fallbackImage: "/uploads/12160f32-5f93-429b-839e-e3a5bfe7ee8b.poster.jpg"
  },
  "prod-1793466539959": {
    name: "Continuous Mullion Architectural Curtain Wall Facade Glazing",
    arabicName: "نظام واجهات ونوافذ كيرتن وول مستمرة للمباني والفلل الحديثة",
    ckbName: "سیستەمی ڕووکار و پەنجەرەی کیرتن ۆڵی یەکگرتوو بۆ باڵەخانە و ڤێلا",
    description: "Continuous architectural mullion curtain wall facade system designed for soaring glazed elevations and seamless floor-to-ceiling envelope integration.\n\nIncorporates high-performance thermal breaks and solar-reflective insulated glazing to drastically reduce cooling loads.\n\nElevates contemporary buildings with sleek lines and panoramic exterior sightlines.",
    arabicDescription: "نظام واجهات زجاجية هيكلية بنظام المقاطع المستمرة التي تمنح المبنى واجهة زجاجية متصلة من الأرض إلى السقف دون فواصل جدارية سميكة.\n\nمصمم لتقليل امتصاص الحرارة والضوضاء الخارجية عبر حواجز حرارية متقدمة وزجاج مزدوج مفرغ يعكس أشعة الشمس الحارقة.\n\nيضفي على الفلل والمجمعات المعمارية لمسة من الفخامة العصرية وتناسقاً استثنائياً يلبي تطلعات التصميم المعماري الحديث.",
    ckbDescription: "سیستەمێکی پێکهاتەیی شووشەیی کە تەواوی بەرزی نهۆمەکان دادەپۆشێت و دیمەنێکی مۆدێرن و یەکپارچە دروست دەکات.\n\nبە عازلی پێشکەوتووی گەرمی و دەنگ پڕکراوەتەوە کە بە تەواوی ئاسوودەیی ناو ماڵ دەپارێزێت و تێچووی وزە کەم دەکاتەوە.\n\nگونجاوە بۆ ڤێلای مۆدێرن و شوێنی بازرگانی بەرز و شیاو.",
    category: "windows",
    division: "windows",
    image: "/uploads/7b355ad3-8269-4b13-8b0d-b6917b519053.mp4",
    fallbackImage: "/uploads/7b355ad3-8269-4b13-8b0d-b6917b519053.poster.jpg"
  },
  "prod-1793466514591": {
    name: "High-Performance Acoustic & Thermal Insulated Aluminum Window",
    arabicName: "نوافذ ألمنيوم حرارية عازلة للصوت والحرارة بزجاج مزدوج منخفض الانبعاث",
    ckbName: "پەنجەرەی ئەلەمنیۆمی فرە عازل بە جامی دەبڵی پارێزەر لە گەرمی",
    description: "Acoustically tuned thermal break aluminum window system engineered with wide polyamide insulation struts.\n\nPaired with argon-filled low-E insulated glass units to eliminate condensation, block traffic noise, and reduce thermal transmittance.\n\nOffers smooth operation, long-lasting surface finishes, and dependable weather tightness.",
    arabicDescription: "نوافذ معمارية فائقة العزل مصممة لتوفير بيئة داخلية هادئة ومريحة، بفضل استخدام قطاعات ألمنيوم معزولة حرارياً بطبقات بولياميد عريضة.\n\nمزودة بزجاج مزدوج مفرغ من الغاز العازل يمنع التكثف ويقلل من نفاذ الضجيج الخارجي وحرارة الصيف وبرودة الشتاء بنسبة استثنائية.\n\nتتميز بتشطيبات سطحية فاخرة تدوم طويلاً مع أنظمة قفل محكمة تحافظ على ثبات العزل على مدار العام.",
    ckbDescription: "پەنجەرەی ئەلەمنیۆمی تەلارسازی بە عازلی بەهێزی دەنگ و کەشوهەوا، خاوەن بەربەستی پۆلیئەمیدی عازل لە نێوان چینەکاندا.\n\nجامی دەبڵی تایبەتی هەیە کە ڕێگری لە هاتنی دەنگی شەقام و گەرمای بەتین دەکات و پلەی گەرمی ژوور بە جێگیری دەهێڵێتەوە.\n\nڕەنگ و ڕووپۆشی جێگیرە و بە کەرەستەی ئەوروپی پتەو دروستکراوە.",
    category: "windows",
    division: "windows",
    image: "/uploads/60769879-2da9-45f6-831d-1c3e928fa907.mp4",
    fallbackImage: "/uploads/60769879-2da9-45f6-831d-1c3e928fa907.poster.jpg"
  },
  "prod-1793466496953": {
    name: "Precision-Engineered Architectural Aluminum Profile Glazing System",
    arabicName: "قطاعات نوافذ ألمنيوم معمارية فائقة الدقة بلمسات نهائية مقاومة للخدش",
    ckbName: "پڕۆفایلی ئەلەمنیۆمی ئەندازیاری ورد بە ڕووپۆشی دژە ژەنگ و ڕووشان",
    description: "Precision architectural aluminum profiles engineered for contemporary window systems and expansive glazed apertures.\n\nTreated with high-durability electrostatic powder coating and anodized finishes that resist abrasion, UV degradation, and fading.\n\nCombines structural strength with refined minimalism for modern building designs.",
    arabicDescription: "منظومة مقاطع ألمنيوم هندسية معمارية مخصصة للنوافذ والفتحات الزجاجية الواسعة، تمتاز بدقة التصنيع ومتانة الزوايا الملحومة والمثبتة ميكانيكياً.\n\nمعالجة بطبقات أكسدة أنودية وبودرة إلكتروستاتيكية تقاوم الخدوش والأشعة فوق البنفسجية وتغير الألوان في المناخات الجافة والحارة.\n\nتمنح المشاريع السكنية والتجارية تصميماً موحداً وعصرياً يجمع بين القوة الإنشائية وخفة الوزن والجاذبية البصرية.",
    ckbDescription: "پڕۆفایلی ئەندازیاری پێشکەوتوو بۆ پەنجەرە و دەرگای شووشەیی بە کوالیتی بەرز و وردی لە بڕین و بەستنەوەدا.\n\nڕووپۆشکراوە بە تەکنەلۆژیای پۆودەر کۆتینگ کە دژە تیشکی خۆر و ڕووشانە و ڕەنگەکەی ساڵانێکی زۆر وەک خۆی دەمێنێتەوە.\n\nهێز و جوانی بە شێوەیەکی هاوسەنگ لە هەموو شوێنێکی بیناکەدا دەردەخات.",
    category: "windows",
    division: "windows",
    image: "/uploads/6ae818ad-7a83-40bd-b038-f5784947ecaa.mp4",
    fallbackImage: "/uploads/6ae818ad-7a83-40bd-b038-f5784947ecaa.poster.jpg"
  },
  "prod-1793466466381": {
    name: "Heavy-Duty Impact-Resistant Architectural Glass Railing System",
    arabicName: "حواجز درابزين وشرفات زجاجية ذات أمان عال ومقاومة للصدمات",
    ckbName: "حاجزی شووشەیی بەهێز بۆ باڵکۆن و شرفە بە پارێزگاری بەرز",
    description: "Architectural glass balustrade and terrace railing system constructed with impact-resistant laminated tempered safety glass panels.\n\nAnchored with heavy-duty aluminum base channels or stainless steel mounting adapters for uninterrupted transparent sightlines.\n\nEngineered to meet stringent safety loads for balconies, roof terraces, and staircases in luxury homes.",
    arabicDescription: "حواجز شرفات ودربزينات زجاجية مصنعة من زجاج مصفح مقسى مزدوج عالي الأمان ومقاوم للصدمات والرياح العاتية.\n\nتثبت بقواعد ألمنيوم إنشائية مدمجة أو حوامل نقطية من الفولاذ المقاوم للصدأ، مما يمنح إطلالة مفتوحة دون أي عوائق بصرية.\n\nمثالية للشرفات والأسطح والتراسات والسلالم في الفلل والقصور، مع ضمان أعلى معايير السلامة الإنشائية للعائلة.",
    ckbDescription: "حاجزی شووشەیی سکوریتی بەهێز بۆ باڵکۆن، شرفە و قادرمە، بە بەرگری تەواو بەرامەر زەبر و فشاری با.\n\nبە بنکەی ئەلەمنیۆمی شاراوە یان ستیلی دژە ژەنگ دادەمەزرێت بۆ پاراستنی دیمەنی ڕوون و سەلامەتی تەواوی خێزان.\n\nتای تەراسی ڤێلا و باڵەخانەکان جوان دەکات بە دیزاینێکی سەرنجڕاکێش و سەردەمییانە.",
    category: "shorfa",
    division: "shorfa",
    image: "/uploads/d0b8b088-81b7-450d-af47-eaa8534807dd.mp4",
    fallbackImage: "/uploads/d0b8b088-81b7-450d-af47-eaa8534807dd.poster.jpg"
  },
  "prod-1793466455226": {
    name: "Multi-Track Architectural Sliding Glass Wall System",
    arabicName: "نظام نوافذ زجاجية سحاب متعددة المسارات للمساحات العريضة والحدائق",
    ckbName: "پەنجەرەی سلایدی چەند ڕێڕەوە بۆ ڕووبەری فراوان و باخچە",
    description: "Multi-track architectural sliding window and door system engineered for wide-span indoor-outdoor transitions.\n\nFeatures ultra-low flush floor thresholds for barrier-free access and heavy-duty stainless steel carriage rollers for whisper-quiet glide.\n\nEquipped with multi-stage weather stripping for dependable seal against severe desert winds and rain.",
    arabicDescription: "نظام نوافذ وأبواب سحاب بمسارات متعددة يتيح فتح مساحات عريضة ودمج الصالات الداخلية بالحدائق والتراسات الخارجية بكل سلاسة.\n\nمزود بمجاري سفلية منخفضة الارتفاع تسهل الحركة دون عوائق، وعجلات انزلاق مصنوعة من الفولاذ المقاوم للصدأ لحركة خفيفة وهادئة تماماً.\n\nعزل متقن ضد الأتربة والرياح والأمطار بفضل أنظمة الفرش العازلة وأختام الإحكام متعددة الطبقات.",
    ckbDescription: "سیستەمی پەنجەرە و دەرگای سلایدی چەند هێڵە بۆ ڕووبەری پان و فراوان کە ژوورەکان بە باخچەوە دەبەستێتەوە بە ئاسانی.\n\nهێڵی خوارەوەی نزیکە لە زەوی بۆ ئەوەی ڕێگری لە هاتوچۆ نەکات، و بە تایەی ستیل بە نەرمی و بێ دەنگ دەجوڵێت.\n\nڕێگرییەکی تۆکمە لە تۆز و با و باران دەکات بۆ پاراستنی ماڵەکەت لە هەموو وەرزەکاندا.",
    category: "windows",
    division: "windows",
    image: "/uploads/2c3134d8-5c25-4af2-8612-0ad3df19758b.mp4",
    fallbackImage: "/uploads/2c3134d8-5c25-4af2-8612-0ad3df19758b.poster.jpg"
  },
  "prod-1793466435882": {
    name: "Ultra-Slim Insulated Sliding Window System for Panoramic Living Spaces",
    arabicName: "نظام نوافذ سحاب بانورامية عازلة بقطاعات ألمنيوم نحيفة للقصور والفلل",
    ckbName: "سیستەمی پەنجەرەی سلایدی پانۆڕامی عازل بە چوارچێوەی ئەلەمنیۆمی باریک",
    description: "Minimalist slim-profile thermal sliding window system engineered for expansive natural views and abundant daylight.\n\nIncorporates advanced polyamide thermal breaks and low-E double glazing for peak energy conservation.\n\nOffers silent sliding motion with integrated multi-point locking for refined architectural residences.",
    arabicDescription: "نوافذ سحاب معمارية بقطاعات ألمنيوم نحيفة للغاية تمنح مساحة زجاجية أوسع وإطلالة بانورامية غير منقطعة على الطبيعة والمسابح.\n\nتجمع بين جمالية التصميم المعماري البسيط والأداء العازل المتقدم بفضل الحواجز الحرارية والزجاج المزدوج عالي الكفاءة.\n\nحركة انزلاق ناعمة مع أقفال مدمجة تضمن إحكام الإغلاق وحماية الخصوصية والأمان في أرقى الفلل والمساكن الحديثة.",
    ckbDescription: "پەنجەرەی سلایدی پانۆڕامی بە چوارچێوەی ئەلەمنیۆمی زۆر باریک بۆ بینینی دیمەنی دەرەوە بە تەواوی و بێ بەربەست.\n\nتێکەڵەیەکە لە سادەیی جوانی تەلارسازی و کواڵێتی بەرزی عازلکردن بە جامی دەبڵی پێشکەوتوو.\n\nجوڵەی زۆر نەرم و پارێزگاری بەهێز بۆ ڤێلا و کۆشک و ماڵە ڕازاوەکان فەراهەم دەکات.",
    category: "windows",
    division: "windows",
    image: "/uploads/b7073f48-e25b-42a9-89b6-77921c3369c9.jpg",
    fallbackImage: "/uploads/b7073f48-e25b-42a9-89b6-77921c3369c9.jpg"
  },
  "prod-1793466003904": {
    name: "Frameless Tempered Glass Balustrade System with Embedded Base Channel",
    arabicName: "حاجز شرفة وتراس زجاجي مقسى بنظام تثبيت أرضي مخفي وإطلالة مفتوحة",
    ckbName: "شرفەی شووشەیی سکوریت بە پایەی ژێر زەوی شاراوە بۆ دیمەنی کراوە",
    description: "Frameless architectural glass balustrade system anchored with recessed sub-floor aluminum profiles for maximum visual transparency.\n\nConstructed with heavy-gauge tempered laminated safety glass panels that withstand heavy wind loads and structural impacts.\n\nImparts a luxurious contemporary look to balconies, roof verandas, and penthouses.",
    arabicDescription: "حواجز شرفات زجاجية راقية تثبت بقنوات ألمنيوم أرضية مخفية تحت البلاط لمنح مظهر زجاجي نقي وخال من الأعمدة والقواطع الرأسية.\n\nمصنوعة من ألواح زجاج مقسى ومصفح عالي السماكة يتحمل ضغط الرياح العاتية والصدمات العرضية بأعلى درجات الأمان المعتمدة.\n\nتمنح واجهات المباني والتراسات العلوية لمسة فندقية فاخرة وتسمح بالتمتع الكامل بالإطلالة الخارجية دون أي حواجز تعيق النظر.",
    ckbDescription: "شرفە و حاجزی شووشەیی مۆدێرن بە جێگیرکەری ئەلەمنیۆمی شاراوە لە ژێر زەویدا بۆ دیمەنێکی شووشەیی تەواو بێ کۆڵەکە.\n\nلە شووشەی سکوریتی ئەستووری لامینەیت دروستکراوە کە توانای بەرگەگرتنی بەهێزترین پەستانی هەیە بە سەلامەتی تەواو.\n\nدیمەنێکی شیک و شاهانە بە باڵکۆن و سەقفی ڤێلاکان دەبەخشێت و ڕوانینێکی بێ بەربەست دەستەبەر دەکات.",
    category: "shorfa",
    division: "shorfa",
    image: "/uploads/8ea274cd-fe5e-4298-826f-ada484ea850a.jpg",
    fallbackImage: "/uploads/8ea274cd-fe5e-4298-826f-ada484ea850a.jpg"
  }
};

const transparentShutterProduct = {
  id: "prod-polycarb-transparent-shutter",
  name: "Architectural Transparent Polycarbonate Security Rolling Shutter System",
  arabicName: "شتر رول بولي كربونات شفاف كريستالي للمحلات والواجهات وتراسات الفلل (دراب شفاف)",
  ckbName: "دەڕابی شەفافی پۆلیکاربۆنات بۆ ڕووکار و پێشانگا و تەراس",
  description: "High-security crystal clear transparent rolling shutter engineered with impact-resistant polycarbonate slats and extruded architectural aluminum guides. Delivers 95% daylight visibility with heavy-duty burglary and storm protection for luxury storefronts and villa terraces.\n\nEquipped with an ultra-quiet motorized drive, remote control automation, smart home integration, and precision weather stripping to seal against dust and wind.\n\nCombines the visual elegance of architectural glass with the impenetrable strength of steel, UV stabilized to ensure long-lasting clarity.",
  arabicDescription: "شتر رول شفاف عالي الحماية مصنع من شرائح بولي كربونات فائقة النقاء وغير قابلة للكسر، يمنح رؤية بانورامية كريستالية بنسبة 95% مع توفير أعلى درجات الأمان وحماية المحلات التجارية وتراسات الفلل والحدائق الشتوية من العواصف والغبار مع مقاومة للأشعة فوق البنفسجية.\n\nيعمل بمحرك كهربائي صامت مع إمكانية التحكم عن بعد والربط مع أنظمة المنزل الذكي، ومزود بمجاري جانبية من الألمنيوم الإنشائي المعالج حرارياً وقفل أمان ميكانيكي متين.\n\nتصميم أنيق وعصري يجمع بين جمالية الزجاج وصلابة الفولاذ، مع عزل حراري وصوتي ممتاز وعمر افتراضي طويل دون بهتان أو اصفرار.",
  ckbDescription: "سیستەمی دەڕابی شەفافی بێ وێنە بە شەڕایحی پۆلیکاربۆناتی دژە شکاندن و ڕووناکی تەواو، دیزاین کراوە بۆ پاراستنی بەرزی پێشانگاکان و تەراسی ڤێلاکان بە دیمەنێکی مۆدێرن و ڕوون.\n\nبە ماتۆڕی کارەبایی بێدەنگ و کۆنتڕۆڵی دوورەوە کار دەکات، خاوەن پرۆفایلی بەهێزی ئەلەمنیۆم و عازلی تۆز و با و ڕێگر لە تیشکی بەتینی خۆر.\n\nتێکەڵەیەکە لە جوانی شووشە و پتەوی و سەلامەتی پۆڵا، کە شێوازی بینا بەرز دەکاتەوە و پارێزگاری لە پاکوخاوێنی و تەناهی دەکات.",
  category: "doors",
  division: "doors",
  image: "/uploads/transparent_polycarbonate_rolling_shutter.png",
  fallbackImage: "/uploads/transparent_polycarbonate_rolling_shutter.png",
  basePrice: 0,
  unitPrice: 0,
  pricePerSqm: 0,
  currency: "USD",
  features: []
};

const blackZipShutterProduct = {
  id: "prod-black-zip-screen-shutter",
  name: "Architectural Motorized Exterior Zip Screen Shutter for Facades & Skylights",
  arabicName: "شتر زيب سكرين الخارجي العازل للحرارة والبرد والحشرات والغبار والحرائق (دراب أسود للواجهات والسكاي لايت)",
  ckbName: "دەڕابی زیپ سکرینی دەرەوە بۆ ڕووکار و سەقف (عازلی گەرما و سەرما و تۆز و مێروو و دژە ئاگر)",
  description: "Engineered heavy-duty exterior motorized zip screen shutter system crafted for architectural glazed facades, roof skylights, and patio enclosures. Features precision zip-guided side channels that create an airtight barrier to lock out cold drafts, severe heat, windblown dust, worms, and insects.\n\nFabricated with fire-retardant high-tensile fiberglass composite mesh offering superior UV deflection, flame resistance, and wind-load stability up to gale-force conditions.\n\nOperates via automated tubular motor drives compatible with smart climatic sensors, protecting interior comfort and thermal performance throughout every season.",
  arabicDescription: "شتر زيب سكرين خارجي عالي الكفاءة مصمم خصيصاً للواجهات المعمارية والقباب السماوية (السكاي لايت) وتراسات المنازل. يوفر عزلاً استثنائياً يمنع تسرب البرودة والحرارة الشديدة، ويشكل حاجزاً منيعاً ومحكماً يمنع دخول الغبار والأتربة والديدان والحشرات الطائرة والزاحفة بفضل نظام القفل الجانبي بالسحاب (الزيپ).\n\nيتميز بنسيج فايبرجلاس هندسي عالي المتانة ومقاوم للحرائق والاشتعال، ومصمم ليتحمل أعتى الرياح والعواصف دون تمزق. يمنح حماية متكاملة للواجهات الزجاجية مع الحفاظ على الخصوصية والرؤية المريحة من الداخل.\n\nمزود بمحرك كهربائي فائق الهدوء وأنظمة تحكم ذكية، يركب على واجهات الفلل والمنازل والسكاي لايت ليضمن بيئة داخلية نقية ومحمية على مدار فصول السنة.",
  ckbDescription: "دەڕابی زیپ سکرینی پێشکەوتووی دەرەکی بۆ ڕووکاری باڵەخانە و سەربانی شووشەیی (سکای لایت) و تەراسی ماڵان. بە سیستەمی قوفڵی تەنیشت بە شێوازی زیپ، بە تەواوی ڕێگری دەکات لە چوونەژوورەوەی سەرما، گەرما، تۆزوخۆڵ، کرم و مێرووە زیانبەخشەکان.\n\nدروستکراوە لە قوماشی ئەندازیاری تایبەت کە دژە ئاگرە و توانای بەرگەگرتنی بەهێزترین ڕەشەبا و گەردەلوولی هەیە بەبێ دڕان، لە هەمان کاتدا پارێزگاری لە نهێنی و جوانی بینا دەکات.\n\nبە ماتۆڕی کارەبایی زیرەک کار دەکات و بۆ هەموو وەرزەکان کەشێکی پاکژ و پارێزراو بۆ ماڵەکەت دەستەبەر دەکات.",
  category: "windows",
  division: "windows",
  image: "/uploads/exterior_black_zip_screen_shutter.png",
  fallbackImage: "/uploads/exterior_black_zip_screen_shutter.png",
  basePrice: 0,
  unitPrice: 0,
  pricePerSqm: 0,
  currency: "USD",
  features: []
};

const projPolycarb = {
  id: "gallery-proj-polycarb-transparent-shutter",
  title: "Luxury Villa Garden Pavilion Transparent Polycarbonate Shutter Installation",
  arabicTitle: "مشروع تركيب شتر رول شفاف لكابينة حديقة وتراس فيلا خاصة",
  ckbTitle: "پڕۆژەی دەڕابی شەفافی پۆلیکاربۆنات بۆ تەراسی ڤێلای تایبەت",
  description: "Custom installation by Doorhome architectural team featuring transparent polycarbonate rolling shutters for an outdoor villa pavilion and veranda. Provides all-weather shelter against wind and dust while preserving full panoramic landscape views.",
  arabicDescription: "تنفيذ احترافي متكامل من فريق خبراء باب المنزل لتركيب شتر رول بولي كربونات شفاف لكابينة وتراس خارجي في أربيل. تم تصميم الشتر ليحمي الجلسة الخارجية من الرياح والأتربة والتقلبات الجوية دون حجب الإطلالة الخضراء الساحرة للحديقة، مع تشغيل كهربائي ذكي وسلس يعكس خبرة ومهارة كادرنا الهندسي.",
  ckbDescription: "جێبەجێکردنی پرۆفیشناڵ لە لایەن دەستەی ئەندازیارانی شارەزای کۆمپانیای دەرگای ماڵ بۆ دامەزراندنی دەڕابی شەفافی پۆلیکاربۆنات لەسەر تەراسی ڤێلایەکی تایبەت. پارێزگاری تەواو لە تۆز و با و سەرما دەکات بەبێ ئەوەی دیمەنی سەوزایی حەوشەکە بشارێتەوە.",
  image: "/uploads/transparent_polycarbonate_rolling_shutter.png",
  category: "doors",
  location: "Erbil, Kurdistan Region",
  arabicLocation: "أربيل، إقليم كردستان",
  ckbLocation: "هەولێر، هەرێمی کوردستان"
};

const projZip = {
  id: "gallery-proj-black-zip-screen-shutter",
  title: "Architectural Motorized Black Zip Screen Facade Shutter Installation Project",
  arabicTitle: "مشروع تظليل وحماية واجهة خارجية بشتر زيب سكرين عازل للحرائق والحشرات",
  ckbTitle: "پڕۆژەی دانانی دەڕابی زیپ سکرینی دژە ئاگر و مێروو بۆ ڕووکاری دەرەوە",
  description: "Turnkey exterior facade drop zip-screen project executed with precision by Doorhome installation engineers. Features automated flame-retardant black mesh providing solar control, insect barrier, and dust protection.",
  arabicDescription: "إنجاز هندسي متقن من فريق عمل باب المنزل لتركيب شتر زيب سكرين خارجي أسود مقاوم للحريق والظروف الجوية القاسية. يوفر المشروع عازلية تامة لواجهة المبنى ضد البرودة والحشرات والأتربة مع تشغيل آلي هادئ يعكس الدقة والحرفية العالية لكوادرنا المتخصصة.",
  ckbDescription: "پڕۆژەیەکی دەستکردی سەرکەوتووی دەستەی ئەندازیارانی دەرگای ماڵ بۆ دانانی دەڕابی زیپ سکرینی دەرەکی کە بەرگری تەواوی هەیە لە ئاگر، سەرما، تۆز و مێروو، بە کارکردنی نەرم و کوالیتی بێهاوتا.",
  image: "/uploads/exterior_black_zip_screen_shutter.png",
  category: "windows",
  location: "Erbil, Kurdistan Region",
  arabicLocation: "أربيل، إقليم كردستان",
  ckbLocation: "هەولێر، هەرێمی کوردستان"
};

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://doorhome_user:Doorhome_Pg_2026_SecureKey@localhost:5432/doorhome_db'
  });

  console.log('Connecting to PostgreSQL...');
  
  // 1. Fetch current products from cms_content
  const prodRes = await pool.query("SELECT data FROM cms_content WHERE section_key = 'products'");
  let products = prodRes.rows[0]?.data || [];
  console.log(`Loaded ${products.length} existing products from cms_content.`);

  // Update existing products with detailed data
  for (let p of products) {
    if (detailedProducts[p.id]) {
      Object.assign(p, detailedProducts[p.id]);
    }
    // Ensure any video product has a poster as fallbackImage
    if (/\.(mp4|webm|mov)(\?|#|$)/i.test(p.image || '')) {
      if (!p.fallbackImage || /\.(mp4|webm|mov)(\?|#|$)/i.test(p.fallbackImage)) {
        p.fallbackImage = p.image.replace(/\.(mp4|webm|mov)(\?|#|$)/i, '.poster.jpg$1');
      }
    }
  }

  // Prepend transparent shutter if missing
  if (!products.some(p => p.id === transparentShutterProduct.id)) {
    products.unshift(transparentShutterProduct);
  }

  // Prepend black zip shutter if missing
  if (!products.some(p => p.id === blackZipShutterProduct.id)) {
    products.unshift(blackZipShutterProduct);
  }

  // Save back to cms_content
  await pool.query(`
    INSERT INTO cms_content (section_key, data, updated_at)
    VALUES ('products', $1, CURRENT_TIMESTAMP)
    ON CONFLICT (section_key) DO UPDATE
    SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
  `, [JSON.stringify(products)]);
  console.log(`Saved ${products.length} products to cms_content.`);

  // 2. Fetch current gallery from cms_content
  const gallRes = await pool.query("SELECT data FROM cms_content WHERE section_key = 'gallery'");
  let gallery = gallRes.rows[0]?.data || [];
  console.log(`Loaded ${gallery.length} existing gallery items from cms_content.`);

  if (!gallery.some(g => g.id === projPolycarb.id)) {
    gallery.unshift(projPolycarb);
  }
  if (!gallery.some(g => g.id === projZip.id)) {
    gallery.unshift(projZip);
  }

  await pool.query(`
    INSERT INTO cms_content (section_key, data, updated_at)
    VALUES ('gallery', $1, CURRENT_TIMESTAMP)
    ON CONFLICT (section_key) DO UPDATE
    SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
  `, [JSON.stringify(gallery)]);
  console.log(`Saved ${gallery.length} gallery items to cms_content.`);

  // 3. Sync into products table
  await pool.query('DELETE FROM products;');
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    await pool.query(`
      INSERT INTO products (
        id, name, kurdish_name, arabic_name,
        category, division, sub_category, model_name,
        image, description, kurdish_description, arabic_description,
        base_price, selling_price, currency, unit,
        specs, features, is_active, sort_order,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [
      p.id,
      p.name || '',
      p.ckbName || p.translations?.ckb?.name || '',
      p.arabicName || p.translations?.ar?.name || '',
      p.category || '',
      p.division || '',
      p.subCategory || '',
      p.modelNumber || p.id,
      p.image || '',
      p.description || '',
      p.ckbDescription || p.translations?.ckb?.description || '',
      p.arabicDescription || p.translations?.ar?.description || '',
      p.basePrice || p.price || 0,
      p.price || 0,
      'USD',
      'm²',
      JSON.stringify(p.technicalSpecs || {}),
      JSON.stringify(p.features || {}),
      true,
      i
    ]);
  }
  console.log(`products table synced with ${products.length} products.`);

  // Also write to local files on remote server if in /var/www/doorhome
  try {
    fs.writeFileSync('cms_products_db.json', JSON.stringify(products, null, 2), 'utf8');
    fs.writeFileSync('cms_gallery_db.json', JSON.stringify(gallery, null, 2), 'utf8');
    console.log('JSON files cms_products_db.json and cms_gallery_db.json updated on disk.');
  } catch (e) {
    console.warn('Could not write json files:', e.message);
  }

  await pool.end();
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
