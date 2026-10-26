export interface ProductItem {
  id: string;
  name: string;
  kurdishName?: string;
  arabicName?: string;
  category: 'windows' | 'doors' | 'glass' | 'railings' | 'accessories' | 'upvc' | 'aluminum' | string;
  division?: 'windows' | 'doors' | 'glass' | 'railings' | 'accessories' | string;
  subCategory?: string;
  image: string;
  fallbackImage: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  description: string;
  kurdishDescription?: string;
  arabicDescription?: string;
  chambers?: number;
  depth?: string;
  heights?: string;
  dimensions?: string;
  insulationValue?: string;
  acousticValue?: string;
  features: string[];
  colors?: string[];
  specs?: Record<string, string>;
  basePrice?: number;
  pricePerSqm?: number;
  unitPrice?: number;
  profitMargin?: number;
  currency?: 'USD' | 'IQD';
  modelNumber?: string;
  modelId?: string;
  material?: string;
  brand?: string;
  origin?: string;
  rating?: number;
  reviewsCount?: number;
  discountBadge?: string;
  originalPrice?: number;
  soldCount?: string;
  pricing?: {
    unitPrice?: number;
    pricePerSqm?: number;
    currency?: 'USD' | 'IQD';
  };
  translations?: Record<string, {
    name?: string;
    description?: string;
    subCategory?: string;
    features?: string[];
  }>;
}

export interface BrochureItem {
  id: string;
  title: string;
  brand: string;
  origin: string;
  coverImage: string;
  fallbackCover: string;
  description: string;
  pages: number;
  fileSize: string;
  downloadUrl: string;
  highlights: string[];
}

export const DOORHOME_CONTACT = {
  companyName: "Doorhome Company",
  parentCompany: "Bab Al Manzil",
  fullName: "Doorhome Company (Bab Al Manzil)",
  tagline: "Architectural uPVC & Aluminum Solutions in Iraq",
  logo: "/doorhome-logo.jpg",
  logoFallback: "/doorhome-logo.jpg",
  nafzaLogo: "/doorhome-logo.jpg",
  nafzaFallback: "/doorhome-logo.jpg",
  hotline: "00964-750-738-8748",
  hotlineRaw: "+9647507388748",
  phone: "+964 750 738 8748",
  email: "info@doorhome.company",
  website: "https://doorhome.company",
  branches: {
    sales: {
      name: "Sales & Showroom Branch",
      phones: ["+964 750 738 8748", "+964 750 444 0402"],
      phonesRaw: ["+9647507388748", "+9647504440402"],
      description: "Consultations, architectural specifications & client showroom"
    },
    manufacturing: {
      name: "Manufacturing & Fabrication Plant",
      phones: ["+964 750 738 8748", "+964 750 222 0402"],
      phonesRaw: ["+9647507388748", "+9647502220402"],
      description: "CNC profile processing, double glazing assembly & logistics dispatch"
    }
  },
  emails: ["info@doorhome.company", "info@doorhome.co", "doorhome-iq@hotmail.com"],
  address: "Baghdad, Iraq • 33.3118611° N, 44.4608056° E",
  coordinates: {
    lat: 33.3118611,
    lng: 44.4608056,
    formatted: "33.3118611° N, 44.4608056° E"
  },
  workHours: "Saturday – Thursday: 9:00 AM – 6:00 PM (Friday: Closed)",
  workHoursArabic: "السبت – الخميس: ٠٩:٠٠ صباحاً – ٠٦:٠٠ مساءً (الجمعة عطلة)",
  workHoursKurdish: "شەممە – پێنجشەممە: ٩:٠٠ی بەیانی – ٦:٠٠ی ئێوارە (هەینی پشوو)",
  whatsapp: "+9647507388748",
  instagramUrl: "https://www.instagram.com/door.home3",
  tiktokUrl: "https://www.tiktok.com/@door.home0?_r=1&_t=ZS-98yzfkS48ov",
  googleMapsUrl: "https://maps.app.goo.gl/tWg9W2x8QfEpRY4Q9",
  mapEmbedUrl: "https://maps.google.com/maps?q=33.3118611,44.4608056&hl=en&z=17&output=embed"
};

export const PARTNER_LOGOS = [
  {
    src: "./assets/doorhome/1-2.png",
    fallbackSrc: "http://doorhome.co/wp-content/uploads/2018/12/1-2.png",
    alt: "Deceuninck",
    title: "Deceuninck uPVC Systems",
    country: "Belgium",
    category: "uPVC Profiles"
  },
  {
    src: "./assets/doorhome/2-1.png",
    fallbackSrc: "http://doorhome.co/wp-content/uploads/2018/12/2-1.png",
    alt: "Winsa",
    title: "Winsa Windows & Doors",
    country: "Europe",
    category: "uPVC Profiles"
  },
  {
    src: "./assets/doorhome/3-1.png",
    fallbackSrc: "http://doorhome.co/wp-content/uploads/2018/12/3-1.png",
    alt: "Master Italy",
    title: "Master Italy Hardware",
    country: "Italy",
    category: "Architectural Hardware"
  },
  {
    src: "./assets/doorhome/4-1.png",
    fallbackSrc: "http://doorhome.co/wp-content/uploads/2018/12/4-1.png",
    alt: "Lorenzoline",
    title: "Lorenzoline Aluminum Systems",
    country: "Turkey / Europe",
    category: "Aluminum Profiles"
  },
  {
    src: "./assets/doorhome/5-2.png",
    fallbackSrc: "http://doorhome.co/wp-content/uploads/2018/12/5-2.png",
    alt: "Comunello",
    title: "Comunello Window Automation",
    country: "Italy",
    category: "Automation & Fittings"
  },
  {
    src: "./assets/doorhome/6-2.png",
    fallbackSrc: "http://doorhome.co/wp-content/uploads/2018/12/6-2.png",
    alt: "STAC",
    title: "STAC Architectural Hardware",
    country: "Spain",
    category: "Hardware & Polyamides"
  },
  {
    src: "./assets/doorhome/7-1.png",
    fallbackSrc: "http://doorhome.co/wp-content/uploads/2018/12/7-1.png",
    alt: "Vorne",
    title: "Vorne Multi-Locking Systems",
    country: "Europe",
    category: "Tilt & Turn Hardware"
  },
  {
    src: "./assets/doorhome/8-1.png",
    fallbackSrc: "http://doorhome.co/wp-content/uploads/2018/12/8-1.png",
    alt: "Gretsch-Unitas",
    title: "G-U Lift & Slide Systems",
    country: "Germany",
    category: "Sliding Systems"
  },
  {
    src: "./assets/doorhome/9-1.png",
    fallbackSrc: "http://doorhome.co/wp-content/uploads/2018/12/9-1.png",
    alt: "Hoppe",
    title: "Hoppe Handle Hardware",
    country: "Germany",
    category: "Architectural Handles"
  },
  {
    src: "./assets/doorhome/10.png",
    fallbackSrc: "http://doorhome.co/wp-content/uploads/2018/12/10.png",
    alt: "Nafza Group",
    title: "Nafza Almanzl Holding",
    country: "Iraq",
    category: "Parent Enterprise"
  }
];

export const WINDOWS_PRODUCTS: ProductItem[] = [
  {
    id: "legend-80",
    name: "Deceuninck Legend 80 Passive Series",
    category: "windows",
    division: "windows",
    subCategory: "Ultra Thermal Performance",
    modelNumber: "Legend 80",
    material: "uPVC Class S Severe Climate",
    brand: "Deceuninck",
    origin: "Deceuninck • Belgium / Erbil Plant",
    rating: 5.0,
    reviewsCount: 142,
    discountBadge: "18% OFF",
    originalPrice: 220,
    soldCount: "340+ installed",
    videoUrl: "/products-assets/video_2026-09-26_07-36-00.mp4",
    mediaType: "video",
    image: "/products-assets/photo_3_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/11-2.jpg",
    description: "The pinnacle of thermal and acoustic performance. Engineered with an 80mm installation depth and 6 internal chambers to withstand Erbil summer heat over 50°C.",
    chambers: 6,
    depth: "80 mm",
    insulationValue: "Uf = 0.92 W/m²K",
    acousticValue: "Rw = 45 dB",
    basePrice: 180,
    pricePerSqm: 180,
    unitPrice: 180,
    currency: "USD",
    pricing: { unitPrice: 180, pricePerSqm: 180, currency: "USD" },
    features: [
      "6-Chamber design meeting rigorous low-energy architectural standards",
      "Triple seal barrier with middle acoustic compression gasket",
      "Supports heavy triple-glazed units up to 52mm thickness",
      "Heavy load-bearing hinges for oversized ceiling-height sashes",
      "Resistant to high ultraviolet solar radiation and sandstorms"
    ],
    colors: ["Anthracite Grey", "Golden Oak", "White", "Sheffield Oak", "Basalt Grey"],
    specs: {
      "Frame Depth": "80 mm",
      "Chamber Count": "6 Chambers",
      "Gasket Type": "3 Continuous Compression Gaskets",
      "Reinforcement": "Heavy Industrial Structural Steel",
      "Thermal Transmittance": "0.92 W/m²K",
      "Sound Insulation": "Up to 45 dB"
    },
    translations: {
      ar: {
        name: "نظام ديسونينك ليجند 80 للمباني الموفرة للطاقة",
        description: "قمة الأداء الحراري والصوتي. مصمم بعمق 80 ملم و 6 غرف عزل داخلية لمقاومة حرارة صيف العراق الشديدة فوق 50 درجة مئوية.",
        subCategory: "عزل حراري فائق 6 غرف",
        features: [
          "تصميم 6 غرف عزل يطابق أعلى المعايير المعمارية الأوروبية",
          "نظام عزل ثلاثي مع جوان ضغط وسطي مانع للصوت والأتربة",
          "يدعم الزجاج الثلاثي السميك حتى 52 ملم",
          "مفصلات فولاذية متطورة تتحمل الأحمال العالية للنوافذ الكبيرة"
        ]
      },
      ckb: {
        name: "سیستەمی دیسۆنینک لیجند 80ی عەزلی تەواو",
        description: "لووتکەی ئەدای گەرمی و دەنگی. بە قوڵایی 80 ملم و 6 ژووری عەزل دروستکراوە بۆ بەرگەگرتنی گەرمای توندی هاوین لە سەرووی 50 پلەی سەدی.",
        subCategory: "عەزلی گەرمی پێشکەوتوو ٦ خانە",
        features: [
          "دیزاینی ٦-خانەیی بەپێی بەرزترین ستانداردە ئەوروپییەکان",
          "سیستەمی سێ بەرگری لاستیکی بۆ رێگری لە دەنگ و تۆز",
          "پشتگیری لە جامەکانی سێ-قاتی قورس دەکات تا ئەستووری 52 ملم",
          "مفەسەڵاتی بەهێز بۆ پەنجەرە باڵابەرزەکانی سەرانسەری"
        ]
      }
    }
  },
  {
    id: "winsa-dorado-76",
    name: "Winsa Dorado 76 Acoustic Series",
    category: "windows",
    division: "windows",
    subCategory: "Acoustic Insulation",
    modelNumber: "Dorado 76",
    material: "uPVC Multi-Chamber",
    brand: "Winsa",
    origin: "Winsa • Europe / Doorhome",
    rating: 4.9,
    reviewsCount: 98,
    discountBadge: "15% OFF",
    originalPrice: 190,
    soldCount: "210+ installed",
    videoUrl: "/products-assets/video_2026-09-26_07-36-00 (2).mp4",
    mediaType: "video",
    image: "/products-assets/photo_7_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/2-1.png",
    description: "Heavy-duty 76mm opening system suitable for urban apartments and luxury residences requiring high acoustic insulation and wind tightness.",
    chambers: 5,
    depth: "76 mm",
    insulationValue: "Uf = 1.05 W/m²K",
    acousticValue: "Rw = 42 dB",
    basePrice: 160,
    pricePerSqm: 160,
    unitPrice: 160,
    currency: "USD",
    pricing: { unitPrice: 160, pricePerSqm: 160, currency: "USD" },
    features: [
      "5-Chamber profile layout engineered for heavy thermal blocking",
      "Reinforced galvanized steel cores against desert wind pressure",
      "Multi-point perimeter security espagnolettes",
      "Acoustic laminated double/triple glazing options up to 44mm"
    ],
    colors: ["Anthracite Grey", "Golden Oak", "White", "Dark Walnut"],
    specs: {
      "Frame Depth": "76 mm",
      "Chamber Count": "5 Chambers",
      "Sound Isolation": "Rw = 42 dB",
      "Thermal Rating": "Uf 1.05 W/m²K"
    },
    translations: {
      ar: {
        name: "وينسا دورادو 76 نظام العزل الصوتي",
        description: "نظام فتح متين بعمق 76 ملم مخصص للمنازل والشقق الفاخرة لتوفير أعلى درجات الهدوء وعزل الضوضاء الحضرية والرياح.",
        subCategory: "عزل صوتي فائق 5 غرف",
        features: [
          "هيكل 5 غرف مصمم لحجب الحرارة والضوضاء الخارجية",
          "حديد مجلفن مدعم لمقاومة ضغط الرياح العاتية",
          "أقفال أمان متعددة النقاط لمحيط النافذة بالكامل"
        ]
      },
      ckb: {
        name: "وینسا دۆرادۆ 76ی عەزلی دەنگی و گەرمی",
        description: "سیستەمی 76 ملمی پتەو بۆ شوقە و ڤێلا مۆدێرنەکان کە پێویستیان بە بێدەنگی تەواو و پاراستنە لە ژاوەژاوی شار.",
        subCategory: "عەزلی دەنگی ٥ خانە",
        features: [
          "دیزاینی ٥-خانەیی بۆ کەمکردنەوەی گەرمی و دەنگ",
          "ئاسنی گالڤانایزکراوی بەهێزکراو دژ بە شۆکی با",
          "قوفڵکاری چەند خاڵیی ئەمنی بە درێژایی چێوەکە"
        ]
      }
    }
  },
  {
    id: "upvc-everest-max-60",
    name: "EVEREST MAX 60 MM",
    category: "windows",
    division: "windows",
    subCategory: "Classic Residential",
    modelNumber: "Everest Max 60",
    material: "uPVC Class S",
    brand: "Deceuninck",
    origin: "Deceuninck • Belgium / Erbil Plant",
    rating: 4.8,
    reviewsCount: 76,
    discountBadge: "15% OFF",
    originalPrice: 145,
    soldCount: "420+ installed",
    image: "/products-assets/photo_12_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/03-2.jpg",
    description: "Engineered specifically for extreme temperature fluctuations, the 60mm Everest Max system features 4 internal chambers and dual EPDM co-extruded gaskets.",
    chambers: 4,
    depth: "60 mm",
    insulationValue: "Uf = 1.2 W/m²K",
    acousticValue: "Rw = 36 dB",
    basePrice: 120,
    pricePerSqm: 120,
    unitPrice: 120,
    currency: "USD",
    pricing: { unitPrice: 120, pricePerSqm: 120, currency: "USD" },
    features: [
      "4-Chamber profile structure for balanced thermal efficiency",
      "Co-extruded TPE or EPDM weather seals preventing air infiltration",
      "Galvanized steel reinforcement channels for structural rigidity",
      "Glazing capability from 4mm single glass up to 32mm acoustic double glass"
    ],
    colors: ["White", "Golden Oak", "Anthracite Grey", "Nussbaum"],
    specs: {
      "Frame Depth": "60 mm",
      "Chamber Count": "4 Chambers",
      "Thermal Transmittance": "1.2 W/m²K"
    },
    translations: {
      ar: {
        name: "إيفرست ماكس 60 ملم الاقتصادي المتين",
        description: "نظام سكني عملي ومتين بعمق 60 ملم و 4 غرف عزل لتوفير المتانة والعزل الموثوق للمشاريع السكنية.",
        subCategory: "سكني كلاسيكي"
      },
      ckb: {
        name: "ئیڤرست ماکس 60 ملم نیشتەجێبوون",
        description: "سیستەمی پراکتیکی 60 ملمی ٤-خانەیی بۆ خانوو و پرۆژەی نیشتەجێبوون بە گەرەنتی و عەزلی متمانەپێکراو.",
        subCategory: "کلاسیکی نیشتەجێبوون"
      }
    }
  },
  {
    id: "upvc-legend-art-70",
    name: "LEGEND ART 70 MM",
    category: "windows",
    division: "windows",
    subCategory: "Premium Architectural",
    modelNumber: "Legend Art 70",
    material: "uPVC Class S",
    brand: "Deceuninck",
    origin: "Deceuninck • Belgium / Erbil Plant",
    rating: 4.9,
    reviewsCount: 114,
    discountBadge: "14% OFF",
    originalPrice: 175,
    soldCount: "290+ installed",
    image: "/products-assets/photo_22_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/8-2.jpg",
    description: "Sleek bevelled aesthetic with a 5-chamber design that balances contemporary architectural elegance with class-leading acoustic and thermal barriers.",
    chambers: 5,
    depth: "70 mm",
    insulationValue: "Uf = 1.1 W/m²K",
    acousticValue: "Rw = 42 dB",
    basePrice: 150,
    pricePerSqm: 150,
    unitPrice: 150,
    currency: "USD",
    pricing: { unitPrice: 150, pricePerSqm: 150, currency: "USD" },
    features: [
      "Slim frame sightline with 5 thermal insulating chambers",
      "Optimized central gasket system for extreme air and water tightness",
      "Glazing pocket depth accepting triple glazing up to 44mm"
    ],
    colors: ["Anthracite Grey", "Golden Oak", "Win-Wood", "White"],
    specs: {
      "Frame Depth": "70 mm",
      "Chamber Count": "5 Chambers",
      "Thermal Transmittance": "1.1 W/m²K"
    },
    translations: {
      ar: {
        name: "ليجند آرت 70 ملم المعماري الأنيق",
        description: "مظهر جمالي نحيف بحواف مشطوفة و 5 غرف عزل تجمع بين الأناقة المعمارية المعاصرة والعزل الصوتي والحراري الممتاز.",
        subCategory: "معماري متميز"
      },
      ckb: {
        name: "لیجند ئارت 70 ملمی نژیاروانی مۆدێرن",
        description: "دیزاینی باریک و شیک بە ٥ ژووری عەزل بۆ هاوسەنگی تەواو لە نێوان جوانی و عەزلی گەرمی و دەنگی.",
        subCategory: "نژیاروانی پێشکەوتوو"
      }
    }
  },
  {
    id: "lorenzo-60t",
    name: "Lorenzo 60T Thermal Casement Window",
    category: "windows",
    division: "windows",
    subCategory: "Thermal Casement Windows",
    modelNumber: "Lorenzo 60T",
    material: "Thermal Break Aluminum",
    brand: "Lorenzoline",
    origin: "Lorenzoline • Europe / Erbil Plant",
    rating: 4.8,
    reviewsCount: 64,
    discountBadge: "15% OFF",
    originalPrice: 230,
    soldCount: "180+ installed",
    videoUrl: "/products-assets/video_2026-09-26_07-36-00 (3).mp4",
    mediaType: "video",
    image: "/products-assets/photo_39_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/3-2.jpg",
    description: "Architectural thermal break aluminum casement window with multi-point perimeter security locking and European weather seals.",
    depth: "60 mm frame",
    insulationValue: "Uf = 1.6 W/m²K",
    acousticValue: "Rw = 39 dB",
    basePrice: 195,
    pricePerSqm: 195,
    unitPrice: 195,
    currency: "USD",
    pricing: { unitPrice: 195, pricePerSqm: 195, currency: "USD" },
    features: [
      "24mm Polyamide thermal insulation barrier",
      "European standard multi-point locking perimeter",
      "Double and triple glazing compatibility up to 38mm",
      "Electrostatic architectural powder coat finish"
    ],
    colors: ["Anthracite Grey", "Matte Black", "Champagne Anodized", "Titanium Silver"],
    specs: {
      "Frame Depth": "60 mm",
      "Thermal Barrier": "Polyamide 24 mm",
      "Max Sash Weight": "130 kg"
    },
    translations: {
      ar: {
        name: "نافذة لورينزو 60T ألمنيوم عازل حرارياً",
        description: "نافذة مفصلية من الألمنيوم العازل حرارياً بجسر بولياميد 24 ملم مع أقفال أمان أوروبية محيطية متعددة النقاط.",
        subCategory: "ألمنيوم عازل حرارياً"
      },
      ckb: {
        name: "پەنجەرەی لۆرێنزۆ 60T ئەلۆمنیۆمی عەزل",
        description: "پەنجەرەی ئەلۆمنیۆمی سێرمالبڕێک بە بەربەستی پۆلیامایدی 24 ملم و قوفڵکاری فرە-خاڵی ئەوروپی.",
        subCategory: "ئەلۆمنیۆمی گەرمیبڕ"
      }
    }
  }
];

export const DOORS_PRODUCTS: ProductItem[] = [
  {
    id: "lorenzo-70ls",
    name: "Lorenzoline 70LS Lift & Slide",
    category: "doors",
    division: "doors",
    subCategory: "Thermal Monumental Sliding",
    modelNumber: "Lorenzo 70LS",
    material: "Thermal Break Aluminum (Polyamide 24mm)",
    brand: "Lorenzoline",
    origin: "Lorenzoline • Europe / Doorhome Erbil",
    rating: 5.0,
    reviewsCount: 220,
    discountBadge: "16% OFF",
    originalPrice: 310,
    soldCount: "520+ installed",
    videoUrl: "/products-assets/video_2026-09-26_07-36-00 (4).mp4",
    mediaType: "video",
    image: "/products-assets/photo_1_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/03-2.jpg",
    description: "Architectural sliding system enabling panoramic floor-to-ceiling glass spans up to 3 meters with finger-touch glide and exceptional thermal insulation.",
    depth: "70 mm leaf / 160 mm frame",
    insulationValue: "Uf = 1.9 W/m²K",
    acousticValue: "Rw = 40 dB",
    basePrice: 260,
    pricePerSqm: 260,
    unitPrice: 260,
    currency: "USD",
    pricing: { unitPrice: 260, pricePerSqm: 260, currency: "USD" },
    features: [
      "24mm Polyamide thermal break strips isolating internal and external environments",
      "Heavy-duty stainless steel tracks carrying up to 400kg per sash",
      "Concealed drainage system preventing water pooling in torrential downpours",
      "Multi-point perimeter locking for high security and draft exclusion"
    ],
    colors: ["Matte Black (RAL 9005)", "Anthracite (RAL 7016)", "Champagne Anodized", "Titanium Silver"],
    specs: {
      "Leaf Depth": "70 mm",
      "Max Load": "400 kg / Leaf",
      "Thermal Break": "Polyamide 24 mm",
      "Max Height": "3200 mm"
    },
    translations: {
      ar: {
        name: "لورينزولاين 70LS نظام السحب والرفع البانورامي",
        description: "نظام أبواب سحاب ضخم يتيح واجهات زجاجية بانورامية ممتدة من الأرض إلى السقف حتى ارتفاع 3.2 متر مع حركة انسيابية بلمسة إصبع.",
        subCategory: "سحاب عملاق عازل حرارياً",
        features: [
          "جسور بولياميد 24 ملم لعزل حراري كامل بين الداخل والخارج",
          "سكك وإطارات ستانلس ستيل فائقة القوة تتحمل 400 كغم لكل ضلفة",
          "نظام تصريف مياه مخفي مانع لتجمع مياه الأمطار",
          "أقفال محيطية متعددة النقاط لأمان محكم وعزل تام"
        ]
      },
      ckb: {
        name: "لۆرێنزۆلاین 70LS سیستەمی لیفت ئەند سلاید",
        description: "دەرگای سلایدینگی زەبەلاحی پانۆراما بۆ دیمەنی سەرانسەری لە زەویەوە بۆ بنمیچ تا بەرزی 3.2 مەتر بە جوڵەیەکی زۆر نەرم و ئاسان.",
        subCategory: "سلایدینگی پانۆرامای عەزل",
        features: [
          "بەربەستی پۆلیامایدی 24 ملم بۆ عەزلی گەرمی لە نێوان ناوەوە و دەرەوە",
          "ڕێڕەوی ستیلی بەهێز کە بەرگەی 400 کیلۆگرام بۆ هەر باڵێک دەگرێت",
          "سیستەمی شاراوەی ئاوەڕۆ بۆ رێگری لە کۆبوونەوەی ئاوی باران"
        ]
      }
    }
  },
  {
    id: "hs76-sliding",
    name: "Hebe-Schiebe HS76 Lift & Slide Door",
    category: "doors",
    division: "doors",
    subCategory: "Monumental Patio Doors",
    modelNumber: "HS76",
    material: "uPVC Heavy Gauge",
    brand: "Winsa / Deceuninck",
    origin: "Deceuninck • Belgium / Erbil Plant",
    rating: 5.0,
    reviewsCount: 185,
    discountBadge: "17% OFF",
    originalPrice: 290,
    soldCount: "160+ installed",
    videoUrl: "/products-assets/video_2026-09-26_07-36-00 (5).mp4",
    mediaType: "video",
    image: "/products-assets/photo_24_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/1-2.jpg",
    description: "Grand panoramic lift-and-slide door engineering delivering effortless fingertip movement for sash weights up to 300kg with zero-barrier low threshold.",
    depth: "175 mm frame / 76 mm sash",
    insulationValue: "Uf = 1.25 W/m²K",
    acousticValue: "Rw = 41 dB",
    basePrice: 240,
    pricePerSqm: 240,
    unitPrice: 240,
    currency: "USD",
    pricing: { unitPrice: 240, pricePerSqm: 240, currency: "USD" },
    features: [
      "Lift-and-slide carriage supporting up to 300kg per glass sash",
      "Zero-barrier flush floor threshold for barrier-free living",
      "Multi-point perimeter locking for extreme dust and storm tightness",
      "Maximum glass transparency for panoramic garden and city views"
    ],
    colors: ["Anthracite Grey", "Golden Oak", "Nussbaum", "White"],
    specs: {
      "System Type": "Lift & Slide (HS)",
      "Sash Depth": "76 mm",
      "Frame Depth": "175 mm",
      "Max Sash Weight": "300 kg",
      "Glass Range": "Up to 44 mm"
    },
    translations: {
      ar: {
        name: "هيبي-شيبه HS76 باب سحب ورفع uPVC",
        description: "هندسة أبواب سحب بانورامية بآلية الرفع الألمانية لحركة سلسة وسهلة للضلف الثقيلة مع عتبة أرضية منبسطة مستوية.",
        subCategory: "أبواب بانورامية عازلة"
      },
      ckb: {
        name: "هیبی-شیبە HS76 دەرگای لیفت ئەند سلاید uPVC",
        description: "دەرگای سلایدینگی گەورەی ئەڵمانی بە سیستەمی بەرزکردنەوە بۆ جوڵەی سووک تا کێشی 300 کیلۆگرام بە بەربەستی خوارەوەی هاوتا لەگەڵ زەوی.",
        subCategory: "دەرگای پانۆرامای عەزل"
      }
    }
  },
  {
    id: "al-folding-77bf",
    name: "FOLDING – 77BF (BI-FOLD DOORS)",
    category: "doors",
    division: "doors",
    subCategory: "Concertina Bi-Fold",
    modelNumber: "77BF",
    material: "Thermal Break Aluminum",
    brand: "Lorenzoline",
    origin: "Lorenzoline • Europe / Erbil Plant",
    rating: 4.9,
    reviewsCount: 95,
    discountBadge: "17% OFF",
    originalPrice: 350,
    soldCount: "85+ villas",
    videoUrl: "/products-assets/video_2026-09-26_07-36-00 (7).mp4",
    mediaType: "video",
    image: "/products-assets/photo_30_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/1-2.jpg",
    description: "Premium bi-folding accordion door system that folds away completely to open entire walls up to 12 meters wide.",
    depth: "77 mm",
    basePrice: 290,
    pricePerSqm: 290,
    unitPrice: 290,
    currency: "USD",
    pricing: { unitPrice: 290, pricePerSqm: 290, currency: "USD" },
    features: [
      "Top-hung or bottom-bearing heavy-duty stainless steel carriages",
      "Flexible folding configurations from 2 to 10 leaf panels",
      "Continuous double EPDM gasket weather sealing"
    ],
    colors: ["Matte Black", "Anthracite Grey", "Woodgrain Powdercoat"],
    specs: {
      "System Depth": "77 mm",
      "Max Width": "12000 mm"
    },
    translations: {
      ar: {
        name: "نظام الأبواب القابلة للطي 77BF (باي-فولد)",
        description: "نظام أبواب أكورديون فاخر يطوى بالكامل ليفتح جدراناً زجاجية بعرض يصل إلى 12 متراً لدمج المساحات الداخلية بالحدائق.",
        subCategory: "أبواب قابلة للطي (أكورديون)"
      },
      ckb: {
        name: "سیستەمی دەرگای پێچراوە 77BF (بای-فۆڵد)",
        description: "دەرگای ئەکۆردیۆنی ناوازە کە بە تەواوی دەپێچرێتەوە و دیوار بە پانی تا 12 مەتر دەکاتەوە بۆ بەستنەوەی ژوورەکان بە باخچە.",
        subCategory: "دەرگای پێچراوەی پانۆراما"
      }
    }
  },
  {
    id: "pivot-monumental-door",
    name: "Architectural Pivot Entrance Door 100",
    category: "doors",
    division: "doors",
    subCategory: "Main Villa Entrance",
    modelNumber: "Pivot 100",
    material: "Heavy Gauge Structural Aluminum",
    brand: "Doorhome Custom",
    origin: "Doorhome • Erbil CNC Plant",
    rating: 5.0,
    reviewsCount: 72,
    discountBadge: "18% OFF",
    originalPrice: 550,
    soldCount: "110+ entrance doors",
    videoUrl: "/products-assets/video_2026-09-26_07-36-00 (6).mp4",
    mediaType: "video",
    image: "/products-assets/photo_41_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/03-2.jpg",
    description: "Grand entrance pivot door for luxury villas with hidden floor springs, digital smart keypad locks, and anti-burglary multi-bolt perimeter locking.",
    depth: "100 mm leaf",
    basePrice: 450,
    unitPrice: 450,
    currency: "USD",
    pricing: { unitPrice: 450, currency: "USD" },
    features: [
      "Concealed heavy-duty pivot axis holding sashes up to 350kg",
      "Integrated electronic biometric fingerprint access",
      "Thermally broken aluminum core with ceramic or stone panel inlay"
    ],
    colors: ["Matte Black", "Bronze Metallic", "Corten Steel Finish"],
    specs: {
      "Leaf Depth": "100 mm",
      "Max Height": "3500 mm",
      "Security Class": "RC3 / WK3"
    },
    translations: {
      ar: {
        name: "باب المدخل المحوري الفاخر Pivot 100 للڤلل",
        description: "باب مدخل رئيسي محوري بتصميم معماري مهيب مزود بمحور دوران مخفي وأقفال ذكية ببصمة الإصبع وألواح سيراميك أو حجر فاخرة.",
        subCategory: "مداخل الڤلل الرئيسية الفاخرة"
      },
      ckb: {
        name: "دەرگای سەرەکی پیڤۆت 100ی ڤێلا مۆدێرنەکان",
        description: "دەرگای سەرەکی ناوازە بە میحوەری خولانەوەی شاراوە و قوفڵی زیرەکی پەنجەمۆر و دیزاینی گرانبەهای سیرامیک و ئەلەمنیۆم.",
        subCategory: "دەرگای سەرەکی ڤێلا"
      }
    }
  },
  {
    id: "pergolas",
    name: "Doorhome Bioclimatic Pergola Systems",
    category: "doors",
    division: "doors",
    subCategory: "Outdoor Living & Glass Enclosures",
    modelNumber: "Bio-Pergola 150",
    material: "Heavy Gauge Anodized & Powdercoated Aluminum",
    brand: "Doorhome Architectural",
    origin: "Doorhome • Erbil Plant",
    rating: 4.9,
    reviewsCount: 42,
    discountBadge: "12% OFF",
    originalPrice: 365,
    soldCount: "28 villas",
    image: "/products-assets/photo_58_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/hero-bg.png",
    description: "Motorized rotating louvre pergolas that regulate sunlight, ventilation, and rainwater drainage for luxury outdoor terraces and hotel patios.",
    depth: "150 mm profile beams",
    basePrice: 320,
    pricePerSqm: 320,
    unitPrice: 320,
    currency: "USD",
    pricing: { unitPrice: 320, pricePerSqm: 320, currency: "USD" },
    features: [
      "Motorized rotating aluminum louvres with remote control and smart sensors",
      "Integrated perimeter LED dimmable lighting and concealed rainwater gutters",
      "Certified snow and wind load resistance for all-season use",
      "Side enclosures with motorized zip screens or sliding glass"
    ],
    colors: ["Anthracite Grey", "Matte Black", "Pure White", "Corten Bronze"],
    specs: {
      "Louvre Rotation": "0° - 135°",
      "Max Span": "6000 x 4500 mm per module",
      "Automation": "Somfy / Comunello compatible"
    },
    translations: {
      ar: {
        name: "مظلات البرغولا البيوكليماتية الذكية للمساحات الخارجية",
        description: "برغولا ألمنيوم متحركة ذات شفرات دوارة بمحركات ذكية للتحكم بأشعة الشمس والتهوية ومقاومة الأمطار مع إضاءة LED مدمجة.",
        subCategory: "مظلات وجلسات خارجية ذكية"
      },
      ckb: {
        name: "پێرگۆلای بایۆکلیماتیکی زیرەک بۆ دانیشتنی دەرەوە",
        description: "پێرگۆلای مۆتۆڕداری ئەلۆمنیۆم بە پەڕەی سووڕاوە بۆ کۆنتڕۆڵکردنی تیشکی خۆر، هەواگۆڕکێ و باران بە ڕووناکی LEDی نایاب.",
        subCategory: "پێرگۆلا و دانیشتنی دەرەوە"
      }
    }
  }
];

export const GLASS_PRODUCTS: ProductItem[] = [
  {
    id: "facade-50f",
    name: "Façade 50F Structural Curtain Wall",
    category: "glass",
    division: "glass",
    subCategory: "Commercial Façades",
    modelNumber: "Façade 50F",
    material: "Extruded Structural Aluminum 6060-T6",
    brand: "Lorenzoline",
    origin: "Lorenzoline • Europe / Doorhome Erbil",
    rating: 5.0,
    reviewsCount: 88,
    discountBadge: "16% OFF",
    originalPrice: 250,
    soldCount: "45 commercial projects",
    videoUrl: "/products-assets/video_2026-09-26_07-36-00 (8).mp4",
    mediaType: "video",
    image: "/products-assets/photo_59_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/showcase/showcase_curtain50f_1789926115841.jpg",
    description: "Structural stick façade system with 50mm visible profile width. Engineered for corporate headquarters, hotel facades, car showrooms, and luxury residences.",
    depth: "50 mm sightline, 50mm - 250mm mullion depths",
    insulationValue: "Ucw = 1.2 W/m²K",
    basePrice: 210,
    pricePerSqm: 210,
    unitPrice: 210,
    currency: "USD",
    pricing: { unitPrice: 210, pricePerSqm: 210, currency: "USD" },
    features: [
      "50mm narrow architectural sightlines maximizing natural daylight",
      "Pressure-equalized multi-tier internal drainage and ventilation",
      "Integrated hidden opening vents (top-hung, parallel, and tilt-turn)",
      "High wind resistance tested up to 2400 Pa"
    ],
    colors: ["Matte Dark Grey", "Black", "Silver Anodized", "Custom RAL"],
    specs: {
      "Visible Width": "50 mm",
      "Mullion Inertia": "High static range",
      "Air Permeability": "Class AE EN 12152",
      "Water Tightness": "Class RE 1200 EN 12154"
    },
    translations: {
      ar: {
        name: "واجهات كورتن وول الزجاجية الإنشائية Façade 50F",
        description: "نظام واجهات زجاجية إنشائية بعرض 50 ملم للمباني التجارية والشركات والأبراج مع عزل حراري ومقاومة عالية لضغط الرياح.",
        subCategory: "واجهات زجاجية تجارية"
      },
      ckb: {
        name: "ڕوکاری شوشەیی باڵەخانەکان Façade 50F",
        description: "سیستەمی کورتیین وۆڵی ستراکتۆر بە پانی 50 ملم بۆ باڵەخانەی بازرگانی و کۆمپانیاکان بە بەرگری بەرز لە با و عەزلی گەرمی.",
        subCategory: "ڕوکاری بازرگانی"
      }
    }
  },
  {
    id: "curtain-50f",
    name: "Façade 50F Curtain Wall Stick System",
    category: "glass",
    division: "glass",
    subCategory: "Commercial Façades",
    modelNumber: "Façade 50F",
    material: "Extruded Aluminum & Low-E Glass",
    brand: "Lorenzoline",
    origin: "Lorenzoline • Europe / Doorhome Erbil",
    rating: 4.9,
    reviewsCount: 65,
    discountBadge: "15% OFF",
    originalPrice: 245,
    soldCount: "38 commercial facades",
    image: "/products-assets/photo_75_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/24-1.jpg",
    description: "Complete facade engineering system offering thermal insulation, solar control, and structural integrity for modern commercial buildings.",
    depth: "50 mm",
    basePrice: 210,
    pricePerSqm: 210,
    unitPrice: 210,
    currency: "USD",
    pricing: { unitPrice: 210, pricePerSqm: 210, currency: "USD" },
    features: ["50mm sightline", "High wind load performance", "Polyamide thermal breaks"],
    specs: { "Sightline": "50 mm", "Thermal Transmittance": "1.2 W/m²K" }
  },
  {
    id: "atriums",
    name: "Skylight Atriums & Glass Roofs 50F",
    category: "glass",
    division: "glass",
    subCategory: "Glass Roofs & Atriums",
    modelNumber: "SkyRoof 50",
    material: "Thermally Broken Aluminum & Double/Triple Glass",
    brand: "Lorenzoline",
    origin: "Lorenzoline • Europe / Doorhome Erbil",
    rating: 4.9,
    reviewsCount: 52,
    discountBadge: "18% OFF",
    originalPrice: 340,
    soldCount: "35+ atriums",
    videoUrl: "/products-assets/video_2026-09-26_07-36-00 (9).mp4",
    mediaType: "video",
    image: "/products-assets/photo_78_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/24-1.jpg",
    description: "Custom engineered pyramid, gable, and mono-pitch glass roof atriums featuring internal thermal condensation drainage channels.",
    depth: "50 mm rafters",
    basePrice: 280,
    pricePerSqm: 280,
    unitPrice: 280,
    currency: "USD",
    pricing: { unitPrice: 280, pricePerSqm: 280, currency: "USD" },
    features: [
      "Engineered multi-tier condensation drainage channels",
      "Compatible with high-performance solar reflective and Low-E safety glass",
      "Integrated automated ventilation flap vents with rain sensors"
    ],
    colors: ["Dark Grey", "Black", "White"],
    specs: {
      "Rafter Sightline": "50 mm",
      "Water Tightness": "Class RE 1500"
    },
    translations: {
      ar: {
        name: "الأسقف الزجاجية وقباب الإضاءة الطبيعية SkyRoof 50",
        description: "قباب وأسقف زجاجية إنشائية فاخرة بتصاميم هرمية ومائلة مع مجاري تصريف التكثيف الداخلي ومقاومة الأحمال العالية.",
        subCategory: "قباب وأسقف زجاجية"
      },
      ckb: {
        name: "سەقفی شوشەیی و رووناکیدەری ئاسمانی SkyRoof 50",
        description: "دیزاینی ئەندازیاری سەقفی شوشەیی بۆ هۆڵ و ڤێلاکان بە سیستەمی عەزل و کۆنتڕۆڵی ڕووناکی سروشتی.",
        subCategory: "سەقفی شوشەیی"
      }
    }
  },
  {
    id: "low-e-double",
    name: "Low-E Double & Triple Glazed Units",
    category: "glass",
    division: "glass",
    subCategory: "Architectural Solar Glass",
    modelNumber: "Low-E 2X",
    material: "Argon Filled Solar Safety Glass",
    brand: "Doorhome Glass Plant",
    origin: "Doorhome • Erbil Modern Glass Plant",
    rating: 5.0,
    reviewsCount: 310,
    discountBadge: "17% OFF",
    originalPrice: 115,
    soldCount: "1,200+ units",
    image: "/products-assets/photo_82_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/photo_2023-07-03_15-41-20-1280x820.jpg",
    description: "Automated argon-gas filled double and triple insulated glass units with acoustic PVB interlayers and solar reflective Low-E coatings.",
    depth: "24mm - 52mm",
    insulationValue: "Ug = 1.0 W/m²K",
    acousticValue: "Rw = 44 dB",
    basePrice: 95,
    pricePerSqm: 95,
    unitPrice: 95,
    currency: "USD",
    pricing: { unitPrice: 95, pricePerSqm: 95, currency: "USD" },
    features: [
      "90% Argon gas filling for reduced thermal conductivity",
      "Reflects 70% of infrared solar heat radiation",
      "Warm-edge spacer technology preventing perimeter condensation"
    ],
    specs: {
      "Ug Value": "1.0 W/m²K",
      "Solar Heat Gain (SHGC)": "0.38",
      "Light Transmission": "72%"
    }
  }
];

export const RAILINGS_PRODUCTS: ProductItem[] = [
  {
    id: "railings",
    name: "Structural Glass Balcony Railings",
    category: "railings",
    division: "railings",
    subCategory: "Balcony Systems",
    modelNumber: "GlassRail 120",
    material: "Structural Aluminum Profile & Laminated Tempered Glass",
    brand: "Doorhome Architectural",
    origin: "Doorhome • Erbil Plant",
    rating: 4.9,
    reviewsCount: 140,
    discountBadge: "17% OFF",
    originalPrice: 210,
    soldCount: "680+ meters",
    videoUrl: "/products-assets/video_2026-09-26_07-36-00 (10).mp4",
    mediaType: "video",
    image: "/products-assets/photo_80_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/23-1.jpg",
    description: "Floor-mounted and fascia-mounted continuous aluminum base shoe systems holding heavy 16mm-21.5mm laminated glass panels without vertical posts.",
    depth: "120 mm base",
    basePrice: 175,
    pricePerSqm: 175,
    unitPrice: 175,
    currency: "USD",
    pricing: { unitPrice: 175, pricePerSqm: 175, currency: "USD" },
    features: [
      "Unobstructed panoramic view with zero vertical posts",
      "Tested for 1.5 kN to 3.0 kN horizontal line load safety",
      "Concealed drainage weep holes in bottom channel",
      "Optional slim aluminum top cap or minimalist handrail"
    ],
    colors: ["Natural Anodized", "Matte Black", "Stainless Inox Effect"],
    specs: {
      "Glass Thickness": "8+8 mm or 10+10 mm PVB / SGP",
      "Profile Weight": "Heavy Structural Grade"
    },
    translations: {
      ar: {
        name: "دربزينات الزجاج الإنشائي اللامحدود للبلكونات والممرات",
        description: "أنظمة دربزين زجاجي بدون قواطع رأسية مثبتة بقاعدة ألمنيوم إنشائية مع زجاج مصفح ومقسى يوفر رؤية بانورامية وأماناً فائقاً.",
        subCategory: "دربزينات زجاجية فاخرة"
      },
      ckb: {
        name: "دەستەچنی شوشەیی پانۆراما بۆ باڵکۆن",
        description: "سیستەمی دەستەچنی شوشەیی بەبێ کۆڵەکەی ستوونی بە بەکارهێنانی جامی سیکیوریت و ئەلەمنیۆمی بەهێز بۆ دیمەنی تەواو کراوە.",
        subCategory: "دەستەچنی شوشەیی"
      }
    }
  },
  {
    id: "fences",
    name: "Architectural Aluminum Fences & Gates",
    category: "railings",
    division: "railings",
    subCategory: "Perimeter Security & Gates",
    modelNumber: "ArchFence 100",
    material: "High-Strength Powdercoated Aluminum",
    brand: "Doorhome Architectural",
    origin: "Doorhome • Erbil Plant",
    rating: 4.9,
    reviewsCount: 84,
    discountBadge: "15% OFF",
    originalPrice: 225,
    soldCount: "95+ projects",
    image: "/products-assets/photo_63_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/signature-bg.jpg",
    description: "Modern, maintenance-free architectural fences and entrance gates with concealed fasteners, anodized finishes, and customized louvre patterns.",
    depth: "100 mm posts",
    basePrice: 190,
    pricePerSqm: 190,
    unitPrice: 190,
    currency: "USD",
    pricing: { unitPrice: 190, pricePerSqm: 190, currency: "USD" },
    features: [
      "Zero corrosion guarantee against weather and extreme sun exposure",
      "Modular slat spacing for privacy and wind permeability",
      "Integrates with automated swing and sliding gate motors",
      "High UV-resistant architectural powder coating"
    ],
    colors: ["Anthracite", "Matte Black", "Woodgrain Finish", "Graphite"],
    specs: {
      "Post Dimensions": "100 x 100 mm",
      "Slat Heights": "100 mm / 150 mm / 200 mm"
    }
  },
  {
    id: "spigot-glass-rail",
    name: "Stainless Steel Spigot 316 Balustrade",
    category: "railings",
    division: "railings",
    subCategory: "Minimalist Glass Railings",
    modelNumber: "Spigot SS316",
    material: "Marine Grade SS316 & Tempered Glass",
    brand: "Doorhome Inox",
    origin: "Doorhome • Erbil Plant",
    rating: 4.8,
    reviewsCount: 68,
    discountBadge: "16% OFF",
    originalPrice: 185,
    soldCount: "340+ meters",
    image: "/products-assets/photo_50_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/photo_2023-07-03_15-49-24-760x485.jpg",
    description: "Heavy-duty core-drilled or surface-mounted marine grade stainless steel spigots for contemporary pool enclosures and villa balconies.",
    basePrice: 155,
    unitPrice: 155,
    currency: "USD",
    pricing: { unitPrice: 155, currency: "USD" },
    features: [
      "Solid cast SS316 stainless steel with mirror or satin brushed finish",
      "Friction fit clamp design with no glass drilling required",
      "Complies with international balustrade impact standards"
    ],
    specs: {
      "Material": "AISI 316 Marine Grade",
      "Glass Suitability": "12mm to 17.52mm"
    }
  }
];

export const ACCESSORIES_PRODUCTS: ProductItem[] = [
  {
    id: "wiek-concealed-hinge",
    name: "WİEK 180° Concealed Tilt & Turn Hinge System",
    category: "accessories",
    division: "accessories",
    subCategory: "Concealed Window Hardware",
    modelNumber: "WİEK T&T 180",
    material: "Hardened Stainless Steel & Zamak 5",
    brand: "WİEK SYSTEM",
    origin: "WİEK • Belgium / Doorhome Desk",
    rating: 5.0,
    reviewsCount: 310,
    image: "/assets/showcase/wiek_hidden_hinge-04.png",
    fallbackImage: "/assets/showcase/wiek_hidden_hinge-04.png",
    description: "Flush concealed 180-degree opening hinge mechanism for thermal break aluminum and high-end uPVC casement windows, rated up to 130 kg.",
    features: [
      "180° full opening angle with 100% hidden profile integration",
      "130 kg certified sash load capacity with anti-sag micro adjustments",
      "Integrated 3D adjustment for air and water tightness sealing"
    ],
    translations: {
      ar: {
        name: "نظام WİEK البلجيكي للمفصلات المخفية 180° (Tilt & Turn)",
        description: "مفصلات مخفية بالكامل مدمجة داخل قطاع الألمنيوم والـ uPVC مصممة للمشاريع المودرن الفاخرة بتحمل وزن يصل إلى 130 كغم مع نقاط إغلاق محكمة.",
        subCategory: "إكسسوارات النوافذ المخفية"
      },
      ckb: {
        name: "سیستەمی نەرمەلۆی شاردراوەی WİEKی بەلجیکی ١٨٠°",
        description: "نەرمەلۆی شاردراوەی تەواو لە ناو پرۆفایلی ئەلەمنیۆم و یو پی ڤی سی بە گۆشەی ١٨٠ پلە و بەرگەی کێشی تا ١٣٠ کگم.",
        subCategory: "ئێکسسواراتی پەنجەرەی شاردراوە"
      },
      kmr: {
        name: "Sîstema Menteşeyên Veşartî ya WİEK 180°",
        description: "Menteşeyên veşartî yên 180 pileyî yên ji bo pencereyên alûmînyûm û uPVC bi kapasîteya hilgirtinê ya heta 130 kg.",
        subCategory: "Aksesorên Veşartî yên Pencereyan"
      },
      tr: {
        name: "WİEK 180° Gizli Menteşeli Çift Açılım Sistemi",
        description: "Alüminyum ve uPVC kanatlara tamamen entegre olan, 130 kg taşıma kapasiteli ve 180 derece tam açılım sağlayan gizli menteşe donanımı.",
        subCategory: "Gizli Pencere Donanımları"
      }
    }
  },
  {
    id: "stac-window-handles",
    name: "STAC Spain Minimalist Window Handles & Cremones",
    category: "accessories",
    division: "accessories",
    subCategory: "Minimalist Handles",
    modelNumber: "STAC Cremone 044",
    material: "Extruded 6063-T5 Aerospace Aluminum",
    brand: "STAC Spain",
    origin: "STAC • Spain / Doorhome Desk",
    rating: 5.0,
    reviewsCount: 380,
    image: "/assets/showcase/stac_window_handles-044.png",
    fallbackImage: "/assets/showcase/stac_window_handles-044.png",
    description: "Ultra-flush minimalist cremone handles engineered in Spain. Zero unnecessary protrusion for uninterrupted sightlines on modern slim-profile windows.",
    features: [
      "Aesthetic 0 mm flush design for clean minimal sightlines",
      "High-grade CNC machined 6063-T5 aluminum body",
      "Tested for 25,000 continuous operation cycles"
    ],
    translations: {
      ar: {
        name: "مقابض STAC الإسبانية المينيماليست المستوية",
        description: "مقابض معمارية مصنوعة بكتلة ألمنيوم موحدة بدون أي بروز زائد (0 مم) بمكائن CNC دقيقة لتنسجم تماماً مع قطاعات النوافذ الحرارية العصرية.",
        subCategory: "مقابض مينيماليست"
      },
      ckb: {
        name: "دەسکی تەختی مینیمالیستی STACی ئیسپانی",
        description: "دەسکی بێ بەرزایی و تەواو تەخت لەگەڵ پرۆفایل لە ئەلەمنیۆمی فڕۆکەوانی 6063-T5 بەرهەمی ئیسپانیا.",
        subCategory: "دەسکی مۆدێرنی بێ بەرزایی"
      },
      kmr: {
        name: "Destikên Mînîmalîst ên Pencereyan STAC Spanya",
        description: "Destikên mînîmalîst ên 0 mm ji alûmînyûma 6063-T5 a hewayî bi fonksiyona bêderketin ji bo pencereyên nûjen.",
        subCategory: "Destikên Mînîmalîst"
      },
      tr: {
        name: "STAC İspanya Minimalist Pencere Kolları ve İspanyoletler",
        description: "0 mm çıkıntısız gövdesi ve 6063-T5 havacılık sınıfı alüminyum yapısıyla modern mimari pencereler için tasarlanmış minimalist ispanyolet kol.",
        subCategory: "Minimalist Pencere Kolları"
      }
    }
  },
  {
    id: "wiek-bifold-system",
    name: "WİEK Heavy-Duty Bi-Folding Patio Door System",
    category: "accessories",
    division: "accessories",
    subCategory: "Folding Door Mechanisms",
    modelNumber: "WİEK Accordion 34",
    material: "Stainless Steel Rollers & Structural Alloy",
    brand: "WİEK SYSTEM",
    origin: "WİEK • Belgium / Doorhome Desk",
    rating: 5.0,
    reviewsCount: 260,
    image: "/assets/showcase/wiek_bifold_door-34.png",
    fallbackImage: "/assets/showcase/wiek_bifold_door-34.png",
    description: "Synchronized multi-leaf bi-folding hardware system with stainless steel silent bearing rollers and secure central transmission gearboxes.",
    features: [
      "Carries up to 100 kg per door leaf with feather-light gliding",
      "Sealed stainless steel bearings resistant to sand and fine dust",
      "Concealed central hinge locks and flush bottom threshold tracks"
    ],
    translations: {
      ar: {
        name: "أنظمة WİEK البلجيكية للأبواب القابلة للطي (Bi-Fold)",
        description: "أنظمة حركة انسيابية للأبواب القابلة للطي متعددة الضلف برولرات فولاذية صامتة وتروس أمان مركزية متعددة النقاط لتحقيق أوسع انفتاح بانورامي.",
        subCategory: "أنظمة الأبواب القابلة للطي"
      },
      ckb: {
        name: "سیستەمی دەرگای ئەکۆردیۆنی WİEKی بەلجیکی (Bi-Fold)",
        description: "ئێکسسواراتی دەرگای قات-قاتی باڵکۆن بە رۆڵەری چوارینەی ستانلس ستێل بە بەرگەی ١٠٠ کگم بۆ هەر باڵێک.",
        subCategory: "سیستەمی دەرگای ئەکۆردیۆن"
      },
      kmr: {
        name: "Sîstema Deriyê Bi-Fold a WİEK",
        description: "Mekanîzmaya deriyên qatqatî ya bi tekerên polayê zengarnegir ji bo panelên heta 100 kg.",
        subCategory: "Mekanîzmayên Deriyê Qatqatî"
      },
      tr: {
        name: "WİEK Ağır Hizmet Katlanır Kapı (Bi-Fold) Mekanizması",
        description: "Kanat başı 100 kg taşıma kapasiteli, paslanmaz çelik sessiz rulmanlı ve emniyet kilitli çok kanatlı katlanır kapı donanım sistemi.",
        subCategory: "Katlanır Kapı Donanımları"
      }
    }
  },
  {
    id: "stac-lift-slide",
    name: "STAC Spain Monumental Lift & Slide Mechanism (400kg)",
    category: "accessories",
    division: "accessories",
    subCategory: "Lift & Slide Systems",
    modelNumber: "STAC LS-400",
    material: "Stainless Bogies & Polyamide Thermal Barriers",
    brand: "STAC Spain",
    origin: "STAC • Spain / Doorhome Desk",
    rating: 5.0,
    reviewsCount: 340,
    image: "/assets/showcase/stac_lift_slide-108.png",
    fallbackImage: "/assets/showcase/stac_lift_slide-108.png",
    description: "Heavy-duty lift & slide transmission gearboxes with polyamide thermal breaks and precision tandem bogies for floor-to-ceiling panoramic glass spans.",
    features: [
      "Certified for massive glass panels weighing up to 400 kg per leaf",
      "Tandem needle-bearing steel wheels with polyamide isolators",
      "Effortless one-handed lever operation with multi-stage locking"
    ],
    translations: {
      ar: {
        name: "أنظمة STAC الإسبانية للرفع والسحب العملاقة (400 كغم)",
        description: "تروس الرفع والسحب الثقيلة من STAC إسبانيا المصممة للواجهات البانورامية الضخمة من الأرض للسقف بحمولة تصل إلى 400 كغم للضلفة الواحدة.",
        subCategory: "أنظمة الرفع والانزلاق"
      },
      ckb: {
        name: "سیستەمی لیفت ئەند سلایدی گەورەی STACی ئیسپانی (٤٠٠ کگم)",
        description: "سیستەمی بەرزکردنەوە و خلیسکاندنی دەرگای گەورەی شوشە تا ٤٠٠ کگم بۆ هەر باڵێک بە کوالێتی باڵای ئیسپانی.",
        subCategory: "سیستەمی سحابی بەرزکەرەوە"
      },
      kmr: {
        name: "Mekanîzmaya Hebe-Schiebe ya STAC Spanya (400 kg)",
        description: "Sîstema hilkişandin û şimitandinê ya STAC ji bo camên mezin ên heta 400 kg bi însolasyona termal a polîamîd.",
        subCategory: "Sîstemên Lift & Slide"
      },
      tr: {
        name: "STAC İspanya Ağır Hebe-Schiebe (Kaldır-Sür) Mekanizması (400 kg)",
        description: "400 kg kanat ağırlığına kadar geniş açıklıklı cam cepheler için tasarlanmış polyamid ısı bariyerli ağır kaldırmalı sürme arabaları.",
        subCategory: "Kaldır-Sür (Hebe-Schiebe) Sistemleri"
      }
    }
  },
  {
    id: "wiek-free-angle",
    name: "WİEK Free-Angle Transmission Mechanism",
    category: "accessories",
    division: "accessories",
    subCategory: "Corner Transmission & Gearing",
    modelNumber: "WİEK FA-Angle",
    material: "Stainless Spring Steel & High-Strength Alloy",
    brand: "WİEK SYSTEM",
    origin: "WİEK • Belgium / Doorhome Desk",
    rating: 4.9,
    reviewsCount: 195,
    image: "/assets/showcase/wiek_free_angle-12.png",
    fallbackImage: "/assets/showcase/wiek_free_angle-12.png",
    description: "Universal corner and angle transmission gearing engineered for polygonal, arched, and custom architectural sash geometry.",
    features: [
      "Free-angle adaptation from 45° to 175° corner transitions",
      "Multi-layer laminated spring steel drive bands",
      "Smooth effortless handle operation with high burglar resistance"
    ],
    translations: {
      ar: {
        name: "آلية WİEK لنقل الحركة بالزوايا الحرة (Free-Angle)",
        description: "تروس وزوايا نقل حركة مرنة مخصصة للنوافذ المعمارية غير التقليدية كالمثلثة والدائرية والزوايا المائلة.",
        subCategory: "تروس نقل الحركة"
      },
      ckb: {
        name: "میکانیزمی گواستنەوەی جوڵەی گۆشەی ئازادی WİEK",
        description: "گێڕبۆکسی تایبەت بۆ پەنجەرە ئەندازیارییە نائاساییەکان وەک پەنجەرەی سێگۆشە، کەوانەیی و گۆشەی تایبەت.",
        subCategory: "گێڕبۆکس و جوڵەی گۆشەکان"
      },
      kmr: {
        name: "Mekanîzmaya Guhestina Goşeya Azad a WİEK",
        description: "Gêrên guhestina goşeyî ji 45° heta 175° ji bo pencereyên neasayî yên mîmarî.",
        subCategory: "Gêrên Guhestina Goşeyî"
      },
      tr: {
        name: "WİEK Serbest Açılı Köşe İletim Mekanizması",
        description: "Özel geometrili, üçgen ve kemerli mimari pencereler için 45° ila 175° arasında esnek köşe hareket iletim donanımı.",
        subCategory: "Köşe İletim Donanımları"
      }
    }
  },
  {
    id: "stac-door-handles",
    name: "STAC Architectural Door Lever Handles & Escutcheons",
    category: "accessories",
    division: "accessories",
    subCategory: "Door Handles & Security",
    modelNumber: "STAC DH-120",
    material: "Grade 5 Anti-Corrosion Alloy & Stainless Spindle",
    brand: "STAC Spain",
    origin: "STAC • Spain / Doorhome Desk",
    rating: 4.9,
    reviewsCount: 290,
    image: "/assets/showcase/stac_door_handles-120.png",
    fallbackImage: "/assets/showcase/stac_door_handles-120.png",
    description: "High-traffic architectural lever handle sets with integrated return springs and concealed rose covers. Tested to EN 1906 Category of Use Grade 4.",
    features: [
      "Certified to EN 1906 Grade 4 for high-traffic commercial installations",
      "Grade 5 maximum corrosion resistance (EN 1670) for coastal & harsh climates",
      "Internal torsion spring prevents handle sagging over decades of use"
    ],
    translations: {
      ar: {
        name: "مقابض STAC المعمارية للأبواب مع روزيتات مخفية",
        description: "أطقم مقابض أبواب فائقة المتانة مصنفة للمباني العامة والمشاريع السكنية الفاخرة مع مقاومة تآكل من الدرجة الخامسة.",
        subCategory: "مقابض الأبواب الفاخرة"
      },
      ckb: {
        name: "دەسکی تەلارسازی دەرگای STACی ئیسپانی",
        description: "دەسکی دەرگای کوالێتی بەرز بە سپرنگی ناوخۆیی و بەرگری تەواو لە ژەنگ بۆ هاتوچۆی زۆر و باڵەخانەی مۆدێرن.",
        subCategory: "دەسکی دەرگا"
      },
      kmr: {
        name: "Destikên Deriyan ên Mîmarî yên STAC Spanya",
        description: "Destikên deriyan ên bihêz ên pola EN 1906 bi parastina korozyonê ya asta 5 ji bo avahiyên luks.",
        subCategory: "Destikên Deriyan"
      },
      tr: {
        name: "STAC İspanya Mimari Rozetli Kapı Kolları",
        description: "EN 1906 Sınıf 4 yüksek trafik testli, EN 1670 Sınıf 5 korozyon dayanımlı ve yaylı mimari kapı kolu takımı.",
        subCategory: "Mimari Kapı Kolları"
      }
    }
  },
  {
    id: "wiek-handle-series",
    name: "WİEK Architectural Handle & Cremone Series",
    category: "accessories",
    division: "accessories",
    subCategory: "Architectural Handles",
    modelNumber: "WİEK Series 16",
    material: "Anodized Aerospace Aluminum Alloy",
    brand: "WİEK SYSTEM",
    origin: "WİEK • Belgium / Doorhome Desk",
    rating: 5.0,
    reviewsCount: 420,
    image: "/assets/showcase/wiek_handle_series-16.png",
    fallbackImage: "/assets/showcase/wiek_handle_series-16.png",
    description: "Minimalist European architectural window and door handles featuring smooth 90° positioning and durable anodized powder-coated finishes.",
    features: [
      "90° positive click positioning mechanism",
      "Scratch and UV resistant architectural powder coating",
      "Direct European groove fit with concealed fixing bolts"
    ],
    translations: {
      ar: {
        name: "سلسلة مقابض وكريمونات WİEK المعمارية",
        description: "مقابض مودرن انسيابية للنوافذ والأبواب بثبات دقيق بزاوية 90 درجة مع طلاء معالج ضد الخدش والأشعة فوق البنفسجية.",
        subCategory: "مقابض معمارية"
      },
      ckb: {
        name: "دەسکی مۆدێرنی تەلارسازی WİEK",
        description: "دەسکی پەنجەرە و دەرگا بە دیزاینی ئەوروپی کەمینە و دەنگی قوفڵبوونی ورد بە گۆشەی ٩٠ پلە.",
        subCategory: "دەسکی پەنجەرە و دەرگا"
      },
      kmr: {
        name: "Rêza Destikên Mîmarî ya WİEK",
        description: "Destikên mînîmalîst ên bi pozîsyona 90 pileyî û rengên anodîzekirî yên berxwedêr.",
        subCategory: "Destikên Mîmarî"
      },
      tr: {
        name: "WİEK Mimari Pencere ve Kapı Kolu Serisi",
        description: "90° pozitif kilitlenme mekanizmalı, çizilme ve UV ışınlarına dayanıklı elektrostatik toz boyalı mimari kol serisi.",
        subCategory: "Mimari Kollar"
      }
    }
  },
  {
    id: "stac-multipoint",
    name: "STAC Spain Multipoint Perimeter Security Lock",
    category: "accessories",
    division: "accessories",
    subCategory: "Perimeter Locks & Security",
    modelNumber: "STAC Safe-254",
    material: "Certified Zinc Alloy & Stainless Gears",
    brand: "STAC Spain",
    origin: "STAC • Spain / Doorhome Hub",
    rating: 5.0,
    reviewsCount: 310,
    image: "/assets/showcase/stac_sliding_opening-254.png",
    fallbackImage: "/assets/showcase/stac_sliding_opening-254.png",
    description: "High-security perimeter multipoint locks with adjustable mushroom cams and anti-jemmy keeps for casement and sliding patio systems.",
    features: [
      "High corrosion resistance grade 5 EN 1670",
      "Mushroom cam locking points for anti-jemmy security",
      "Manufactured in Spain to CE European standards"
    ],
    translations: {
      ar: {
        name: "نظام STAC الإسباني للإغلاق الأمني متعدد النقاط",
        description: "أقفال وتروس أمان محيطية متعددة النقاط برؤوس فطرية مانعة للخلع والسرقة ومقاومة للرياح والغبار.",
        subCategory: "أقفال الأمان متعددة النقاط"
      },
      ckb: {
        name: "سیستەمی قفڵی ئەمنی چەند خاڵی STACی ئیسپانی",
        description: "قفڵی دژە دزی و چەند خاڵی بۆ پەنجەرە و دەرگای سحاب و باڵکۆن بە بەرگری زۆر بەرز بەرامبەر شکان و دزەکردنی هەوا.",
        subCategory: "قفڵی ئەمنی دەورەبەری"
      },
      kmr: {
        name: "Kilîta Ewlehiyê ya Pir-Xalî ya STAC Spanya",
        description: "Sîstema kilîtkirina çendxalî ya li dijî diziyê bi berxwedana korozyonê ya asta 5 EN 1670.",
        subCategory: "Kilîtên Ewlehiyê"
      },
      tr: {
        name: "STAC İspanya Çok Noktalı Emniyet Kilit Sistemi",
        description: "Hırsızlığa ve hava sızıntısına karşı ayarlanabilir mantar başlı kilit noktalarına sahip İspanya üretimi çok noktalı emniyet kilidi.",
        subCategory: "Çok Noktalı Emniyet Kilitleri"
      }
    }
  },
  {
    id: "master-handles",
    name: "Master Italy Ergonomic Handles",
    category: "accessories",
    division: "accessories",
    subCategory: "Architectural Handles",
    modelNumber: "Master Italy",
    material: "Architectural Aluminum & Brass",
    brand: "Master Italy",
    origin: "Master Italy • Erbil Hub",
    rating: 5.0,
    reviewsCount: 390,
    discountBadge: "22% OFF",
    originalPrice: 45,
    soldCount: "5,800+ units",
    image: "/products-assets/photo_43_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/brouchour-Master-1-1000x1000.jpg",
    description: "Ergonomic designer handles in Italian minimalist aesthetic, available in matte black, satin nickel, and anodized gold finishes.",
    basePrice: 35,
    unitPrice: 35,
    currency: "USD",
    pricing: { unitPrice: 35, currency: "USD" },
    features: [
      "Tested for over 50,000 opening cycles",
      "Antibacterial coating available upon request",
      "Direct fit for uPVC and thermal break aluminum"
    ]
  },
  {
    id: "comunello-rollers",
    name: "Comunello Italy Heavy Tandem Rollers",
    category: "accessories",
    division: "accessories",
    subCategory: "Sliding Rollers",
    modelNumber: "Comunello 400",
    material: "Stainless Steel & Needle Bearings",
    brand: "Comunello",
    origin: "Comunello • Italy / Erbil Hub",
    rating: 5.0,
    reviewsCount: 175,
    discountBadge: "19% OFF",
    originalPrice: 105,
    soldCount: "1,950+ sets",
    image: "/products-assets/photo_36_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/brouchour-comunello-2-1-1000x1000.jpg",
    description: "Heavy-duty tandem ball-bearing rollers engineered to carry oversized panoramic sliding door sashes up to 400kg with effortless whisper-quiet travel.",
    basePrice: 85,
    unitPrice: 85,
    currency: "USD",
    pricing: { unitPrice: 85, currency: "USD" },
    features: [
      "High load bearing capacity rated for 400kg sash weight",
      "Precision CNC stainless steel ball bearings",
      "Height adjustable by 6mm for perfect alignment"
    ]
  },
  {
    id: "shutters",
    name: "Extruded Rolling Shutters & Insect Screens",
    category: "accessories",
    division: "accessories",
    subCategory: "Shading & Protection",
    modelNumber: "RollShutter 55",
    material: "Polyurethane Injected & Extruded Aluminum",
    brand: "Doorhome Shutter Line",
    origin: "Doorhome • Erbil Plant",
    rating: 4.8,
    reviewsCount: 210,
    discountBadge: "15% OFF",
    originalPrice: 165,
    soldCount: "840+ installed",
    image: "/products-assets/photo_28_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/22-1.jpg",
    description: "Motorized security shutters and pleated magnetic insect screens providing shading, acoustic dampening, and dust prevention.",
    depth: "55 mm slats",
    basePrice: 140,
    pricePerSqm: 140,
    unitPrice: 140,
    currency: "USD",
    pricing: { unitPrice: 140, pricePerSqm: 140, currency: "USD" },
    features: [
      "Somfy & Comunello tubular motor automation with wireless wall remotes",
      "High-density PU foam core for thermal insulation and noise reduction",
      "Plisse retractable pleated insect meshes for windows and wide sliding doors"
    ],
    colors: ["White", "Anthracite Grey", "Golden Oak", "Silver"],
    specs: {
      "Slat Height": "55 mm",
      "Motor Type": "Wireless RF Tubular",
      "Box Sizes": "165mm / 205mm"
    }
  },
  {
    id: "acc-handle-line",
    name: "HANDLE & PULL HANDLE LINE",
    category: "accessories",
    division: "accessories",
    subCategory: "Architectural Touchpoints",
    modelNumber: "Hoppe / STAC",
    material: "Inox 316 & Anodized Alloy",
    brand: "Hoppe / STAC",
    origin: "Hoppe Germany & STAC Spain",
    rating: 5.0,
    reviewsCount: 420,
    discountBadge: "22% OFF",
    originalPrice: 45,
    soldCount: "6,200+ units",
    image: "/products-assets/photo_60_2026-09-26_07-36-01.jpg",
    fallbackImage: "./assets/doorhome/photo_2023-07-03_15-50-46-1104x700.jpg",
    description: "Ergonomic designer handles for windows and doors in stainless steel 316, anodized aluminum, and antibacterial powder coat.",
    basePrice: 35,
    unitPrice: 35,
    currency: "USD",
    pricing: { unitPrice: 35, currency: "USD" },
    features: [
      "Secustik® certified anti-manipulation security window handles",
      "Monumental T-bar and offset entrance pull handles up to 1800mm",
      "Luxury finishes: Matte Black, Satin Gold, Brushed Inox, Graphite"
    ]
  }
];

// Backwards-compatibility groupings for home sections
export const UPVC_PRODUCTS: ProductItem[] = [
  ...WINDOWS_PRODUCTS.filter(p => p.material?.includes('uPVC')),
  ...DOORS_PRODUCTS.filter(p => p.material?.includes('uPVC'))
];

export const ALUMINUM_PRODUCTS: ProductItem[] = [
  ...DOORS_PRODUCTS.filter(p => p.material?.includes('Aluminum') || p.id === 'pergolas'),
  ...GLASS_PRODUCTS,
  ...RAILINGS_PRODUCTS
];

export const ACCESSORIES_LINES: ProductItem[] = [
  ...ACCESSORIES_PRODUCTS
];

export const ALL_PRODUCTS: ProductItem[] = [
  ...WINDOWS_PRODUCTS,
  ...DOORS_PRODUCTS,
  ...GLASS_PRODUCTS,
  ...RAILINGS_PRODUCTS,
  ...ACCESSORIES_PRODUCTS
];


export const BROCHURES_DATA: BrochureItem[] = [
  {
    id: "brochure-wiek-2026",
    title: "WİEK SYSTEM Belgium 2026 Hardware Catalogue",
    brand: "WİEK SYSTEM",
    origin: "Belgium",
    coverImage: "/assets/showcase/wiek_p-000.png",
    fallbackCover: "/assets/showcase/wiek_p-000.png",
    description: "Official 88-page European architectural hardware catalogue: concealed hinges, free-angle gearing, minimalist handles, and heavy bi-fold systems.",
    pages: 88,
    fileSize: "65.4 MB",
    downloadUrl: "/catalogs/wiek-general-catalog-2026.pdf",
    highlights: ["180° Concealed Hinges", "130kg Sash Capacity", "Free-Angle Gearing", "Bi-Fold Folding Hardware"]
  },
  {
    id: "brochure-stac-general",
    title: "STAC Spain General Hardware & Accessories Catalogue",
    brand: "STAC Spain",
    origin: "Spain",
    coverImage: "/assets/showcase/stac_p-000.png",
    fallbackCover: "/assets/showcase/stac_p-000.png",
    description: "Definitive 442-page technical engineering catalogue: flush minimalist cremones, monumental lift & slide bogies up to 400 kg, and anti-burglary locks.",
    pages: 442,
    fileSize: "140.2 MB",
    downloadUrl: "/catalogs/stac-hardware-accessories.pdf",
    highlights: ["Flush Minimalist Handles", "Lift & Slide 400kg", "Polyamide Thermal Breaks", "Grade 5 Corrosion EN 1670"]
  },
  {
    id: "brochure-deceuninck",
    title: "Deceuninck uPVC Systems Complete Catalogue",
    brand: "Deceuninck",
    origin: "Belgium",
    coverImage: "./assets/doorhome/brouchour-deceuninck-1-1000x1000.jpg",
    fallbackCover: "https://doorhome.co/wp-content/uploads/2023/08/brouchour-deceuninck-1-1000x1000.jpg",
    description: "Detailed technical drawings, chamber sections, static calculations, and energy certification for Legend 80, Legend Art, and Everest Max systems.",
    pages: 124,
    fileSize: "18.4 MB",
    downloadUrl: "#",
    highlights: ["Chamber cross sections", "Uw thermal calculations", "Color decors chart", "Acoustic ratings"]
  },
  {
    id: "brochure-master",
    title: "Master Italy Hardware & Systems Catalogue",
    brand: "Master Italy",
    origin: "Italy",
    coverImage: "./assets/doorhome/brouchour-Master-1-1000x1000.jpg",
    fallbackCover: "https://doorhome.co/wp-content/uploads/2023/08/brouchour-Master-1-1000x1000.jpg",
    description: "Comprehensive catalogue of European high-end architectural window handles, multipoint locks, concealed hinges, and automation components.",
    pages: 96,
    fileSize: "14.2 MB",
    downloadUrl: "#",
    highlights: ["Concealed hinge specs", "Cycle test reports", "Automation wiring", "Handle finishes"]
  },
  {
    id: "brochure-lorenzoline",
    title: "Lorenzoline Architectural Aluminum Systems",
    brand: "Lorenzoline",
    origin: "Europe",
    coverImage: "./assets/doorhome/lorenzoline-brochure2-01-1000x1000.jpg",
    fallbackCover: "https://doorhome.co/wp-content/uploads/2023/08/lorenzoline-brochure2-01-1000x1000.jpg",
    description: "Thermal break aluminum profiles, curtain wall stick systems, skylights, and monumental sliding systems for residential and commercial projects.",
    pages: 148,
    fileSize: "22.1 MB",
    downloadUrl: "#",
    highlights: ["Profile inertia charts", "Curtain wall 50F details", "Lift & Slide 70LS assembly", "Polyamide specifications"]
  },
  {
    id: "brochure-comunello",
    title: "Comunello Window Automation & Gate Hardware",
    brand: "Comunello",
    origin: "Italy",
    coverImage: "./assets/doorhome/brouchour-comunello-2-1-1000x1000.jpg",
    fallbackCover: "https://doorhome.co/wp-content/uploads/2023/08/brouchour-comunello-2-1-1000x1000.jpg",
    description: "Chain actuators, rod drives, rack motors for smoke & heat extraction (SHEV), and residential window automation.",
    pages: 82,
    fileSize: "11.6 MB",
    downloadUrl: "#",
    highlights: ["Smart automation", "Smoke ventilation actuators", "Chain drive specs", "Remote controls"]
  }
];

export const DOORHOME_STATS = [
  { value: "25+", label: "Years in Industry", desc: "Decades of market leadership in Iraq" },
  { value: "10,000+", label: "Projects Completed", desc: "Residential villas, towers & commercial buildings" },
  { value: "100%", label: "European Quality", desc: "Belgium, Germany, Italy & Spain partners" },
  { value: "2 Branches", label: "Erbil Showroom & Plant", desc: "Fully equipped fabrication facility" }
];
