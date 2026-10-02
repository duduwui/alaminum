export interface ProductNavModel {
  id: string;
  productId?: string;
  name: string;
  kurdishName: string;
  arabicName?: string;
  modelCode: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  categoryTarget: string;
  image?: string;
}

export interface ProductNavSubCategory {
  id: string;
  title: string;
  kurdishTitle: string;
  arabicTitle?: string;
  items: ProductNavModel[];
}

export interface ProductCategoryDivision {
  id: string;
  key: 'windows' | 'doors' | 'glass' | 'railings' | 'accessories';
  title: string;
  kurdishTitle: string;
  arabicTitle?: string;
  divisionLabel: string;
  kurdishDivisionLabel: string;
  arabicDivisionLabel?: string;
  iconName: string;
  featuredImage: string;
  featuredTitle: string;
  featuredSubtitle: string;
  categoryTarget: string;
  subCategories: ProductNavSubCategory[];
}


export const PRODUCT_DIVISIONS: ProductCategoryDivision[] = [
  // 1. بەشی پەنجەرە (Windows Division)
  {
    id: 'division-windows',
    key: 'windows',
    title: 'Windows Systems',
    kurdishTitle: 'پەنجەرەکان',
    arabicTitle: 'أنظمة النوافذ',
    divisionLabel: 'Windows Division',
    kurdishDivisionLabel: 'بەشی پەنجەرە',
    arabicDivisionLabel: 'قسم النوافذ',
    iconName: 'LayoutGrid',
    featuredImage: './assets/showcase/showcase_lorenzo70ls_1789926091155.jpg',
    featuredTitle: 'Lorenzo 70LS & Legend 80',
    featuredSubtitle: 'Thermal Break & 6-Chamber Passive Windows',
    categoryTarget: 'windows',
    subCategories: [
      {
        id: 'windows-sliding',
        title: 'Sliding & Panoramic Windows',
        kurdishTitle: 'پەنجەرەی سلایدینگ و پانۆراما',
        arabicTitle: 'نوافذ انزلاقية وبانورامية',
        items: [
          {
            id: 'lorenzo-70ls-win',
            name: 'Lorenzo 70LS Minimalist',
            kurdishName: 'لۆرێنزۆ ٧٠ ئەلۆمنیۆمی عەزل',
            arabicName: 'لورينزو 70LS مينيمالست',
            modelCode: '70LS',
            badge: 'Thermal Break',
            badgeColor: 'bg-red-50 text-red-700',
            description: 'Ultra-slim interlocking sightlines with high thermal insulation.',
            categoryTarget: 'aluminum',
            image: './assets/showcase/showcase_lorenzo70ls_1789926091155.jpg'
          },
          {
            id: 'lorenzo-51ls-win',
            name: 'Lorenzo 51LS Slim Sliding',
            kurdishName: 'لۆرێنزۆ ٥١ سلایدینگی باریک',
            arabicName: 'لورينزو 51LS انزلاقي نحيل',
            modelCode: '51LS',
            badge: 'Slimline',
            badgeColor: 'bg-red-50 text-red-700',
            description: 'Lightweight and durable sliding window for residential spaces.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/LIFT-SLIDE-70LS-Medium-300x300.jpeg'
          },
          {
            id: 'hs76-sliding-win',
            name: 'Hebe-Schiebe HS76 System',
            kurdishName: 'هێبێ شیبێ ٧٦ قورس',
            arabicName: 'نظام HS76 رفع وانزلاق',
            modelCode: 'HS76',
            badge: 'Heavy Lift',
            badgeColor: 'bg-amber-50 text-amber-700',
            description: 'Heavyweight lift-and-slide engineered for extreme desert climate.',
            categoryTarget: 'upvc',
            image: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg'
          }
        ]
      },
      {
        id: 'windows-casement',
        title: 'Casement & Tilt-Turn Windows',
        kurdishTitle: 'پەنجەرەی کەیسمێنت و قەپات',
        arabicTitle: 'نوافذ كيسمنت وتيلت-تيرن',
        items: [
          {
            id: 'legend-80-win',
            name: 'Deceuninck Legend 80',
            kurdishName: 'لێجەند ٨٠ شەش خانە',
            arabicName: 'ديكونينك ليجند 80',
            modelCode: 'Legend 80',
            badge: 'Passivhaus',
            badgeColor: 'bg-emerald-50 text-emerald-700',
            description: '80mm 6-chamber uPVC profile with 45 dB acoustic barrier.',
            categoryTarget: 'upvc',
            image: './assets/showcase/showcase_legend80_1789926007847.jpg'
          },
          {
            id: 'everest-max-win',
            name: 'Everest Max 70 uPVC',
            kurdishName: 'ئێڤرێست ماکس ٧٠',
            arabicName: 'إيفرست ماكس 70 يو بي في سي',
            modelCode: 'Everest 70',
            badge: '4-Chamber',
            badgeColor: 'bg-slate-100 text-slate-700',
            description: 'Classic durable casement and tilt-turn window series.',
            categoryTarget: 'upvc',
            image: './assets/doorhome/10.png'
          },
          {
            id: 'lorenzo-60t-win',
            name: 'Lorenzo 60T Thermal Casement',
            kurdishName: 'لۆرێنزۆ ٦٠ ئەلۆمنیۆم',
            arabicName: 'لورينزو 60T ألمنيوم حراري',
            modelCode: '60T',
            badge: 'Polyamide 24mm',
            badgeColor: 'bg-red-50 text-red-700',
            description: 'Thermal break aluminum casement with multi-locking security.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/3-2.jpg'
          }
        ]
      },
      {
        id: 'windows-special',
        title: 'Automated & Specialty Windows',
        kurdishTitle: 'سیستەمی گیۆتین و تایبەت',
        arabicTitle: 'نوافذ آلية ومتخصصة',
        items: [
          {
            id: 'guillotine-win',
            name: 'Guillotine Motorized Window',
            kurdishName: 'پەنجەرەی گیۆتینی کارەبایی',
            arabicName: 'نافذة جيوتين آلية',
            modelCode: 'Guillotine',
            badge: 'Motorized',
            badgeColor: 'bg-purple-50 text-purple-700',
            description: 'Vertical motorized sliding glass for restaurants and luxury villas.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/signature-bg.jpg'
          },
          {
            id: 'tilt-slide-win',
            name: 'Tilt & Slide Parallel System',
            kurdishName: 'سیستەمی تیلت ئەند سلاید',
            arabicName: 'نظام تيلت وسلايد متوازي',
            modelCode: 'T&S',
            badge: '100% Airtight',
            badgeColor: 'bg-teal-50 text-teal-700',
            description: 'Compression perimeter gasket for superior dust and soundproofing.',
            categoryTarget: 'upvc',
            image: './assets/doorhome/photo_2023-07-03_15-41-20-1280x820.jpg'
          }
        ]
      }
    ]
  },

  // 2. بەشی دەرگا (Doors Division)
  {
    id: 'division-doors',
    key: 'doors',
    title: 'Door Systems',
    kurdishTitle: 'دەرگاکان',
    arabicTitle: 'أنظمة الأبواب',
    divisionLabel: 'Doors Division',
    kurdishDivisionLabel: 'بەشی دەرگا',
    arabicDivisionLabel: 'قسم الأبواب',
    iconName: 'DoorClosed',
    featuredImage: './assets/showcase/showcase_hs76_1789926153920.jpg',
    featuredTitle: 'Monumental Pivot & Bi-Fold Doors',
    featuredSubtitle: 'Heavy-Duty Entrance & Panoramic Glides',
    categoryTarget: 'doors',
    subCategories: [
      {
        id: 'doors-panoramic',
        title: 'Panoramic Lift & Slide Doors',
        kurdishTitle: 'دەرگای پانۆرامای سلایدینگ',
        arabicTitle: 'أبواب سحاب بانورامية',
        items: [
          {
            id: 'lorenzo-70ls-door',
            name: 'Lorenzo 70LS Monumental Door',
            kurdishName: 'دەرگای پانۆرامای لۆرێنزۆ 70LS',
            arabicName: 'أبواب سحاب ألمنيوم لورنزو 70LS',
            modelCode: '70LS Door',
            badge: 'Up to 3.2m',
            badgeColor: 'bg-red-50 text-red-700',
            description: 'Floor-to-ceiling panoramic glass door with flush floor threshold.',
            categoryTarget: 'aluminum',
            image: './assets/showcase/showcase_lorenzo70ls_1789926091155.jpg'
          },
          {
            id: 'hs76-door',
            name: 'HS76 Hebe-Schiebe Patio Door',
            kurdishName: 'دەرگای سحابی هێبێ شیبێ HS76',
            arabicName: 'أبواب سحاب ثقيلة uPVC هيب شيب',
            modelCode: 'HS76 Patio',
            badge: '300kg Load',
            badgeColor: 'bg-amber-50 text-amber-700',
            description: 'Massive lift-and-slide sash capacity with effortless finger glide.',
            categoryTarget: 'upvc',
            image: './assets/showcase/showcase_hs76_1789926153920.jpg'
          }
        ]
      },
      {
        id: 'doors-entrance',
        title: 'Main Entrance & Pivot Doors',
        kurdishTitle: 'دەرگای سەرەکی و پیڤۆت',
        arabicTitle: 'أبواب رئيسية وبيفوت',
        items: [
          {
            id: 'pivot-monumental-door',
            name: 'Architectural Pivot Entrance Door',
            kurdishName: 'دەرگای پیڤۆتی مۆدێرنی ڤێلا',
            arabicName: 'أبواب بيفوت محورية فاخرة للفلل',
            modelCode: 'Pivot 100',
            badge: 'Heavy Pivot',
            badgeColor: 'bg-slate-900 text-white',
            description: 'High-end pivot door for luxury villas with digital smart lock.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/03-2.jpg'
          },
          {
            id: 'legend-entrance-door',
            name: 'Legend 80 Security Entrance Door',
            kurdishName: 'دەرگای سەرەکی لێجەند ٨٠',
            arabicName: 'أبواب رئيسية uPVC ليجند 80',
            modelCode: 'Legend Door',
            badge: 'RC3 Security',
            badgeColor: 'bg-emerald-50 text-emerald-700',
            description: 'Steel reinforced uPVC entrance door with multi-bolt locks.',
            categoryTarget: 'upvc',
            image: './assets/doorhome/4-2.jpg'
          }
        ]
      },
      {
        id: 'doors-folding',
        title: 'Folding & Partition Doors',
        kurdishTitle: 'دەرگای فۆڵدینگ و ئەکۆردیۆن',
        arabicTitle: 'أبواب قابلة للطي وأكورديون',
        items: [
          {
            id: 'bifold-77bf-door',
            name: 'Bi-Fold 77BF Concertina Door',
            kurdishName: 'دەرگای قەدکراوی ئەکۆردیۆن',
            arabicName: 'أبواب فولدينغ أكورديون 77BF',
            modelCode: '77BF',
            badge: 'Up to 7 Leaves',
            badgeColor: 'bg-red-50 text-red-700',
            description: 'Completely folding panels for seamless outdoor/indoor integration.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg'
          },
          {
            id: 'office-partition-door',
            name: 'Office Partition 24Z System',
            kurdishName: 'جیاکەرەوەی ئەلۆمنیۆمی ئۆفیس',
            arabicName: 'قواطع زجاجية وألمنيوم للمكاتب 24Z',
            modelCode: '24Z',
            badge: 'Modular',
            badgeColor: 'bg-slate-100 text-slate-700',
            description: 'Acoustic glass partitions for corporate offices and conference rooms.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/OFFICE-PARTITION-24Z-Large-300x300.jpeg'
          }
        ]
      }
    ]
  },

  // 3. بەشی جام و ڕووکار (Glass & Facades Division)
  {
    id: 'division-glass',
    key: 'glass',
    title: 'Glass & Facades',
    kurdishTitle: 'جام و شووشە و ڕووکار',
    arabicTitle: 'الزجاج والواجهات',
    divisionLabel: 'Glass & Facades Division',
    kurdishDivisionLabel: 'بەشی جام و ڕووکار',
    arabicDivisionLabel: 'قسم الزجاج والواجهات',
    iconName: 'Building',
    featuredImage: './assets/showcase/showcase_curtain50f_1789926115841.jpg',
    featuredTitle: 'Curtain Wall 50F & Low-E Glazing',
    featuredSubtitle: 'Structural Towers & High-Performance Solar Glass',
    categoryTarget: 'glass',
    subCategories: [
      {
        id: 'glass-facades',
        title: 'Curtain Walls & Commercial Façades',
        kurdishTitle: 'ڕووکاری کەرتن وۆڵ و باڵەخانە',
        arabicTitle: 'الواجهات الزجاجية والكيرتن وول',
        items: [
          {
            id: 'facade-50f',
            name: 'Façade 50F Stick Curtain Wall',
            kurdishName: 'کەرتن وۆڵ ڕووکار ٥٠ ملم',
            arabicName: 'واجهة زجاجية 50F كيرتن وول',
            modelCode: '50F',
            badge: 'EN-13830 Certified',
            badgeColor: 'bg-red-50 text-red-700',
            description: 'Engineered mullion-transom grid for high-rise glass buildings.',
            categoryTarget: 'aluminum',
            image: './assets/showcase/showcase_curtain50f_1789926115841.jpg'
          },
          {
            id: 'skylight-50f',
            name: 'Sky Light 50F Roof Atrium',
            kurdishName: 'سکای لایت و سەربانی شووشە',
            arabicName: 'سقف زجاجي وأتريوم علوي',
            modelCode: 'Sky 50F',
            badge: 'Watertight 9A',
            badgeColor: 'bg-red-50 text-red-700',
            description: 'Structural glass roof and pyramid atriums for natural skylight.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/photo_2023-07-03_15-42-28-1120x716.jpg'
          }
        ]
      },
      {
        id: 'glass-types',
        title: 'Architectural Glazing & Insulated Units',
        kurdishTitle: 'جامی عەزل، سکۆریت و لامینەیت',
        arabicTitle: 'الزجاج المعزول والسيكوريت واللاميناتي',
        items: [
          {
            id: 'low-e-double',
            name: 'Low-E Double Thermal Glazing',
            kurdishName: 'جامی عەزلی دەبڵ لۆو-ئی',
            arabicName: 'زجاج مزدوج عازل Low-E',
            modelCode: 'Low-E 2X',
            badge: 'Solar Control',
            badgeColor: 'bg-emerald-50 text-emerald-700',
            description: 'Argon gas filled double glazing to reflect Iraqi summer heat.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/photo_2023-07-03_15-41-20-1280x820.jpg'
          },
          {
            id: 'low-e-triple',
            name: 'Low-E Triple Passivhaus Glass',
            kurdishName: 'جامی عەزلی تریپڵ سێ قات',
            arabicName: 'زجاج ثلاثي عازل Passivhaus',
            modelCode: 'Triple Low-E',
            badge: 'Ug ≤ 0.6 W/m²K',
            badgeColor: 'bg-purple-50 text-purple-700',
            description: 'Maximum insulation and acoustic isolation for ultimate comfort.',
            categoryTarget: 'upvc',
            image: './assets/doorhome/photo_2023-07-03_15-50-46-1104x700.jpg'
          },
          {
            id: 'laminated-safety',
            name: 'Laminated & Securit Safety Glass',
            kurdishName: 'جامی سکۆریت و لامینەیتی پارێزەر',
            arabicName: 'زجاج سيكوريت ولاميناتي واقٍ',
            modelCode: 'PVB Safe',
            badge: 'Anti-Shatter',
            badgeColor: 'bg-slate-900 text-white',
            description: 'High-impact shatterproof glass for storefronts and residences.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/24-1.jpg'
          }
        ]
      }
    ]
  },

  // 4. بەشی محاجەرە و پارێزبەند (Railings & Balustrades Division)
  {
    id: 'division-railings',
    key: 'railings',
    title: 'Railings & Balustrades',
    kurdishTitle: 'محاجەرە و پارێزبەند',
    arabicTitle: 'الدرابزينات والحواجز',
    divisionLabel: 'Railings Division',
    kurdishDivisionLabel: 'بەشی محاجەرە',
    arabicDivisionLabel: 'قسم الدرابزينات',
    iconName: 'Shield',
    featuredImage: './assets/doorhome/photo_2023-07-03_15-38-36-600x390.jpg',
    featuredTitle: 'Frameless Glass & Aluminum Railings',
    featuredSubtitle: 'Balconies, Staircases & French Railings',
    categoryTarget: 'railings',
    subCategories: [
      {
        id: 'railings-glass',
        title: 'Glass Balustrade Systems',
        kurdishTitle: 'محاجەرەی شووشەی مۆدێرن',
        arabicTitle: 'درابزينات وحواجز زجاجية',
        items: [
          {
            id: 'frameless-glass-rail',
            name: 'Frameless Floor Base Balustrade',
            kurdishName: 'شووشەی بێ ستوون بنکە ئەلۆمنیۆم',
            arabicName: 'درابزين زجاجي بدون أعمدة بنعل ألمنيوم',
            modelCode: 'Glass Rail 150',
            badge: 'Minimal Vista',
            badgeColor: 'bg-red-50 text-red-700',
            description: 'Continuous aluminum base shoe with 8+8mm or 10+10mm tempered glass.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/photo_2023-07-03_15-38-36-600x390.jpg'
          },
          {
            id: 'spigot-glass-rail',
            name: 'Stainless Steel Spigot System',
            kurdishName: 'محاجەرەی سپیگۆتی ئیستیل',
            arabicName: 'حواجز زجاجية بمرابط ستانلس ستيل',
            modelCode: 'Spigot SS316',
            badge: 'Marine Grade',
            badgeColor: 'bg-slate-100 text-slate-700',
            description: 'Point fixed marine-grade stainless steel clamp holders.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/photo_2023-07-03_15-49-24-760x485.jpg'
          },
          {
            id: 'french-balcony',
            name: 'French Balcony Glass System',
            kurdishName: 'باڵکۆنی فەرەنسی مۆدێرن',
            arabicName: 'بلكونة فرنسية زجاجية عصرية',
            modelCode: 'French Rail',
            badge: 'Window Guard',
            badgeColor: 'bg-red-50 text-red-700',
            description: 'Minimal exterior glass barrier for full-height opening windows.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/03-2.jpg'
          }
        ]
      },
      {
        id: 'railings-aluminum',
        title: 'Aluminum Profile Railings',
        kurdishTitle: 'محاجەرەی ئەلۆمنیۆم و پلیکانە',
        arabicTitle: 'درابزينات ألمنيوم وسلالم',
        items: [
          {
            id: 'anodized-alum-rail',
            name: 'Anodized Aluminum Handrail System',
            kurdishName: 'محاجەرەی ئەلۆمنیۆمی ئەنۆدایز',
            arabicName: 'درابزين ألمنيوم أنودايز مقاوم للصدأ',
            modelCode: 'Alum Rail 50',
            badge: 'Weatherproof',
            badgeColor: 'bg-emerald-50 text-emerald-700',
            description: 'Corrosion-proof anodized handrails for stairs and balconies.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg'
          },
          {
            id: 'pool-fence-rail',
            name: 'Pool Safety Glass Enclosure',
            kurdishName: 'پارێزبەندی شووشەی مەلەوانگە',
            arabicName: 'سياج وحواجز زجاجية للمسابح',
            modelCode: 'Pool Safe',
            badge: 'Safety First',
            badgeColor: 'bg-teal-50 text-teal-700',
            description: 'Self-closing magnetic gate and child-safe pool fencing.',
            categoryTarget: 'aluminum',
            image: './assets/doorhome/signature-bg.jpg'
          }
        ]
      }
    ]
  },

  // 5. بەشی ئێکسسوارات و قوفڵ (Hardware & Accessories Division)
  {
    id: 'division-accessories',
    key: 'accessories',
    title: 'Hardware & Accessories',
    kurdishTitle: 'ئێکسسوارات و قوفڵ',
    arabicTitle: 'الحديد والإكسسوارات',
    divisionLabel: 'Accessories Division',
    kurdishDivisionLabel: 'بەشی ئێکسسوارات و قوفڵ',
    arabicDivisionLabel: 'قسم الحديد والإكسسوارات',
    iconName: 'Wrench',
    featuredImage: './assets/doorhome/brouchour-stac-1-1000x1000.jpg',
    featuredTitle: 'STAC Spain & Master Italy Hardware',
    featuredSubtitle: 'Multipoint Locks, Heavy Rollers & EPDM Seals',
    categoryTarget: 'accessories',
    subCategories: [
      {
        id: 'acc-locks',
        title: 'Locks & Multipoint Mechanisms',
        kurdishTitle: 'قوفڵ و دەسکی ئەوروپی',
        arabicTitle: 'أقفال ومقابض أوروبية',
        items: [
          {
            id: 'stac-multipoint',
            name: 'STAC Spain Multipoint Security Lock',
            kurdishName: 'قوفڵی ستاکی ئیسپانی فرە-خاڵ',
            arabicName: 'أقفال أمان متعددة النقاط STAC إسبانية',
            modelCode: 'STAC Locks',
            badge: 'Made in Spain',
            badgeColor: 'bg-red-50 text-red-700',
            description: 'Certified anti-burglary multipoint perimeter locking gears.',
            categoryTarget: 'accessories',
            image: './assets/doorhome/brouchour-stac-1-1000x1000.jpg'
          },
          {
            id: 'master-handles',
            name: 'Master Italy Ergonomic Handles',
            kurdishName: 'دەسکی ماستەری ئیتاڵی',
            arabicName: 'مقابض ماستر إيطالية فاخرة',
            modelCode: 'Master Italy',
            badge: 'Italian Design',
            badgeColor: 'bg-emerald-50 text-emerald-700',
            description: 'Architectural aluminum and brass handles in matte black and silver.',
            categoryTarget: 'accessories',
            image: './assets/doorhome/brouchour-Master-1-1000x1000.jpg'
          }
        ]
      },
      {
        id: 'acc-mechanisms',
        title: 'Rollers, Hinges & Automation',
        kurdishTitle: 'ڕۆڵەر، نەرمەی بەهێز و مۆتۆری زیرەک',
        arabicTitle: 'بكرات ومفصلات ومحركات ذكية',
        items: [
          {
            id: 'comunello-rollers',
            name: 'Comunello Italy Heavy Tandem Rollers',
            kurdishName: 'ڕۆڵەری کۆمۆنێللۆی ئیتاڵی',
            arabicName: 'بكرات كومونيللو إيطالية فائقة التحمل',
            modelCode: 'Comunello 400',
            badge: '400kg Rated',
            badgeColor: 'bg-red-50 text-red-700',
            description: 'Stainless steel tandem ball-bearing rollers for smooth sliding.',
            categoryTarget: 'accessories',
            image: './assets/doorhome/brouchour-comunello-2-1-1000x1000.jpg'
          },
          {
            id: 'somfy-automation',
            name: 'Somfy Smart Window & Shutter Motors',
            kurdishName: 'مۆتۆری سۆمفی زیرەک',
            arabicName: 'محركات سومفي الذكية للأبواب والنوافذ',
            modelCode: 'Somfy IO',
            badge: 'Smart Home',
            badgeColor: 'bg-purple-50 text-purple-700',
            description: 'Wireless remote and smartphone controlled motorized openers.',
            categoryTarget: 'accessories',
            image: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg'
          },
          {
            id: 'epdm-gaskets',
            name: 'Triple Continuous EPDM Weatherseals',
            kurdishName: 'لاستیکی عەزلی ئی پی دی ئێم',
            arabicName: 'مطاط عزل ثلاثي EPDM مقاوم للشمس',
            modelCode: 'EPDM Seals',
            badge: 'UV Proof',
            badgeColor: 'bg-slate-900 text-white',
            description: 'High-elasticity weatherstripping resistant to 50°C heat and sand.',
            categoryTarget: 'accessories',
            image: './assets/doorhome/2-1.png'
          }
        ]
      }
    ]
  }
];
