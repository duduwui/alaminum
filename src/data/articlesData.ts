export interface ArticleSection {
  heading: string;
  body: string;
}

export interface ArchitecturalArticle {
  id: string;
  slug: string;
  category: 'windows' | 'doors' | 'glass' | 'railings' | 'upvc' | 'hardware' | 'guide';
  categoryLabel: {
    ar: string;
    ckb: string;
    en: string;
  };
  title: {
    ar: string;
    ckb: string;
    en: string;
  };
  summary: {
    ar: string;
    ckb: string;
    en: string;
  };
  readingTime: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  keySpecs?: { label: string; value: string }[];
  sections: {
    ar: ArticleSection[];
    en: ArticleSection[];
  };
}

export const ARCHITECTURAL_ARTICLES: ArchitecturalArticle[] = [
  // 1. Thermal Break Aluminum
  {
    id: 'art-01',
    slug: 'thermal-break-aluminum-iraq-climate',
    category: 'windows',
    categoryLabel: { ar: 'شبابيك ألمنيوم', ckb: 'پەنجەرەی ئەلەمنیۆم', en: 'Aluminum Windows' },
    title: {
      ar: 'شبابيك الألمنيوم الحراري (Thermal Break): حل حرارة الصيف الشديدة في العراق',
      ckb: 'پەنجەرەی ئەلەمنیۆمی گەرمایی (Thermal Break): چارەسەری گەرمای توندی هاوینی عێراق',
      en: 'Thermal Break Aluminum Windows: Beating Iraq’s 50°C Summer Heat'
    },
    summary: {
      ar: 'دليل هندسي متكامل يوضح كيف تعمل حواجز البولي أميد العازلة والزجاج المزدوج مع غاز الآرجون على منع انتقال حرارة الصيف القائظ إلى داخل منزلك.',
      ckb: 'ڕێبەرێکی ئەندازیاری تەواو کە ڕوونی دەکاتەوە چۆن بەربەستی پۆلیەماید و جامی دبل ئارگۆن ڕێگری لە گەرمای هاوین دەکەن.',
      en: 'An engineering deep dive into how polyamide thermal barriers and argon double glazing block scorching 50°C summer heat in Iraqi homes.'
    },
    readingTime: '5 min read',
    date: '2026-09-25',
    author: 'Doorhome Architectural Team',
    image: './assets/showcase/showcase_lorenzo70ls_1789926091155.jpg',
    tags: ['Thermal Break', 'شبابيك ألمنيوم', 'Lorenzo 70LS', 'عزل حراري', 'عراق'],
    keySpecs: [
      { label: 'Uf Thermal Insulation', value: '1.3 W/m²K' },
      { label: 'Acoustic Barrier', value: '42 dB (Rw)' },
      { label: 'Barrier Material', value: '24mm Polyamide PA66 GF25' }
    ],
    sections: {
      ar: [
        {
          heading: 'لماذا يفشل الألمنيوم التقليدي في صيف العراق؟',
          body: 'الألمنيوم معدن موصل ممتاز للحرارة. عندما تصل درجات الحرارة الخارجية في بغداد والبصرة وأربيل إلى 50 درجة مئوية، ينقل الألمنيوم العادي غير المعزول الحرارة إلى داخل الغرف، مما يجعل أجهزة التكييف تعمل بطاقتها القصوى دون جدوى ويزيد من فاتورة الكهرباء بشكل هائل.'
        },
        {
          heading: 'سر تقنية الكسر الحراري (Thermal Break)',
          body: 'تعتمد تقنية الثيرمال بريك على فصل قطاع الألمنيوم الخارجي عن القطاع الداخلي تماماً بواسطة عازل غير موصل من مادة البولي أميد المدعمة بالألياف الزجاجية (PA66 GF25). هذا الفاصل يقطع الجسر الحراري بنسبة 100% ويمنع تسرب الحرارة أو البرودة.'
        },
        {
          heading: 'أنظمة Lorenzo 70LS و 58TT المعتمدة لدى Doorhome',
          body: 'نستخدم قطاعات Lorenzo الأوروبية المصممة خصيصاً لمناخ الشرق الأوسط، والتي تجمع بين خفة الوزن ومتانة التحمل ومظهر المقاطع النحيفة (Minimalist Sightlines)، مما يسمح بنفاذ أقصى قدر من الإضاءة الطبيعية مع عزل حراري مثالي.'
        }
      ],
      en: [
        {
          heading: 'Why Standard Aluminum Fails in Middle Eastern Summers',
          body: 'Aluminum is an extraordinary thermal conductor. When external summer temperatures in Baghdad, Basra, and Erbil soar past 50°C, non-insulated aluminum frames absorb and conduct solar heat directly inside living spaces, overburdening HVAC units.'
        },
        {
          heading: 'The Polyamide Thermal Break Mechanism',
          body: 'A thermal break profile mechanically locks an insulating structural polyamide strip (PA66 GF25) between the exterior and interior aluminum extrusions. This breaks the thermal bridge completely, stopping conductive heat transfer.'
        },
        {
          heading: 'Certified Lorenzo Systems at Doorhome',
          body: 'Doorhome specifies Lorenzo 70LS and 58TT profiles engineered with 24mm polyamide insulation strips and multi-point STAC perimeter seals, delivering industry-leading U-values and unmatched durability.'
        }
      ]
    }
  },

  // 2. Modern Glass Stairs
  {
    id: 'art-02',
    slug: 'modern-tempered-glass-stairs-safety-design',
    category: 'glass',
    categoryLabel: { ar: 'درج وسلالم زجاجية', ckb: 'پلیکانی شووشە', en: 'Glass Stairs' },
    title: {
      ar: 'السلالم والدرج الزجاجي المعلق: متانة وأمان فائق وتصميم معماري فاخر',
      ckb: 'پلیکانی شووشەی هەڵواسراو: بەهێزی و سەلامەتی و دیزاینی مۆدێرن',
      en: 'Cantilever Floating Glass Stairs: Architectural Safety, Load Specs & Luxury'
    },
    summary: {
      ar: 'كيف نصمم درجاً زجاجياً يتحمل أكثر من 500 كغم للدرجة الواحدة باستخدام زجاج سيكوريت ثلاثي الطبقات وهياكل تثبيت مخفية.',
      ckb: 'چۆن پلیکانی شووشەیی دروست دەکەین کە بەرگەی زیاتر لە ٥٠٠ کگم دەگرێت بە جامی سێ قاتی سێکۆریت.',
      en: 'How triple-laminated tempered glass and hidden steel subframes create floating glass staircases rated for 500kg+ point loads.'
    },
    readingTime: '6 min read',
    date: '2026-09-24',
    author: 'Doorhome Structural Team',
    image: './assets/doorhome/photo_2023-07-03_15-49-24-760x485.jpg',
    tags: ['درج زجاجي', 'سلالم معلقة', 'زجاج مقسى', 'سيكوريت', 'تصميم فلل'],
    keySpecs: [
      { label: 'Glass Composition', value: '10+10+10mm Triple Laminated' },
      { label: 'Interlayer', value: '1.52mm SentryGlas / PVB' },
      { label: 'Point Load Capacity', value: '> 500 kg per tread' }
    ],
    sections: {
      ar: [
        {
          heading: 'هل الدرج الزجاجي آمن حقاً للاستخدام العائلي اليومي؟',
          body: 'نعم تماماً، عندما يتم تنفيذه وفق المعايير الهندسية الدقيقة. لا نستخدم زجاجاً عادياً، بل نعتمد زجاج سيكوريت مقسى ثلاثي الطبقات بسماكة إجمالية تتجاوز 32 ملم، حيث تلتحم الطبقات بواسطة رقائق بوليمرية فائقة القوة (SentryGlas) تمنع الكسر وتضمن تماسك الدرجة حتى في أقصى الظروف.'
        },
        {
          heading: 'الهياكل المعلقة الكابولية (Cantilever Engineering)',
          body: 'يتم تثبيت السلالم المعلقة داخل جدار خرساني مسلح بهيكل حديدي مخفي عالي المتانة، مما يمنح الدرجات مظهر الطفو الساحر في الهواء دون الحاجة لأعمدة دعم ظاهرة.'
        },
        {
          heading: 'معالجة الأسطح المقاومة للانزلاق',
          body: 'يتم نقش سطح الدرجات بالليزر أو معالجته بتقنية السفع الرملي والسيراميك الحراري لتوفير سطح خشن مانع للانزلاق وجميل المظهر وسهل التنظيف.'
        }
      ],
      en: [
        {
          heading: 'Structural Safety & Glass Layering',
          body: 'Structural glass staircases utilize triple laminated tempered glass (10mm + 10mm + 10mm) fused with structural ionoplast interlayers (SentryGlas). Even if an extreme impact damages one ply, the remaining layers maintain full structural integrity.'
        },
        {
          heading: 'Cantilever Concealed Steel Framework',
          body: 'Hidden inside reinforced concrete walls, heavy-gauge steel stringers securely anchor each glass tread, allowing seamless cantilever floating effects with zero visible columns.'
        },
        {
          heading: 'Anti-Slip Ceramic Acid-Etched Textures',
          body: 'Tread surfaces undergo precision micro-ceramic etching or sandblasting patterns, ensuring high traction friction coefficients that meet European slip resistance regulations.'
        }
      ]
    }
  },

  // 3. uPVC vs Aluminum
  {
    id: 'art-03',
    slug: 'upvc-vs-aluminum-windows-iraq-climate-guide',
    category: 'upvc',
    categoryLabel: { ar: 'مقارنة هندسية', ckb: 'بەراوردکردنی ئەندازیاری', en: 'Material Guide' },
    title: {
      ar: 'أيهما تختار لبيتك في العراق: شبابيك uPVC أم الألمنيوم الحراري؟',
      ckb: 'کامە هەڵدەبژێریت بۆ ماڵەکەت: پەنجەرەی uPVC یان ئەلەمنیۆمی عازل؟',
      en: 'uPVC vs. Thermal-Break Aluminum: The Ultimate Iraqi Homeowner Guide'
    },
    summary: {
      ar: 'مقارنة موضوعية ودقيقة بين كفاءة العزل الحراري، المتانة، السعر، والعزل الصوتي لكل من أنظمة بي في سي والألمنيوم.',
      ckb: 'بەراوردێکی زانستی و ورد لەنێوان عەزلی گەرمی، بەهێزی، نرخ، و عەزلی دەنگی uPVC و ئەلەمنیۆم.',
      en: 'An objective side-by-side comparison of thermal insulation, acoustic barriers, structural longevity, and cost factors in Iraq.'
    },
    readingTime: '6 min read',
    date: '2026-09-23',
    author: 'Eng. Ahmed Al-Doorhome',
    image: './assets/showcase/showcase_legend80_1789926007847.jpg',
    tags: ['uPVC', 'المنيوم', 'مقارنة', 'Deceuninck', 'Lorenzo', 'عزل صوت'],
    keySpecs: [
      { label: 'Best for Small/Med Windows', value: 'uPVC 6-Chamber (Legend 80)' },
      { label: 'Best for Giant Sliding Doors', value: 'Thermal Aluminum (70LS)' },
      { label: 'Lifespan', value: '40+ Years Maintenance Free' }
    ],
    sections: {
      ar: [
        {
          heading: 'العزل الحراري: لمن الغلبة؟',
          body: 'يتفوق نظام uPVC متعدد الحجرات (مثل Deceuninck Legend 80 سداسي الحجرات) في العزل الحراري بنسبة تفوق معظم قطاعات الألمنيوم العادية، لأن مادة البوليمر لا توصل الحرارة بطبيعتها. في المقابل، فإن الألمنيوم المزود بكسر حراري بولي أميد 24 ملم يقترب جداً من نفس كفاءة العزل مع تفوق هائل في المتانة الهيكلية.'
        },
        {
          heading: 'المتانة الهيكلية والفتحات البانورامية الضخمة',
          body: 'عندما يتجاوز ارتفاع الفتحة 2.8 متر أو يزيد عرضها عن 4 أمتار، يكون الألمنيوم هو الخيار الأوحد دون منازع لقدرته الفائقة على تحمل أوزان الزجاج الثقيل ومقاومة التمدد دون أي انحناء.'
        },
        {
          heading: 'التوصية الهندسية المتوازنة',
          body: 'ننصح في Doorhome باستخدام uPVC لغرف النوم ومكاتب العمل للحصول على هدوء وعزل تام، واستخدام الألمنيوم الحراري للصالات ومداخل الفلل والواجهات الزجاجية المطلة على الحديقة.'
        }
      ],
      en: [
        {
          heading: 'Thermal Isolation Comparison',
          body: '6-chamber uPVC profiles inherently outperform standard metals in thermal resistance because vinyl does not conduct heat. However, modern 24mm polyamide thermal-break aluminum closes the gap while offering architectural rigidity.'
        },
        {
          heading: 'Structural Span and Monumental Openings',
          body: 'For expansive architectural spans exceeding 3 meters in height or oversized lift-and-slide doors, structural aluminum reigns supreme due to its modulus of elasticity and dimensional stability under solar load.'
        },
        {
          heading: 'The Hybrid Villa Recommendation',
          body: 'Leading architects combine both: Deploying Deceuninck Legend 80 uPVC for upper-floor bedrooms to maximize acoustic insulation, and Lorenzo 70LS aluminum for ground-floor panoramic garden terraces.'
        }
      ]
    }
  },

  // 4. Panoramic Lift & Slide
  {
    id: 'art-04',
    slug: 'panoramic-lift-and-slide-doors-luxury-villas',
    category: 'doors',
    categoryLabel: { ar: 'أبواب سحاب', ckb: 'دەرگای سلاید', en: 'Sliding Doors' },
    title: {
      ar: 'أبواب السحاب البانورامية Lift & Slide: إطلالات عملاقة دون عوائق',
      ckb: 'دەرگای سلایدینگی پانۆراما Lift & Slide: دیمەنی گەورەی بێ بەربەست',
      en: 'Monumental Lift & Slide Doors: Transforming Villas with Expansive Glass'
    },
    summary: {
      ar: 'كيف تتيح أنظمة الرفع والانزلاق فتحات زجاجية بعرض 6 أمتار ووزن 400 كغم للضلفة بحركة انسيابية خفيفة بلمسة يد واحدة.',
      ckb: 'چۆن سیستەمی لیفت ئەند سلاید ڕێگە دەدات بە جامی پانی ٦ مەتری و کێشی ٤٠٠ کگم بە یەک پەنجە بجوڵێت.',
      en: 'Discover how heavy-duty lift-and-slide hardware enables 6-meter panoramic glass doors weighing 400kg to glide effortlessly.'
    },
    readingTime: '5 min read',
    date: '2026-09-22',
    author: 'Doorhome Fenestration Specialists',
    image: './assets/showcase/showcase_hs76_1789926153920.jpg',
    tags: ['أبواب سحاب', 'Lift and Slide', 'Lorenzo 70LS', 'فلل حديثة', 'أبواب بانوراما'],
    keySpecs: [
      { label: 'Max Sash Weight', value: '400 kg' },
      { label: 'Max Panel Height', value: '3.2 meters' },
      { label: 'Threshold Profile', value: 'Zero-trip Flush Barrier' }
    ],
    sections: {
      ar: [
        {
          heading: 'ما هو الفرق بين السحاب العادي ونظام الرفع والانزلاق (Lift & Slide)؟',
          body: 'في السحاب العادي، تحتك حشوات العزل بالمجرى طوال الوقت، مما يسبب ثقلاً في الحركة وتآكلاً سريعاً. في نظام Lift & Slide، تؤدي إدارة المقبض إلى رفع الضلفة هيدروليكياً بمقدار 5 ملم عن السكة لتنزلق بخفة خيالية فوق عجلات ستانلس ستيل محملة بالكرات، وعند الإغلاق تنزل الضلفة وتضغط على الحشوات لتوفير إحكام إغلاق بنسبة 100% ضد الرياح والأمطار.'
        },
        {
          heading: 'عتبة أرضية مستوية بدون تعثر (Flush Zero-Threshold)',
          body: 'تتميز أنظمة Doorhome بإمكانية غمس العتبة الأرضية بالكامل في أرضية الصالة والحديقة، مما يوفر انتقالاً آمناً وانسيابياً ومظهراً فندقياً فاخراً.'
        }
      ],
      en: [
        {
          heading: 'The Lift-and-Slide Mechanical Principle',
          body: 'Turning the handle mechanically disengages the perimeter compression seals and lifts the heavy sash onto stainless steel ball-bearing tandem bogies, gliding with effortless fingertip pressure.'
        },
        {
          heading: 'Airtight and Dustproof Compression Locking',
          body: 'When locked down, the massive sash descends firmly onto multi-layer EPDM gaskets, creating a hermetic seal that repels heavy Iraqi dust storms and driving rain.'
        }
      ]
    }
  },

  // 5. Curtain Wall 50F
  {
    id: 'art-05',
    slug: 'curtain-wall-50f-structural-glass-facades-iraq',
    category: 'glass',
    categoryLabel: { ar: 'واجهات زجاجية', ckb: 'ڕووکاری کەرتن وۆڵ', en: 'Curtain Wall Facades' },
    title: {
      ar: 'واجهات كيرتن وول 50F واستركشر: المظهر المعماري للأبراج والفلل الحديثة',
      ckb: 'ڕووکاری شووشەی کەرتن وۆڵ ٥٠ ملم: دیمەنی مۆدێرنی باڵەخانە و ڤێلاکان',
      en: 'Curtain Wall 50F & Structural Glazing: Iconic Facades for Towers & Villas'
    },
    summary: {
      ar: 'شرح هندسي لشبكة الألمنيوم الإنشائية 50 ملم المقاومة لأحمال الرياح، وتصريف مياه الأمطار الذاتي والزجاج العاكس للحرارة.',
      ckb: 'شیکردنەوەی ئەندازیاری تۆڕی ئەلەمنیۆمی ٥٠ ملم بەرگری با و ئاوەڕۆی ناوەکی و جامی عازل.',
      en: 'Engineering analysis of 50mm structural mullion-transom stick facades, pressure equalization, and Low-E solar glazing.'
    },
    readingTime: '7 min read',
    date: '2026-09-21',
    author: 'Doorhome Facade Engineering Dept',
    image: './assets/showcase/showcase_curtain50f_1789926115841.jpg',
    tags: ['واجهات زجاجية', 'كيرتن وول', 'Curtain Wall 50F', 'استركشر', 'مباني تجارية'],
    keySpecs: [
      { label: 'Profile Face Width', value: '50 mm Slimline' },
      { label: 'Water Tightness', value: 'Class RE 1200 Pa' },
      { label: 'Wind Load Resistance', value: 'Tested up to 3000 Pa' }
    ],
    sections: {
      ar: [
        {
          heading: 'ما هي واجهات الكيرتن وول (Curtain Wall Stick System)؟',
          body: 'هي واجهات زجاجية ستائرية غير حاملة للأوزان الخرسانية للمبنى، بل تعلق على الهيكل الإنشائي. تتألف من أعمدة (Mullions) وجسور (Transoms) بعرض 50 ملم مصنوعة من سبائك ألمنيوم عالية المقاومة، وتحمل ألواح زجاجية ضخمة تمنح المبنى واجهة كريستالية متصلة.'
        },
        {
          heading: 'مقاومة أحمال الرياح الشديدة وتصريف المياه الداخلي',
          body: 'تحتوي قطاعات 50F على قنوات مدمجة لتصريف أي قطرات تكثف مائي نحو الخارج تلقائياً، مع قدرة إنشائية على امتصاص التمدد الحراري والاهتزازات الزلزالية.'
        }
      ],
      en: [
        {
          heading: 'The Engineering of 50mm Stick Curtain Walls',
          body: 'A non-structural outer building envelope constructed from 50mm extruded aluminum mullions and transoms, engineered to support substantial glass wind loads while transferring seismic loads safely back to floor slabs.'
        },
        {
          heading: 'Pressure-Equalized Internal Drainage',
          body: 'Incorporates engineered drainage channels and pressure-equalization cavities, guaranteeing zero water penetration even during torrential winter thunderstorms.'
        }
      ]
    }
  },

  // 6. Frameless Glass Railings
  {
    id: 'art-06',
    slug: 'frameless-glass-railings-balustrades-spigots',
    category: 'railings',
    categoryLabel: { ar: 'درابزين زجاج', ckb: 'محاجەرەی شووشە', en: 'Glass Railings' },
    title: {
      ar: 'درابزين الزجاج بدون إطار (Frameless): بنك ألمنيوم أم قواعد ستانلس ستيل؟',
      ckb: 'محاجەرەی شووشەی بێ چوارچێوە: بنکەی ئەلەمنیۆم یان سپیگۆتی ئیستیل؟',
      en: 'Frameless Glass Balustrades: Continuous Base Shoe vs. Stainless Steel Spigots'
    },
    summary: {
      ar: 'مقارنة بين نظام مجرى الألمنيوم المستمر ونظام مسامير التثبيت النقطية (Spigots) من حيث الأمان وسهولة التنظيف والمظهر المعماري.',
      ckb: 'بەراورد لەنێوان بنکەی ئەلەمنیۆمی بەردەوام و سپیگۆت لەسەر سەلامەتی و دیزاین.',
      en: 'Comparing continuous aluminum dry-glaze shoe profiles against point-fixed stainless steel clamps for balconies and pools.'
    },
    readingTime: '5 min read',
    date: '2026-09-20',
    author: 'Doorhome Safety Engineers',
    image: './assets/doorhome/photo_2023-07-03_15-38-36-600x390.jpg',
    tags: ['درابزين زجاجي', 'محاجر', 'قواعد ستانلس ستيل', 'بلكونات', 'زجاج سيكوريت'],
    keySpecs: [
      { label: 'Glass Specification', value: '8+8mm or 10+10mm Tempered Laminated' },
      { label: 'Aluminum Base Shoe', value: 'High Tensile 6060 T6' },
      { label: 'Spigot Material', value: 'AISI 316 Marine Grade Stainless Steel' }
    ],
    sections: {
      ar: [
        {
          heading: 'نظام بنك الألمنيوم المستمر (Base Shoe System)',
          body: 'يتميز هذا النظام بتثبيت مجرى ألمنيوم قوي على الأرضية أو في جانب الخرسانة، وتركيب الزجاج بداخله باستخدام أوتاد ضبط ميكانيكية دون الحاجة لأي ثقوب في الزجاج. يوفر رؤية بانورامية نقية 100% بدون أي أعمدة فاصلة.'
        },
        {
          heading: 'نظام سبیكوت الستانلس ستيل (Stainless Steel Spigots)',
          body: 'يعتمد على ركائز صغيرة من الستانلس ستيل المقاوم للصدأ (درجة بحرية 316)، ترفع الزجاج بمقدار 5-7 سم عن الأرض، مما يتيح تصريف مياه الأمطار وغسيل الشرفات بسهولة تامة.'
        }
      ],
      en: [
        {
          heading: 'Continuous Aluminum Base Channel System',
          body: 'A heavy-duty aluminum extruded base shoe grips the bottom of laminated glass panels using specialized adjustment wedges, providing seamless panoramic transparency.'
        },
        {
          heading: 'Marine-Grade 316 Stainless Steel Spigots',
          body: 'Heavy cast stainless steel spigot clamps elevate the glass slightly off the floor deck, permitting effortless rainwater run-off and drainage on exterior balconies.'
        }
      ]
    }
  },

  // 7. French Balconies
  {
    id: 'art-07',
    slug: 'french-balcony-glass-safety-guard-systems',
    category: 'railings',
    categoryLabel: { ar: 'بلكونة فرنسية', ckb: 'باڵکۆنی فەرەنسی', en: 'French Balcony' },
    title: {
      ar: 'حواجز البلكونات الفرنسية الزجاجية: أمان تام وإطلالة كاملة للشبابيك الطويلة',
      ckb: 'پارێزبەندی شووشەی باڵکۆنی فەرەنسی بۆ پەنجەرەی تا سەر زەوی',
      en: 'Minimal Glass French Balconies: Safety & Uncompromised Light for Floor Windows'
    },
    summary: {
      ar: 'كيف توفر حواجز الزجاج الشفاف الحماية التامة للأطفال والكبار عند فتح النوافذ الممتدة من الأرض إلى السقف دون حجب الضوء.',
      ckb: 'چۆن شووشەی ڕوون پارێزگاری لە منداڵان دەکات لە پەنجەرەی گەورەدا.',
      en: 'How laminated structural glass balusters provide fall prevention for full-height windows without obstructing exterior views.'
    },
    readingTime: '4 min read',
    date: '2026-09-19',
    author: 'Doorhome Design Studio',
    image: './assets/doorhome/03-2.jpg',
    tags: ['بلكونة فرنسية', 'حواجز زجاج', 'شبابيك طويلة', 'أمان الأطفال'],
    sections: {
      ar: [
        {
          heading: 'المفهوم المعماري للبلكونة الفرنسية',
          body: 'عند تصميم نوافذ واسعة تبدأ من منسوب الأرضية في الطوابق العليا للفلل، يشترط الكود الإنشائي وجود حاجز حماية يمنع السقوط. يعتبر درابزين الزجاج الفرنسي الشفاف البديل العصري الأنيق للقضبان الحديدية القديمة.'
        }
      ],
      en: [
        {
          heading: 'The French Balcony Concept',
          body: 'When designing floor-to-ceiling opening windows on upper levels, safety codes demand rigid fall protection. Transparent laminated glass balustrades eliminate unsightly metal bars while welcoming natural daylight.'
        }
      ]
    }
  },

  // 8. Pivot Monumental Doors
  {
    id: 'art-08',
    slug: 'pivot-monumental-entrance-doors-luxury-villas',
    category: 'doors',
    categoryLabel: { ar: 'أبواب مداخل', ckb: 'دەرگای پیڤۆت', en: 'Pivot Doors' },
    title: {
      ar: 'أبواب المداخل المحورية (Pivot Doors): بصمة الفخامة الأولى للفلل والقصور',
      ckb: 'دەرگای پیڤۆتی سەرەکی: شکۆی یەکەمی ڤێلا و کۆشکە مۆدێرنەکان',
      en: 'Monumental Pivot Entrance Doors: The Definitive Architectural Statement'
    },
    summary: {
      ar: 'أبواب مداخل رئيسية ضخمة تدور حول محور مركزي أو جانبي بأبعاد تصل إلى 2 متر عرضاً و 3.5 متر ارتفاعاً مع أقفال بيومترية ذكية.',
      ckb: 'دەرگای گەورەی سەرەکی بە چەقی خولاوە و قوفڵی زیرەکی پەنجەمۆر.',
      en: 'Oversized main entrance doors rotating on heavy pivot hinges, integrating biometric smart locks and insulated aluminum composite panels.'
    },
    readingTime: '5 min read',
    date: '2026-09-18',
    author: 'Doorhome Entrance Division',
    image: './assets/doorhome/03-2.jpg',
    tags: ['أبواب بيفوت', 'أبواب فلل', 'أبواب محورية', 'أقفال ذكية', 'فخامة'],
    keySpecs: [
      { label: 'Pivot Hinge Capacity', value: 'Up to 500 kg Hydraulic Dampening' },
      { label: 'Max Width / Height', value: '2.0m Wide x 3.5m High' },
      { label: 'Access Control', value: 'Face Recognition, Fingerprint & RFID' }
    ],
    sections: {
      ar: [
        {
          heading: 'آلية عمل الباب المحوري (Pivot Hinge)',
          body: 'بدلاً من المفصلات التقليدية المثبتة على حافة الإطار، يعتمد الباب المحوري على نقطتي ارتكاز هيدروليكيتين في أعلى وأسفل الباب تبعدان 15-30 سم عن الحافة، مما يوزع وزن الباب الضخم على الأرضية مباشرة ويسمح بدوران سلس وهادئ للغاية.'
        }
      ],
      en: [
        {
          heading: 'The Engineering of Pivot Floor Bearings',
          body: 'Unlike side-hung hinges, a heavy-duty pivot mechanism transfers the entire door weight into a subfloor hydraulic closer, ensuring whisper-quiet opening and smooth auto-closing.'
        }
      ]
    }
  },

  // 9. Bi-Fold Doors
  {
    id: 'art-09',
    slug: 'bifold-concertina-folding-doors-iraq',
    category: 'doors',
    categoryLabel: { ar: 'أبواب فولدنج', ckb: 'دەرگای ئەکۆردیۆن', en: 'Bi-Fold Doors' },
    title: {
      ar: 'أبواب الأكورديون القابلة للطي (Bi-Fold 77BF): فتح المساحات 100% بدون جدران',
      ckb: 'دەرگای قەدکراوی ئەکۆردیۆن (Bi-Fold): کردنەوەی ١٠٠٪ی فەزا بێ بەربەست',
      en: 'Bi-Fold Folding Concertina Doors: 100% Unobstructed Openings for Gardens & Pools'
    },
    summary: {
      ar: 'دمج الصالة الداخلية بحديقة الفيلا والمسبح بضلف زجاجية تطوى جانبياً وتفتح كامل عرض الجدار دون حواجز.',
      ckb: 'تێکەڵکردنی ژوورەوە و باخچەی ماڵ بە دەرگای ئەکۆردیۆنی قەدکراو.',
      en: 'Seamlessly merging indoor luxury with poolside gardens through thermally insulated folding glass leaf systems.'
    },
    readingTime: '5 min read',
    date: '2026-09-17',
    author: 'Doorhome Systems Engineer',
    image: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg',
    tags: ['أبواب فولدنج', 'أبواب أكورديون', 'Bi-Fold', 'مسابح', 'حدائق'],
    sections: {
      ar: [
        {
          heading: 'لماذا يفضل المعماريون نظام Bi-Fold؟',
          body: 'بينما تترك الأبواب السحاب جزءاً من الفتحة مغلقاً بالضلف الثابتة، يتيح نظام البيفولد طي جميع الضلف الزجاجية إلى جانب الجدار تماماً، مما يوفر فتحة بنسبة 95% لربط الصالة بحديقة الفيلا والمسبح في فصلي الربيع والخريف.'
        }
      ],
      en: [
        {
          heading: 'The 95% Clear Opening Advantage',
          body: 'While sliding patio doors always retain fixed panels, concertina bi-fold leaves stack neatly against side walls, creating an unobstructed 95% indoor-outdoor integration.'
        }
      ]
    }
  },

  // 10. Soundproofing & Acoustic Isolation
  {
    id: 'art-10',
    slug: 'soundproofing-acoustic-insulation-windows-iraq',
    category: 'windows',
    categoryLabel: { ar: 'عزل الصوت', ckb: 'عەزلی دەنگ', en: 'Soundproofing' },
    title: {
      ar: 'عزل الصوت والضوضاء في الشبابيك: كيف تحول منزلك في وسط المدينة إلى واحة هدوء؟',
      ckb: 'عەزلی دەنگ لە پەنجەرەدا: چۆن ماڵەکەت بێدەنگ دەکەیت لە جەنجاڵی شار؟',
      en: 'Acoustic Soundproofing: Eliminating Street & Traffic Noise with High-Rw Glazing'
    },
    summary: {
      ar: 'الفيزياء وراء كتم أصوات أبواق السيارات والشوارع المزدحمة عبر تباين سماكات الزجاج والغاز الخامل وحشوات EPDM المتواصلة.',
      ckb: 'زانستی بێدەنگکردنی دەنگەدەنگی شەقام بە جامی ئەستووری جیاواز و لاستیکی EPDM.',
      en: 'How asymmetric glass thickness, acoustic PVB films, and multi-chamber seals eliminate urban traffic noise up to 45 dB.'
    },
    readingTime: '6 min read',
    date: '2026-09-16',
    author: 'Doorhome Acoustic Lab',
    image: './assets/doorhome/photo_2023-07-03_15-41-20-1280x820.jpg',
    tags: ['عزل صوت', 'هدوء', 'دبل كلاس', 'ضوضاء', 'EPDM'],
    keySpecs: [
      { label: 'Acoustic Sound Reduction', value: 'Up to 45 dB (Rw)' },
      { label: 'Glass Configuration', value: '6mm + 16mm Argon + 8.76mm Acoustic PVB' },
      { label: 'Gasket System', value: 'Triple Perimeter EPDM Vulcanized' }
    ],
    sections: {
      ar: [
        {
          heading: 'سر الزجاج غير المتماثل (Asymmetric Glazing)',
          body: 'إذا كانت طبقتا الزجاج المزدوج بنفس السماكة (مثلاً 6 ملم + 6 ملم)، فإنهما تهتزان بنفس التردد الصوتي وتنقلان الضوضاء. في Doorhome نستخدم تركيبة غير متماثلة مثل (6 ملم خارجي + فاصل غاز آرجون 16 ملم + 8.76 ملم زجاج لاميناتي مع طبقة سكون Acoustic PVB داخلي)، مما يكسر موجات الصوت ويخفض الضوضاء بنسبة تصل إلى 85%.'
        }
      ],
      en: [
        {
          heading: 'The Asymmetric Glass Thickness Rule',
          body: 'Symmetric glass layers vibrate at the same resonant frequency, transmitting sound. By pairing a 6mm outer pane with an 8.76mm acoustic laminated inner pane across a 16mm argon gap, acoustic resonance is disrupted.'
        }
      ]
    }
  },

  // 11. Low-E Glazing & Argon
  {
    id: 'art-11',
    slug: 'low-e-double-triple-glazing-argon-gas',
    category: 'glass',
    categoryLabel: { ar: 'الزجاج المعماري', ckb: 'جامی ئەندازیاری', en: 'Architectural Glazing' },
    title: {
      ar: 'زجاج Low-E المزدوج وغاز الآرجون: العلم وراء عكس الأشعة تحت الحمراء وخفض فاتورة الكهرباء',
      ckb: 'جامی لۆو-ئی (Low-E) و گازی ئارگۆن: زانستی عەزل و کەمکردنەوەی خەرجی کارەبا',
      en: 'Low-E Double Glazing & Argon Gas: Solar Control Science & Energy Efficiency'
    },
    summary: {
      ar: 'كيف تعكس طبقات أكسيد الفضة المجهرية حرارة الشمس دون حجب الضوء، ودور غاز الآرجون في منع انتقال الحرارة بالتوصيل.',
      ckb: 'چۆن چینی نانۆیی زیو ڕێگری لە گەرمی دەکات بەبێ کەمکردنەوەی ڕووناکی.',
      en: 'Understanding microscopic silver oxide solar coatings and inert argon gas thermal resistance in desert environments.'
    },
    readingTime: '5 min read',
    date: '2026-09-15',
    author: 'Doorhome Energy Team',
    image: './assets/doorhome/photo_2023-07-03_15-50-46-1104x700.jpg',
    tags: ['Low-E', 'غاز آرجون', 'زجاج مزدوج', 'توفير الطاقة', 'حرارة الصيف'],
    sections: {
      ar: [
        {
          heading: 'ما هو زجاج Low-E (الإنبعاثية المنخفضة)؟',
          body: 'هو زجاج معماري شفاف مطلي مجهرياً بطبقات نانوية غير مرئية من أكاسيد المعادن والفضة. يسمح بمرور الضوء الطبيعي المرئي بنسبة 70%، بينما يعكس الأشعة تحت الحمراء الحرارية وأشعة UV الضارة بنسبة تفوق 80%.'
        }
      ],
      en: [
        {
          heading: 'The Physics of Low-Emissivity Coatings',
          body: 'Microscopically thin metallic oxide coatings permit visible sunlight to illuminate rooms while selectively reflecting solar infrared heat radiation back outside.'
        }
      ]
    }
  },

  // 12. European Hardware - STAC Spain
  {
    id: 'art-12',
    slug: 'stac-spain-multipoint-security-locking-systems',
    category: 'hardware',
    categoryLabel: { ar: 'إكسسوارات وأقفال', ckb: 'قوفڵ و دەسک', en: 'Hardware' },
    title: {
      ar: 'إكسسوارات STAC الإسبانية: أقفال الأمان متعددة النقاط ومقاومة الاقتحام',
      ckb: 'ئێکسسواراتی ستاکی ئیسپانی: قوفڵی فرە-خاڵ بۆ پاراستنی ئەوپەڕی ماڵ',
      en: 'STAC Spain Multipoint Security Gears: Certified Anti-Burglary Performance'
    },
    summary: {
      ar: 'أهمية آليات القفل المتعدد على محيط الشباك والباب لمنع الاقتحام، وضمان الضغط المحكم لمنع تسرب الهواء والغبار.',
      ckb: 'گرنگی قوفڵی چوار دەوری پەنجەرە بۆ سەلامەتی و نەهێشتنی تۆز.',
      en: 'Exploring European perimeter shoot-bolts, mushroom cams, and tested 25,000-cycle durability in architectural fenestration.'
    },
    readingTime: '4 min read',
    date: '2026-09-14',
    author: 'Doorhome Hardware Dept',
    image: './assets/doorhome/brouchour-stac-1-1000x1000.jpg',
    tags: ['STAC Spain', 'أقفال أمان', 'إكسسوارات شبابيك', 'مفصلات أوروبية'],
    sections: {
      ar: [
        {
          heading: 'لماذا القفل بنقطة واحدة لم يعد كافياً؟',
          body: 'الأقفال التقليدية تغلق في نقطة واحدة بالمنتصف، مما يترك الزوايا العليا والسفلى عرضة للتسريب والخلع. تعتمد STAC على مسارات متحركة تقفل في 4 إلى 8 نقاط على كامل محيط الإطار ببراغي فولاذية لا يمكن كسرها بسهولة.'
        }
      ],
      en: [
        {
          heading: 'Why Single-Point Locks Fail',
          body: 'Single latch latches leave sash corners vulnerable to pry bars and air leaks. STAC multi-point perimeter systems lock into reinforced steel keeps along all four edges.'
        }
      ]
    }
  },

  // 13. Master Italy & Comunello
  {
    id: 'art-13',
    slug: 'master-italy-handles-comunello-heavy-rollers',
    category: 'hardware',
    categoryLabel: { ar: 'إكسسوارات إيطالية', ckb: 'کەرەستەی ئیتاڵی', en: 'Italian Hardware' },
    title: {
      ar: 'مقابض Master Italy وعجلات Comunello: الدقة الميكانيكية الإيطالية للأبواب الثقيلة',
      ckb: 'دەسکی ماستەری ئیتاڵی و ڕۆڵەری کۆمۆنێللۆ: کوالێتی بەرز بۆ دەرگای قورس',
      en: 'Master Italy Ergonomic Handles & Comunello Tandem Stainless Rollers'
    },
    summary: {
      ar: 'عجلات السحب المزدوجة التي تتحمل ضلفاً زجاجية بوزن 400 كغم، والمقابض الإيطالية المصقولة المقاومة للخدش والتآكل.',
      ckb: 'ڕۆڵەری بەهێزی دەرگای سلاید و دەسکی دژە ڕووشان بۆ ساڵانێکی درێژ.',
      en: 'Stainless steel dual-bearing roller engineering capable of sustaining 400kg patio doors with zero maintenance friction.'
    },
    readingTime: '4 min read',
    date: '2026-09-13',
    author: 'Doorhome Hardware Dept',
    image: './assets/doorhome/brouchour-Master-1-1000x1000.jpg',
    tags: ['Master Italy', 'Comunello', 'مقابض ايطالية', 'عجلات سحاب', 'تحمل عالي'],
    sections: {
      ar: [
        {
          heading: 'الهندسة الإيطالية في خدمة الأبواب الضخمة',
          body: 'عجلات Comunello المصنوعة من الستانلس ستيل المقاوم للصدأ مع محامل كروية دقيقة تضمن انزلاق الأبواب البانورامية الكبيرة لسنوات طويلة دون صوت أو اهتزاز.'
        }
      ],
      en: [
        {
          heading: 'Precision Ball Bearings and Heavy Load Capacities',
          body: 'Comunello tandem roller bogies distribute glass loads across dual stainless wheels, eliminating track deformation and ensuring silent gliding.'
        }
      ]
    }
  },

  // 14. EPDM Weatherseals
  {
    id: 'art-14',
    slug: 'epdm-continuous-weatherseals-sandstorm-rain-defense',
    category: 'hardware',
    categoryLabel: { ar: 'عزل الغبار', ckb: 'عەزلی تۆزوخۆڵ', en: 'Weatherseals' },
    title: {
      ar: 'مطاط EPDM البركاني المتواصل: الدرع الأول ضد العواصف الترابية ومياه الأمطار',
      ckb: 'لاستیکی EPDM: بەربەستی سەرەکی دژی تۆزوخۆڵ و زریانی بەهێز',
      en: 'Continuous EPDM Gaskets: Iraq’s Uncompromising Defense Against Sandstorms'
    },
    summary: {
      ar: 'لماذا يتشقق البلاستيك العادي في شمس العراق بينما يحتفظ مطاط EPDM بمرونته لأكثر من 30 سنة لمنع تسرب ذرات الغبار الناعمة.',
      ckb: 'بۆچی لاستیکی ئاسایی دەسوتێت لە بەر خۆردا بەڵام EPDM بەهێز دەمێنێتەوە.',
      en: 'The thermal science behind vulcanized EPDM rubber gaskets that resist 60°C ultraviolet radiation and desert dust storms.'
    },
    readingTime: '4 min read',
    date: '2026-09-12',
    author: 'Doorhome Material Specialists',
    image: './assets/doorhome/2-1.png',
    tags: ['EPDM', 'عواصف ترابية', 'عزل غبار', 'حشوات مطاطية', 'مقاومة الشمس'],
    sections: {
      ar: [
        {
          heading: 'تحدي الغبار الناعم في مدن العراق',
          body: 'عواصف الغبار الصيفية في بغداد والأنبار والنجف تتسلل عبر أدنى فجوة ميكروية. حشوات EPDM المتواصلة في زوايا قطاعات Doorhome تضغط بإحكام محكم يمنع دخول أصغر جزيئات التراب.'
        }
      ],
      en: [
        {
          heading: 'Middle Eastern Dust Storm Infiltration',
          body: 'Fine suspended dust penetrates conventional seals. Doorhome utilizes vulcanized continuous EPDM compression gaskets that adapt dynamically without shrinking.'
        }
      ]
    }
  },

  // 15. Motorized Guillotine Windows
  {
    id: 'art-15',
    slug: 'motorized-guillotine-glass-systems-cafes-villas',
    category: 'windows',
    categoryLabel: { ar: 'شبابيك كهربائية', ckb: 'پەنجەرەی کارەبایی', en: 'Automated Systems' },
    title: {
      ar: 'نوافذ الجيوتين الرأسية الآلية (Guillotine Glass): فخامة المقاهي والحدائق المنزلية',
      ckb: 'پەنجەرەی گیۆتینی کارەبایی: لووتکەی مۆدێرنی کافێ و حەوشەی ماڵان',
      en: 'Automated Vertical Guillotine Windows: Motorized Glass Walls for Terraces & Cafes'
    },
    summary: {
      ar: 'ألواح زجاجية تنزلق رأسياً بلمسة زر أو عبر الهاتف الذكي لتتحول من واجهة زجاجية مغلقة بالكامل إلى درابزين حماية مفتوح.',
      ckb: 'جام بە کۆنترۆڵ یان مۆبایل سەردەکەوێت و دەبێتە محاجەرەی پارێزبەند.',
      en: 'Motorized vertical retracting glass systems with Somfy motors that transform enclosed terraces into open-air verandas.'
    },
    readingTime: '5 min read',
    date: '2026-09-11',
    author: 'Doorhome Automation Studio',
    image: './assets/doorhome/signature-bg.jpg',
    tags: ['شبابيك جيوتين', 'نوافذ كهربائية', 'كافيهات', 'مطاعم', 'Somfy'],
    sections: {
      ar: [
        {
          heading: 'الميزة المزدوجة: نافذة ودرابزين في نفس الوقت',
          body: 'عندما تنزل الضلف الزجاجية المتحركة إلى الأسفل، تبقى الضلفة السفلية ثابتة كدرابزين زجاجي أنيق بارتفاع 1 متر، مما يمنح الجالسين إطلالة مفتوحة وهوائية منعشة.'
        }
      ],
      en: [
        {
          heading: 'Dual Functionality: Panoramic Window & Safety Balustrade',
          body: 'As the upper panels slide down via internal Somfy tubular motors, the bottom panel remains locked as a secure 1.1m glass balustrade.'
        }
      ]
    }
  },

  // 16. Structural Glass Skylights
  {
    id: 'art-16',
    slug: 'structural-glass-skylights-pyramid-atriums-iraq',
    category: 'glass',
    categoryLabel: { ar: 'أسقف زجاجية', ckb: 'سەربانی شووشە', en: 'Glass Skylights' },
    title: {
      ar: 'الأسقف الزجاجية والسكاي لايت الهرمي (Skylights): إضاءة طبيعية دون احتباس حراري',
      ckb: 'سەربانی شووشەی سکای لایت: ڕووناکی سروشتی بەبێ گەرمابوون',
      en: 'Architectural Glass Skylights & Atriums: Maximum Daylight with Zero Overheating'
    },
    summary: {
      ar: 'كيف تصمم سقفاً زجاجياً عازلاً ومقاوماً لتسرب مياه الأمطار الشديدة والأشعة الشمسية الحارقة للصالات والممرات الداخلية.',
      ckb: 'چۆن سەربانی شووشە دروست دەکرێت بۆ ڕۆشنکردنەوەی ژوورەوە.',
      en: 'Engineering structural glass pyramid and sloped atriums using ceramic frit and Low-E laminated double safety glass.'
    },
    readingTime: '5 min read',
    date: '2026-09-10',
    author: 'Doorhome Facade Engineering Dept',
    image: './assets/doorhome/photo_2023-07-03_15-42-28-1120x716.jpg',
    tags: ['سكاي لايت', 'اسقف زجاجية', 'اتريوم', 'ضوء طبيعي', 'عزل مائي'],
    sections: {
      ar: [
        {
          heading: 'العزل المائي 100% للأسقف الزجاجية',
          body: 'تتعرض الأسقف الزجاجية لأمطار شتوية مباشرة وأشعة شمس صيفية حارقة. نستخدم نظام قطاعات 50F المائلة المزودة بمجاري تصريف مياه داخلية ثلاثية تمنع أي تسريب.'
        }
      ],
      en: [
        {
          heading: '100% Watertight Sloped Engineering',
          body: 'Sloped glass assemblies require dedicated multi-tier drainage channels beneath structural silicone joints to redirect condensation water.'
        }
      ]
    }
  },

  // 17. Bioclimatic Pergolas
  {
    id: 'art-17',
    slug: 'bioclimatic-aluminum-pergolas-louvers-iraq',
    category: 'doors',
    categoryLabel: { ar: 'مظلات وبرجولات', ckb: 'مەزەلەی ئەلەمنیۆم', en: 'Pergolas' },
    title: {
      ar: 'برجولات الألمنيوم الذكية (Bioclimatic Pergolas): التحكم بالظل والمطر بنقرة زر',
      ckb: 'مەزەلەی زیرەکی ئەلەمنیۆم: کۆنترۆڵکردنی سێبەر و باران بە یەک دوگمە',
      en: 'Smart Bioclimatic Aluminum Louver Pergolas: Year-Round Outdoor Living in Iraq'
    },
    summary: {
      ar: 'شفرات ألمنيوم متحركة تدور بزوايا قابلة للتعديل للتحكم في تدفق الهواء والضوء، وتغلق بإحكام لتشكيل سقف عازل للمطر مع تصريف مدمج.',
      ckb: 'پەڕەی ئەلەمنیۆمی سووڕاوە بۆ ڕێکخستنی هەوا و سێبەر.',
      en: 'Motorized rotating aluminum louvers with integrated LED lighting and concealed gutter drainage for luxury villa gardens.'
    },
    readingTime: '5 min read',
    date: '2026-09-09',
    author: 'Doorhome Outdoor Architecture',
    image: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg',
    tags: ['برجولات', 'مظلات المنيوم', 'حدائق', 'جلسات خارجية', 'مطر'],
    sections: {
      ar: [
        {
          heading: 'التكيف الذكي مع فصول السنة في العراق',
          body: 'في الصيف، تدور الشفرات بزاوية تعكس أشعة الشمس وتسمح للهواء الدافئ بالصعود والخروج. وفي الشتاء، تقفل الشفرات تماماً وتتحول إلى سقف مانع للأمطار يوجه المياه إلى مزاريب خفية داخل الأعمدة.'
        }
      ],
      en: [
        {
          heading: 'Year-Round Outdoor Comfort in Middle East Climates',
          body: 'Rotating motorized aluminum louvers tilt to provide tailored shade while inducing micro-convection airflow during hot days, locking flush when rain begins.'
        }
      ]
    }
  },

  // 18. Office Acoustic Partitions
  {
    id: 'art-18',
    slug: 'office-acoustic-glass-partitions-24z-systems',
    category: 'doors',
    categoryLabel: { ar: 'قواطع مكاتب', ckb: 'جیاکەرەوەی ئۆفیس', en: 'Office Partitions' },
    title: {
      ar: 'قواطع المكاتب الزجاجية العازلة للصوت (24Z System): خصوصية واحترافية للمقرات والشركات',
      ckb: 'دیواری شووشەی ئۆفیس (24Z): پاراستنی دەنگ و ڕێکی بۆ کۆمپانیاکان',
      en: 'Acoustic Glass Office Partitions (24Z): Corporate Privacy & Modern Transparency'
    },
    summary: {
      ar: 'تقسيم قاعات الاجتماعات والمكاتب التنفيذية بزجاج دبل عازل للصوت وإطارات ألمنيوم نحيفة مع أبواب هيدروليكية مدمجة.',
      ckb: 'دابەشکردنی ژووری کۆبوونەوە بە شووشەی دەبڵی بێدەنگ.',
      en: 'Modular demountable double-glazed office partitions achieving 44 dB acoustic rating with slimline aluminum frames.'
    },
    readingTime: '4 min read',
    date: '2026-09-08',
    author: 'Doorhome Commercial Division',
    image: './assets/doorhome/OFFICE-PARTITION-24Z-Large-300x300.jpeg',
    tags: ['قواطع مكاتب', 'مكاتب زجاجية', 'عزل صوت للشركات', '24Z'],
    sections: {
      ar: [
        {
          heading: 'الخصوصية في الاجتماعات والمظهر المفتوح',
          body: 'نظام 24Z يمنح المكاتب شكلاً عصرياً شفافاً يعزز الإضاءة الطبيعية مع عزل صوتي كامل يحفظ سرية الاجتماعات التنفيذية.'
        }
      ],
      en: [
        {
          heading: 'Sound Isolation for Executive Boardrooms',
          body: 'Double glass partitions achieve acoustic rating Rw 44 dB, creating acoustically isolated meeting suites without sacrificing light.'
        }
      ]
    }
  },

  // 19. Securit vs Laminated Glass
  {
    id: 'art-19',
    slug: 'securit-tempered-vs-laminated-safety-glass',
    category: 'glass',
    categoryLabel: { ar: 'زجاج الأمان', ckb: 'جامی سەلامەتی', en: 'Safety Glass' },
    title: {
      ar: 'الفرق بين زجاج السيكوريت واللاميناتي: متى تستخدم كل نوع لسلامة عائلتك؟',
      ckb: 'جیاوازی نێوان جامی سێکۆریت و لامینەیت بۆ سەلامەتی ماڵەکەت',
      en: 'Tempered Securit vs. Laminated Safety Glass: Which Do You Need for Safety?'
    },
    summary: {
      ar: 'دليل المستهلك لفهم آلية تكسر الزجاج المقسى إلى حبيبات غير حادة والزجاج اللاميناتي الذي يبقى متماسكاً ولا يسقط عند الكسر.',
      ckb: 'شیکردنەوەی چۆنیەتی شکانی هەردوو جۆرە جامەکە بۆ ئەوپەڕی سەلامەتی.',
      en: 'A comprehensive homeowner breakdown of thermal tempering, shatterproof PVB interlayers, and safety building codes.'
    },
    readingTime: '5 min read',
    date: '2026-09-07',
    author: 'Doorhome Quality Assurance',
    image: './assets/doorhome/24-1.jpg',
    tags: ['سيكوريت', 'لاميناتي', 'زجاج امان', 'مقاومة الصدمات', 'حماية'],
    sections: {
      ar: [
        {
          heading: 'ما هو زجاج السيكوريت (Tempered Glass)؟',
          body: 'هو زجاج معالج حرارياً حتى 650 درجة مئوية ثم تبريده بسرعة فائقة، مما يجعله أقوى بـ 5 أضعاف من الزجاج العادي. عند كسره، يتحول إلى حبيبات دائرية صغيرة جداً غير حادة لا تسبب جروحاً خطيرة.'
        },
        {
          heading: 'ما هو الزجاج اللاميناتي (Laminated Glass)؟',
          body: 'يتكون من لوحي زجاج أو أكثر ملتصقين بطبقة بوليمرية مرنة قوية من مادة PVB. عند تعرضه لضربة قوية، قد يتشقق الزجاج كنسيج العنكبوت لكنه يظل متماسكاً في مكانه بنسبة 100% ولا يسقط أبداً، وهو المستخدم في الدرج الزجاجي والدرابزينات والواجهات المرتفعة.'
        }
      ],
      en: [
        {
          heading: 'Tempered Securit Glass Characteristics',
          body: 'Thermally treated at 650°C and quenched, increasing tensile strength 5x over float glass. If shattered, it breaks into blunt pebbles rather than dangerous shards.'
        },
        {
          heading: 'Laminated Glass Impact Retention',
          body: 'Two or more glass layers laminated with polyvinyl butyral (PVB). Upon impact, fractured fragments adhere firmly to the interlayer, preventing fall-through hazards.'
        }
      ]
    }
  },

  // 20. Deceuninck Legend 80
  {
    id: 'art-20',
    slug: 'deceuninck-legend-80-passive-house-upvc-iraq',
    category: 'upvc',
    categoryLabel: { ar: 'نوافذ uPVC', ckb: 'پەنجەرەی یو پی ڤی سی', en: 'uPVC Windows' },
    title: {
      ar: 'نظام ديكونينك ليجند 80 (Deceuninck Legend 80): معيار المنازل السلبية الألمانية في العراق',
      ckb: 'دیکۆنیک لیجەند ٨٠: ستانداردی ئەڵمانی بۆ پەنجەرەی عەزلی تەواو',
      en: 'Deceuninck Legend 80: The 6-Chamber German Passive House Standard in Iraq'
    },
    summary: {
      ar: 'عمق إطار 80 ملم، 6 حجرات عزل هوائية، وثلاث حشوات إحكام مطاطية تحقق أقصى درجات حفظ التبريد والهدوء الصوتي.',
      ckb: 'قووڵی ٨٠ ملم، ٦ خانەی عەزل، و سێ لاستیکی بەهێز بۆ پاراستنی فێنکی.',
      en: '80mm profile depth, 6 internal air chambers, and triple continuous seals engineered for maximum energy preservation in extreme climates.'
    },
    readingTime: '5 min read',
    date: '2026-09-06',
    author: 'Doorhome uPVC Department',
    image: './assets/showcase/showcase_legend80_1789926007847.jpg',
    tags: ['Deceuninck', 'Legend 80', 'uPVC', 'عزل حراري', 'المانيا'],
    sections: {
      ar: [
        {
          heading: 'هندسة الـ 6 حجرات الداخلية',
          body: 'تحتوي قطاعات Legend 80 على ست غرف هوائية منفصلة داخل البروفايل، تعمل كمصائد حرارية تمنع انتقال الحرارة بالكامل وتمنح الشباك تصنيف A+ في كفاءة الطاقة.'
        }
      ],
      en: [
        {
          heading: '6-Chamber Internal Geometry',
          body: '6 insulated air chambers act as thermal barriers, drastically cutting conduction and securing A+ energy efficiency ratings.'
        }
      ]
    }
  },

  // 21. Class S Severe Climate Certification
  {
    id: 'art-21',
    slug: 'class-s-severe-climate-certification-upvc-profiles',
    category: 'upvc',
    categoryLabel: { ar: 'شهادات الجودة', ckb: 'بڕوانامەی کوالێتی', en: 'Certifications' },
    title: {
      ar: 'شهادة المناخ القاسي Class S: لماذا يجب أن تتأكد منها قبل شراء نوافذ uPVC؟',
      ckb: 'بڕوانامەی کەشوهەوای توندی Class S بۆ پەنجەرەی uPVC',
      en: 'Class S Severe Climate Certification: Why It Is Crucial for Iraq uPVC Profiles'
    },
    summary: {
      ar: 'كيف تضمن شهادة Class S المعتمدة أوروبياً عدم اصفرار البروفايل أو تفتته أو انحنائه تحت أشعة الشمس فوق البنفسجية في صيف العراق.',
      ckb: 'چۆن دڵنیا دەبیتەوە پەنجەرەی uPVC لە بەر خۆردا زەرد نابێت و ناشکێت.',
      en: 'Understanding European EN 12608 Class S formulation with titanium dioxide stabilization against harsh solar UV radiation.'
    },
    readingTime: '4 min read',
    date: '2026-09-05',
    author: 'Doorhome Quality Assurance',
    image: './assets/doorhome/10.png',
    tags: ['Class S', 'جودة uPVC', 'مقاومة الاصفرار', 'مواصفات اوروبية'],
    sections: {
      ar: [
        {
          heading: 'خطر النوافذ غير المطابقة للمواصفات',
          body: 'البروفايلات الرخيصة المصممة لأوروبا المعتدلة (Class M) تصفر وتتشقق بعد صيفين في العراق. جميع قطاعات uPVC في Doorhome حاصلة على شهادة Class S المعززة بثاني أكسيد التيتانيوم ومثبتات الكالسيوم-زنك الصديقة للبيئة.'
        }
      ],
      en: [
        {
          heading: 'The Threat of Moderate Climate Profiles',
          body: 'Low-cost profiles engineered for mild Europe (Class M) yellow and turn brittle in Iraq. Doorhome profiles carry certified Class S severe climate ratings stabilized with titanium dioxide.'
        }
      ]
    }
  },

  // 22. Laser On-Site Surveying
  {
    id: 'art-22',
    slug: 'laser-on-site-surveying-precise-measurement-windows',
    category: 'guide',
    categoryLabel: { ar: 'دليل التنفيذ', ckb: 'ڕێبەری ئەندازیاری', en: 'Installation Guide' },
    title: {
      ar: 'القياس الهندسي بالليزر: لماذا المليمتر الواحد يحدد نجاح أو فشل عزل الشباك؟',
      ckb: 'پێوانەکردنی لەیزەری: بۆچی یەک میلیمەتر جیاوازی دەکات لە عەزلی پەنجەرەدا؟',
      en: 'Laser 3D On-Site Surveying: Why Every Millimeter Dictates Window Air-Tightness'
    },
    summary: {
      ar: 'خطوات الفحص الهندسي الميداني المجاني من Doorhome لضبط زوايا الفتحات والتأكد من استواء الحوائط الخرسانية قبل بدء التصنيع.',
      ckb: 'هەنگاوەکانی پێوانەکردنی بێبەرامبەر بە لەیزەر پێش دروستکردنی پەنجەرەکان.',
      en: 'How calibrated laser optical tools detect structural wall out-of-plumb deviations before factory CNC cutting begins.'
    },
    readingTime: '4 min read',
    date: '2026-09-04',
    author: 'Doorhome Field Survey Team',
    image: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg',
    tags: ['قياس ليزري', 'معاينة هندسية', 'تركيب شبابيك', 'دقة المصنع'],
    sections: {
      ar: [
        {
          heading: 'لا مجال للتقدير العشوائي في الفتحات المعمارية',
          body: 'الفتحات الخرسانية في مشاريع البناء نادراً ما تكون مستقيمة تماماً. مهندسونا يستخدمون أجهزة قياس ليزرية ثلاثية الأبعاد لفحص الاستقامة الرأسية والأفقية والأقطار، مما يضمن تركيباً محكماً بدون فراغات تتسرب منها المياه أو الهواء.'
        }
      ],
      en: [
        {
          heading: 'Zero Room for Tape-Measure Estimation',
          body: 'Rough masonry openings frequently exhibit tilt and diagonal variance. Doorhome uses calibrated 3D laser scanners to inspect plumb and diagonal squareness prior to CNC fabrication.'
        }
      ]
    }
  },

  // 23. Water Leaks & Drainage
  {
    id: 'art-23',
    slug: 'preventing-water-leaks-wind-infiltration-windows-iraq',
    category: 'windows',
    categoryLabel: { ar: 'العزل المائي', ckb: 'عەزلی ئاو', en: 'Weatherproofing' },
    title: {
      ar: 'منع تسرب مياه الأمطار في شتاء العراق: نظام غرف الضغط ومجاري التصريف الخفية',
      ckb: 'ڕێگری لە دزەکردنی ئاوی باران لە زستاندا: سیستەمی ئاوەڕۆی شاراوە',
      en: 'Zero Water Ingress in Winter Rain: Internal Pressure Decompression Chambers'
    },
    summary: {
      ar: 'كيف تمنع مجاري التصريف الأحادية الاتجاه ذات الصمامات تسرب مياه الأمطار الشديدة حتى أثناء هبوب الرياح القوية.',
      ckb: 'چۆن فنتەکانی ئاوەڕۆ ڕێگری لە دزەی باران دەکەن لە کاتی زریاندا.',
      en: 'The physics of hydrostatic head pressures, one-way drainage flaps, and cascading weeps in architectural fenestration.'
    },
    readingTime: '4 min read',
    date: '2026-09-03',
    author: 'Doorhome Engineering Lab',
    image: './assets/doorhome/photo_2023-07-03_15-42-28-1120x716.jpg',
    tags: ['تسرب مياه', 'تصريف امطار', 'عزل مائي', 'شتاء العراق'],
    sections: {
      ar: [
        {
          heading: 'مبدأ توازن الضغط (Pressure Equalization)',
          body: 'تحتوي قطاعاتنا على غرف ضغط مفرغة تسمح بتصريف مياه الأمطار إلى الخارج بسرعة فائقة دون أن تسحبها الرياح نحو الداخل بفضل صمامات الإرجاع الأحادية.'
        }
      ],
      en: [
        {
          heading: 'Pressure-Equalized Weep Cavities',
          body: 'Internal decompression chambers equalize indoor and outdoor air pressure, preventing wind-driven rain from being suctioned past exterior weatherstripping.'
        }
      ]
    }
  },

  // 24. Window & Door Pricing Guide
  {
    id: 'art-24',
    slug: 'aluminum-window-door-cost-breakdown-baghdad-erbil',
    category: 'guide',
    categoryLabel: { ar: 'دليل الأسعار', ckb: 'ڕێبەری نرخ', en: 'Pricing Guide' },
    title: {
      ar: 'دليل أسعار وتكلفة شبابيك وأبواب الألمنيوم والـ uPVC في بغداد وأربيل',
      ckb: 'ڕێبەری نرخ و تێچووی پەنجەرە و دەرگای ئەلەمنیۆم لە بەغدا و هەولێر',
      en: 'Window & Door Cost Guide in Iraq: What Dictates Prices per Square Meter?'
    },
    summary: {
      ar: 'العوامل الحقيقية المؤثرة في سعر المتر المربع: سماكة الألمنيوم، نوع الكسر الحراري، الزجاج العازل، الإكسسوارات الأوروبية، والضمان.',
      ckb: 'فاکتەرە سەرەکییەکانی دیاریکردنی نرخی پەنجەرە و دەرگا لە عێراقدا.',
      en: 'A transparent breakdown of profile extrusion weight, thermal polyamide width, glass configurations, and hardware lifecycle costs.'
    },
    readingTime: '6 min read',
    date: '2026-09-02',
    author: 'Doorhome Commercial Estimation Desk',
    image: './assets/doorhome/bg_catalogues.jpeg',
    tags: ['اسعار شبابيك المنيوم', 'تكلفة الابواب', 'سعر المتر', 'عروض اسعار', 'عراق'],
    sections: {
      ar: [
        {
          heading: 'لماذا تتفاوت الأسعار في السوق العراقي؟',
          body: 'يتفاجأ الكثير من العملاء باختلاف أسعار المتر المربع بين الشركات. الفارق يكمن في: سماكة جدار الألمنيوم (1.4 ملم مقابل 2.0 ملم)، جودة الزجاج (عادي مقابل Low-E معبأ بغاز الآرجون)، ونوعية الإكسسوارات (صينية رخيصة مقابل إسبانية وإيطالية مضمونة 25,000 دورة فتح وإغلاق).'
        }
      ],
      en: [
        {
          heading: 'Understanding Price Variations in the Iraqi Market',
          body: 'Square meter quotes vary significantly based on aluminum wall thickness (1.4mm vs 2.0mm structural grade), European certification, double-glazing gas fills, and premium Spanish STAC hardware.'
        }
      ]
    }
  },

  // 25. Colors & Architectural Finishes
  {
    id: 'art-25',
    slug: 'aluminum-finishes-anodized-powder-coating-colors',
    category: 'hardware',
    categoryLabel: { ar: 'الألوان والدهان', ckb: 'ڕەنگ و پۆشین', en: 'Finishes' },
    title: {
      ar: 'ألوان وتشطيبات الألمنيوم: الأنودايز (Anodized) والدهان الحراري (Powder Coating)',
      ckb: 'ڕەنگەکانی ئەلەمنیۆم: ئەنۆدایز و بۆیەی حەراری بەرگری هەتاو',
      en: 'Architectural Aluminum Finishes: Anodized Elegance vs. Electrostatic Powder Coating'
    },
    summary: {
      ar: 'دليل اختيار ألوان القطاعات: من الأسود المطفي والرمادي الأنتراسيت (Anthracite 7016) إلى ألوان الخشب الطبيعي ومقاومة الخدوش وأشعة الشمس.',
      ckb: 'هەڵبژاردنی باشترین ڕەنگ بۆ ڤێلاکەت کە لە بەر هەتاودا تێک ناچێت.',
      en: 'Comparing Qualicoat Class 2 powder coatings and architectural anodization for color fastness against intense desert sunlight.'
    },
    readingTime: '5 min read',
    date: '2026-09-01',
    author: 'Doorhome Surface Finishing Dept',
    image: './assets/doorhome/03-2.jpg',
    tags: ['الوان المنيوم', 'انودايز', 'بودرة حرارية', 'انثراسيت', 'Qualicoat'],
    sections: {
      ar: [
        {
          heading: 'ألوان العصر المعماري الحديث',
          body: 'اللون الرمادي الأنتراسيت (RAL 7016) والأسود المطفي يتربعان على عرش اختيارات الفلل الحديثة في أربيل وبغداد، نوفرها بضمان ثبات اللون ومقاومة الخدوش لعشرات السنين.'
        }
      ],
      en: [
        {
          heading: 'Modern Architectural Palette: Anthracite & Matt Black',
          body: 'Anthracite Grey (RAL 7016) and architectural textured matt black remain the leading choices for modern villas, certified by Qualicoat for UV resistance.'
        }
      ]
    }
  },

  // 26. Pool Glass Fencing
  {
    id: 'art-26',
    slug: 'pool-glass-fencing-safety-latches-villas',
    category: 'railings',
    categoryLabel: { ar: 'حواجز مسابح', ckb: 'پارێزبەندی مەلەوانگە', en: 'Pool Fencing' },
    title: {
      ar: 'حواجز وسياج المسابح الزجاجي: حماية مطلقة للأطفال دون حجب زرقة الماء',
      ckb: 'حاجزی شووشەی مەلەوانگە: سەلامەتی منداڵان بەبێ تێکدانی دیمەن',
      en: 'Frameless Glass Pool Fencing: Child Safety with Crystal-Clear Water Views'
    },
    summary: {
      ar: 'أبواب ذاتية الإغلاق بمغناطيس أمان، زجاج سيكوريت مقسى بدون فتحات لتسلق الأطفال، ومقاومة تامة لكلور المسابح والرطوبة.',
      ckb: 'دەرگای خۆکار داخراو بە موگناتیسی سەلامەت بۆ پاراستنی منداڵ لە مەلەوانگەدا.',
      en: 'Self-closing hydraulic glass gates, magnetic safety latches, and climb-resistant frameless tempered glass balustrades.'
    },
    readingTime: '4 min read',
    date: '2026-08-30',
    author: 'Doorhome Safety Engineers',
    image: './assets/doorhome/signature-bg.jpg',
    tags: ['حواجز مسابح', 'سياج زجاجي', 'امان الاطفال', 'مسابح فلل'],
    sections: {
      ar: [
        {
          heading: 'الأمان أولاً حول مسبح الفيلا',
          body: 'تصمم حواجز المسابح بدون أي بروزات أفقية يمكن للأطفال التسلق عليها، مع بوابات زجاجية تغلق ذاتياً وتثبت بمغناطيس لا يمكن للأطفال فتحه بسهولة.'
        }
      ],
      en: [
        {
          heading: 'Child Pool Safety Regulations',
          body: 'Glass pool balustrades eliminate horizontal footholds that enable climbing, incorporating self-closing hydraulic hinges and magnetic latching gates.'
        }
      ]
    }
  },

  // 27. Commercial Shopfronts
  {
    id: 'art-27',
    slug: 'commercial-shopfronts-automated-entrance-doors-iraq',
    category: 'doors',
    categoryLabel: { ar: 'واجهات تجارية', ckb: 'ڕووکاری بازرگانی', en: 'Commercial Entrances' },
    title: {
      ar: 'واجهات المحلات التجارية وأبواب المداخل الأوتوماتيكية: متانة للأوزان والتردد العالي',
      ckb: 'ڕووکاری بازرگانی و دەرگای کارەبایی مۆڵ و فرۆشگاکان',
      en: 'Heavy-Duty Commercial Shopfronts & Automatic Sliding Entrances in Iraq'
    },
    summary: {
      ar: 'تصميم واجهات المعارض والمتاجر الضخمة بزجاج سيكوريت مقاوم للصدمات وأبواب حساسة إلكترونية تتحمل آلاف دورات الفتح يومياً.',
      ckb: 'دیزاینی ڕووکاری فرۆشگای مۆدێرن بە جامی بەهێز و دەرگای سێنسەر.',
      en: 'Engineered commercial storefront profiles with automated motion-sensor glass doors built for high-traffic malls and corporate plazas.'
    },
    readingTime: '5 min read',
    date: '2026-08-28',
    author: 'Doorhome Commercial Team',
    image: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg',
    tags: ['واجهات محلات', 'ابواب اوتوماتيكية', 'سيكوريت تجاري', 'معارض'],
    sections: {
      ar: [
        {
          heading: 'التحمل الفائق في البيئات التجارية',
          body: 'تتطلب مداخل المتاجر والمولات محركات ومفصلات فائقة التحمل تعمل بسلاسة لمئات المرات في الساعة الواحدة مع زجاج أمان يمنع السرقات.'
        }
      ],
      en: [
        {
          heading: 'High Duty Cycle Commercial Reliability',
          body: 'High-footfall entrances require brushless automated sliding operators and heavy laminated security glass to deliver commercial endurance.'
        }
      ]
    }
  },

  // 28. Smart Digital Locks
  {
    id: 'art-28',
    slug: 'smart-digital-locks-aluminum-villa-entrance-doors',
    category: 'hardware',
    categoryLabel: { ar: 'الأقفال الذكية', ckb: 'قوفڵی زیرەک', en: 'Smart Access' },
    title: {
      ar: 'دمج الأقفال الذكية الرقمية في أبواب الألمنيوم: أمان بدون مفاتيح تقليدية',
      ckb: 'بەستنی قوفڵی زیرەک بە پەنجەمۆر لەسەر دەرگای ئەلەمنیۆمی ماڵ',
      en: 'Smart Digital Access for Aluminum Villa Doors: Biometrics, Face ID & App Control'
    },
    summary: {
      ar: 'فتح الأبواب ببصمة الإصبع، التعرف على الوجه، رمز الدخول، أو تطبيق الهاتف مع الحفاظ على القفل الميكانيكي الأوروبي عالي الأمان.',
      ckb: 'کردنەوەی دەرگا بە پەنجەمۆر و مۆبایل بە ئەوپەڕی سەلامەتی.',
      en: 'Seamlessly embedding mortise smart locks with biometric sensors into thermal break aluminum profiles.'
    },
    readingTime: '4 min read',
    date: '2026-08-25',
    author: 'Doorhome Smart Solutions',
    image: './assets/doorhome/03-2.jpg',
    tags: ['أقفال ذكية', 'بصمة الاصبع', 'أبواب المنيوم ذكية', 'سمارت هوم'],
    sections: {
      ar: [
        {
          heading: 'وداعاً لنسيان المفاتيح',
          body: 'ندمج أقفال الأمان الذكية الأوروبية داخل قطاعات الألمنيوم بشكل أنيق متناسق، مع إمكانية فتح الباب للضيوف عن بعد عبر الهاتف وتوثيق سجل الدخول.'
        }
      ],
      en: [
        {
          heading: 'Keyless Convenience Meets Physical Security',
          body: 'Doorhome seamlessly integrates multi-bolt smart digital locks inside insulated aluminum doors, giving owners remote access logging and biometric ease.'
        }
      ]
    }
  },

  // 29. Maintenance & Care Guide
  {
    id: 'art-29',
    slug: 'maintenance-cleaning-guide-architectural-aluminum-glass-iraq',
    category: 'guide',
    categoryLabel: { ar: 'دليل الصيانة', ckb: 'ڕێبەری پاککردنەوە', en: 'Maintenance' },
    title: {
      ar: 'دليل صيانة وتنظيف شبابيك وأبواب الألمنيوم والواجهات في بيئة العراق المغبرة',
      ckb: 'ڕێبەری پاککردنەوە و چاککردنی پەنجەرە و دەرگای ئەلەمنیۆم لە تۆزوخۆڵ',
      en: 'Maintenance & Cleaning Guide for Architectural Aluminum & Glass in Dusty Climates'
    },
    summary: {
      ar: 'نصائح عملية للحفاظ على سلاسة عجلات السحاب، تنظيف مجاري تصريف الأمطار، وإدامة لمعان الألمنيوم والزجاج لسنوات طويلة.',
      ckb: 'ئامۆژگاری بۆ پاککردنەوەی ڕێڕەوی سلاید و مانەوەی بریسکەی جام.',
      en: 'Actionable seasonal maintenance tips to keep sliding tracks clean, lubricate hardware, and preserve glass clarity.'
    },
    readingTime: '5 min read',
    date: '2026-08-20',
    author: 'Doorhome After-Sales Service',
    image: './assets/doorhome/bg.jpeg',
    tags: ['صيانة شبابيك', 'تنظيف الزجاج', 'صيانة ابواب سحاب', 'ارشادات'],
    sections: {
      ar: [
        {
          heading: 'خطوات بسيطة تطيل عمر الشباك لـ 30 عاماً',
          body: 'تنظيف السكة السفلية من الأتربة بفرشاة ناعمة كل بضعة أشهر، واستخدام الماء الدافئ والصابون المتعادل لتنظيف الألمنيوم وتجنب المنظفات الكيميائية الحارقة.'
        }
      ],
      en: [
        {
          heading: 'Preserving Smooth Operation Over Decades',
          body: 'Vacuum dust from sliding bottom tracks periodically and apply silicone-based dry lubricant to rollers once yearly to maintain silent operation.'
        }
      ]
    }
  },

  // 30. Why Doorhome Standard
  {
    id: 'art-30',
    slug: 'why-doorhome-engineering-factory-precision-10-year-warranty',
    category: 'guide',
    categoryLabel: { ar: 'معايير دور هوم', ckb: 'ستانداردی دەرگای ماڵ', en: 'Doorhome Standard' },
    title: {
      ar: 'معايير Doorhome الهندسية: دقة المصنع، القص بالليزر، وضمان رسمي 10 سنوات',
      ckb: 'ستانداردەکانی دەرگای ماڵ (Doorhome): کارگەی پێشکەوتوو و گرەنتی ١٠ ساڵ',
      en: 'The Doorhome Standard: Factory CNC Precision, Zero Compromise & 10-Year Warranty'
    },
    summary: {
      ar: 'ما الذي يجعل مصنع ومعرض Doorhome في أربيل وبغداد الخيار الموثوق لأصحاب الفلل، المهندسين المعماريين، وشركات المقاولات في العراق.',
      ckb: 'بۆچی کۆمپانیای دەرگای ماڵ متمانەپێکراوترینە بۆ خاوەن ڤێلا و ئەندازیاران.',
      en: 'How state-of-the-art CNC machining, certified European profiles, and an official 10-year warranty set the gold standard in Iraq.'
    },
    readingTime: '6 min read',
    date: '2026-08-15',
    author: 'Doorhome Executive Engineering Management',
    image: './assets/doorhome/doorhome-logo.jpg',
    tags: ['Doorhome', 'باب المنزل', 'دەرگای ماڵ', 'ضمان 10 سنوات', 'مصنع أربيل وبغداد', 'كواليتي'],
    keySpecs: [
      { label: 'Official Warranty', value: '10 Years Comprehensive' },
      { label: 'Machining Standard', value: '4-Axis CNC Milling & Corner Crimping' },
      { label: 'Coverage Area', value: 'Baghdad, Erbil, Sulaymaniyah, Duhok & All Iraq' }
    ],
    sections: {
      ar: [
        {
          heading: 'الهندسة التي تبدأ من المصنع وليس من الورشة',
          body: 'في Doorhome، تخضع جميع القطاعات لقص وتفريز آلي باستخدام ماكينات CNC رباعية المحاور، مع كبس الزوايا بضغط هيدروليكي وحقن إيبوكسي ألماني (2-Part Corner Adhesive)، مما يجعل الزوايا كتلة واحدة صلبة لا تنفصل أو تتسرب منها المياه أبداً.'
        },
        {
          heading: 'الضمان الرسمي ودعم ما بعد البيع في كل محافظات العراق',
          body: 'نقدم لجميع عملائنا شهادة ضمان رسمية لمدة 10 سنوات تغطي ثبات الألوان، العزل الحراري، عدم تكثف بخار الماء داخل الزجاج المزدوج، وجودة عمل آليات الإغلاق الأوروبية، مع فريق صيانة سريع يغطي أربيل، بغداد، السليمانية، دهوك، وكافة المحافظات.'
        }
      ],
      en: [
        {
          heading: 'Factory CNC Precision vs. Manual Workshops',
          body: 'Every system is cut, routed, and crimped using calibrated 4-axis industrial CNC machining with German 2-part polyurethane corner adhesives, guaranteeing air-tight joints.'
        },
        {
          heading: 'The 10-Year Comprehensive Written Warranty',
          body: 'Every Doorhome project includes an official 10-year warranty covering profile powder coating, thermal break performance, hermetic double-glazing seal, and European multipoint locking mechanisms.'
        }
      ]
    }
  }
];

export function getArticleBySlug(slug: string): ArchitecturalArticle | undefined {
  return ARCHITECTURAL_ARTICLES.find((a) => a.slug === slug || a.id === slug);
}
