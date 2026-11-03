export interface ArchitectureCatalogueCard {
  id: string;
  brand: string;
  logo: string;
  image?: string;
  title: string;
  desc: string;
  pdfUrl: string;
  fileName?: string;
  company: string;
  buttonText?: string;
  translations?: Record<string, { title?: string; desc?: string; buttonText?: string }>;
}

export interface ArchitectureShowcaseItem {
  id: string;
  image: string; // Architectural drawing, diagram, or system photo
  fallbackImage?: string;
  title: string; // English Title
  titleAr?: string; // Arabic Title
  titleKu?: string; // Kurdish Title
  description: string; // English Description
  descriptionAr?: string; // Arabic Description
  descriptionKu?: string; // Kurdish Description
  pdfUrl: string; // Technical PDF file
  fileName?: string;
  buttonText?: string;
  buttonTextAr?: string;
  buttonTextKu?: string;
  brand?: string;
  category?: string;
}

export const ARCH_CARDS_STORAGE_KEY = 'winhome_cms_arch_cards';
export const ARCH_CARDS_UPDATED_EVENT = 'cms_arch_cards_updated';

export const ARCH_SHOWCASE_STORAGE_KEY = 'winhome_cms_arch_showcase_v2';
export const ARCH_SHOWCASE_UPDATED_EVENT = 'cms_arch_showcase_updated';

export const DEFAULT_CATALOGUE_CARDS: ArchitectureCatalogueCard[] = [
  {
    id: 'cat1',
    brand: 'Architectural Hardware System',
    logo: '/assets/showcase/wiek-logo.png',
    image: '/assets/catalogs/wiek_page_4_concealed_hinge.png',
    title: 'Architectural Fenestration Systems Catalog',
    desc: 'Concealed hinge solutions & architectural fenestration',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WİEK general-catalog-2026.pdf',
    company: 'Architectural Systems International',
    buttonText: 'Open Catalog',
    translations: {
      ar: {
        title: 'كتالوج الأنظمة المعمارية المتقدمة',
        desc: 'المفصلات المخفية والحلول الهندسية المتطورة',
        buttonText: 'فتح الكتالوج'
      },
      ckb: {
        title: 'کەتەلۆگی سیستەمە تەلارسازییە پێشکەوتووەکان',
        desc: 'چارەسەری نەرمەلۆی شاردراوە و سیستەمی ئەندازیاری',
        buttonText: 'کردنەوەی کەتەلۆگ'
      }
    }
  },
  {
    id: 'cat2',
    brand: 'Architectural Hardware Systems',
    logo: '/assets/showcase/stac-logo.png',
    image: '/assets/catalogs/stac_page_51_minimalist_handles.png',
    title: 'Architectural Hardware & Accessories Catalog',
    desc: 'Minimalist cremones & monumental lift & slide hardware',
    pdfUrl: '/catalogs/stac-hardware-accessories.pdf',
    fileName: 'EN General catalogue of hardware and accessories 0_240513_180809 (1).pdf',
    company: 'Architectural Hardware Global',
    buttonText: 'Open Catalog',
    translations: {
      ar: {
        title: 'كتالوج الإكسسوارات والمقابض المعمارية',
        desc: 'المقابض المينيماليست وتروس السحب والرفع المتطورة',
        buttonText: 'فتح الكتالوج'
      },
      ckb: {
        title: 'کەتەلۆگی دەسک و ئێکسسواراتی تەلارسازی',
        desc: 'دەسکی مینیمالیست و میکانیزمی بەرزکردنەوە و سلایدینگ',
        buttonText: 'کردنەوەی کەتەلۆگ'
      }
    }
  }
];

export const DEFAULT_ARCHITECTURE_SHOWCASE_ITEMS: ArchitectureShowcaseItem[] = [
  {
    id: 'wiek-limiting-hinge-w23045',
    image: '/assets/catalogs/wiek_page_50_limiting_hinge.png',
    fallbackImage: '/assets/catalogs/wiek_page_50_limiting_hinge.png',
    title: 'Architectural Limiting Hinge Series',
    titleAr: 'سلسلة مفصلات تحديد الفتح الهندسية المعتمدة',
    titleKu: 'سیستەمی نەرمەلۆی سنوردارکردنی کردنەوەی ئەندازیاری',
    description: 'Extensible/Adjustable limiting hinge set for projected windows. Suitable for Standard Architectural Groove profiles, manufactured in Marine Grade Stainless Steel. Allows window opening in 5 defined positions with adjustable sash positioning.',
    descriptionAr: 'طقم مفصلات تحديد الفتح القابلة للتمديد والضبط للنوافذ القلابة والمعمارية البارزة للخارج. متوافقة مع قطاعات المجرى القياسي وسلسلة القطاعات المعمارية، مصنعة من الفولاذ المقاوم للصدأ عالي التحمل وتتيح فتح النافذة بـ 5 وضعيات محددة مع إمكانية ضبط زاوية الفتح بدقة.',
    descriptionKu: 'کۆمەڵە نەرمەلۆی سنوردارکردنی درێژکراوە و ڕێکخراو بۆ پەنجەرەی دەرپەڕیو البارزة للخارج. گونجاوە بۆ پرۆفایلی ستاندارد، لە ستیلی دژە ژەنگ دروستکراوە بە ٥ دۆخی کردنەوە.',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WİEK general-catalog-2026.pdf',
    buttonText: 'Open Technical Sheet',
    buttonTextAr: 'معاينة المخطط الفني بالكتالوج',
    buttonTextKu: 'کردنەوەی نەخشەی تەکنیکی',
    brand: 'Architectural System',
    category: 'Limiting Hinge Series'
  },
  {
    id: 'wiek-precision-bifold-w00006',
    image: '/assets/catalogs/wiek_page_36_bifold_door.png',
    fallbackImage: '/assets/catalogs/wiek_page_36_bifold_door.png',
    title: 'Precision Bi-Folding Architectural Door System',
    titleAr: 'نظام الأبواب القابلة للطي المعماري فائق الخفة والدقة',
    titleKu: 'سیستەمی دەرگای تاپۆشی پێشکەوتووی کێش سووک و ورد',
    description: 'Ultra-lightweight precision folding door system with synchronized rolling carriages and reinforced multi-point central locking mechanism for wide monumental residential openings.',
    descriptionAr: 'نظام حركة معمارية فائق الدقة للأبواب القابلة للطي والتطبيق متعددة الضلف برولرات فولاذية صامتة وتروس أمان مركزية متعددة النقاط لتحقيق أوسع انفتاح بانورامي للحدائق والواجهات.',
    descriptionKu: 'سیستەمی دەرگای تاپۆشی پێشکەوتوو بە ڕۆڵەری بێدەنگ و قفڵی چەقیی پتەو بۆ کردنەوەی پانۆرامای باخچە و ڤێلاکان بە ڕووبەری فراوان.',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WİEK general-catalog-2026.pdf',
    buttonText: 'Open Technical Sheet',
    buttonTextAr: 'معاينة المخطط الفني بالكتالوج',
    buttonTextKu: 'کردنەوەی نەخشەی تەکنیکی',
    brand: 'Architectural System',
    category: 'Folding Door Systems'
  },
  {
    id: 'wiek-lift-slide-ls150',
    image: '/assets/catalogs/wiek_page_56_lift_slide.png',
    fallbackImage: '/assets/catalogs/wiek_page_56_lift_slide.png',
    title: 'Heavy-Duty Panoramic Lift & Slide System',
    titleAr: 'نظام السحب والرفع البانورامي فائق التحمل',
    titleKu: 'سیستەمی سلایدینگ و بەرزکردنەوەی پانۆرامای بەهێز',
    description: 'Heavy-duty lift & slide hardware system engineered for monumental thermal sliding panels with high wind-load resistance and smooth transmission gearing.',
    descriptionAr: 'منظومة تروس ورولرات متطورة للأبواب السحابة العملاقة بتقنية السحاب والرفع المعماري، مصممة لتحريك الضلف الزجاجية الثقيلة بسلاسة استثنائية مع عزل محكم ضد العواصف والرياح.',
    descriptionKu: 'سیستەمی ئەندازیاری پێشکەوتوو بۆ دەرگای گەورەی سلاید و بەرزکردنەوە بە جوڵەی زۆر نەرم و پاراستنی تەواو لە با و باران.',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WİEK general-catalog-2026.pdf',
    buttonText: 'Open Technical Sheet',
    buttonTextAr: 'معاينة المخطط الفني بالكتالوج',
    buttonTextKu: 'کردنەوەی نەخشەی تەکنیکی',
    brand: 'Architectural System',
    category: 'Lift & Slide Hardware'
  },
  {
    id: 'wiek-concealed-hinge-system',
    image: '/assets/catalogs/wiek_page_4_concealed_hinge.png',
    fallbackImage: '/assets/catalogs/wiek_page_4_concealed_hinge.png',
    title: 'Concealed 180° Flush Hinge System',
    titleAr: 'نظام المفصلات المخفية بالكامل بزاوية 180°',
    titleKu: 'سیستەمی نەرمەلۆی تەواو شاردراوە بە گۆشەی 180°',
    description: 'Converts 180 degrees to 90 degrees flush concealed hinge architecture engineered for modern minimalist profiles with 130 kg sash load capacity and modular locking.',
    descriptionAr: 'مفصلات غاطسة مخفية 100% داخل قطاع الألمنيوم والـ يو بي في سي عالي العزل تمنح خطوطاً معمارية متناسقة وخالية من أي بروز خارجي مع قدرة تحمل أوزان حتى 130 كغم.',
    descriptionKu: 'نەرمەلۆی تەواو شاردراوە لەناو پرۆفایل بۆ پەنجەرەی مۆدێرن بە شێوازێکی جوان و بێ بروز بە بەرگەی کێشی ١٣٠ کگم.',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WİEK general-catalog-2026.pdf',
    buttonText: 'Open Technical Sheet',
    buttonTextAr: 'معاينة المخطط الفني بالكتالوج',
    buttonTextKu: 'کردنەوەی نەخشەی تەکنیکی',
    brand: 'Architectural System',
    category: 'Concealed Window Hardware'
  },
  {
    id: 'stac-minimalist-handle-delta',
    image: '/assets/catalogs/stac_page_51_minimalist_handles.png',
    fallbackImage: '/assets/catalogs/stac_page_51_minimalist_handles.png',
    title: 'Minimalist Architectural Handle Series',
    titleAr: 'سلسلة المقابض المعمارية المينيماليست بدون غطاء',
    titleKu: 'دەسکی مۆدێرنی مینیمالیست بێ قەپاغ بۆ پەنجەرە',
    description: 'Minimalist handles for side-hung or tilt & turn systems with concealed mechanism without cover, 8 mm transmission spindle, and precision guide system minimizing clearances.',
    descriptionAr: 'مقابض مينيماليست عصرية بدون غطاء خارجي بآلية مخفية ومحور نقل حركة 8 مم ونظام توجيه هندسي يقلل الخلوص، مصممة للنوافذ المفصلية ونوافذ القلاب الحديثة.',
    descriptionKu: 'دەسکی مۆدێرنی کەمینە بە میکانیزمی شاردراوە بێ قەپاغ، بۆ پەنجەرەی باڵدار و قلاب بە جوڵەی زۆر ورد و تەمەندرێژ.',
    pdfUrl: '/catalogs/stac-hardware-accessories.pdf',
    fileName: 'General-catalogue-hardware-accessories.pdf',
    buttonText: 'Open Technical Sheet',
    buttonTextAr: 'معاينة المخطط الفني بالكتالوج',
    buttonTextKu: 'کردنەوەی نەخشەی تەکنیکی',
    brand: 'Architectural System',
    category: 'Minimalist Window Handles'
  }
];

// 1. Top Partner Catalogues
export function loadArchitectureCards(): ArchitectureCatalogueCard[] {
  try {
    const raw = localStorage.getItem(ARCH_CARDS_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_CATALOGUE_CARDS;
}

export function saveArchitectureCards(cards: ArchitectureCatalogueCard[]): void {
  try {
    localStorage.setItem(ARCH_CARDS_STORAGE_KEY, JSON.stringify(cards));
    window.dispatchEvent(new CustomEvent(ARCH_CARDS_UPDATED_EVENT, { detail: cards }));
  } catch (err) {
    console.error('Failed to save architecture cards:', err);
  }
}

export function subscribeToArchitectureCards(callback: (cards: ArchitectureCatalogueCard[]) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<ArchitectureCatalogueCard[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(loadArchitectureCards());
    }
  };
  window.addEventListener(ARCH_CARDS_UPDATED_EVENT, handler);
  return () => window.removeEventListener(ARCH_CARDS_UPDATED_EVENT, handler);
}

// 2. Interactive Systems Showcase (The 1/4 slides with drawing image, title, description, and PDF button)
export function loadArchitectureShowcaseItems(): ArchitectureShowcaseItem[] {
  try {
    const raw = localStorage.getItem(ARCH_SHOWCASE_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const hasOldPlaceholders = parsed.some(
          (p: any) => p.image?.includes('/assets/showcase/') || p.id === 'wiek-hidden-hinge'
        );
        if (!hasOldPlaceholders) {
          return parsed;
        }
      }
    }
  } catch {}
  return DEFAULT_ARCHITECTURE_SHOWCASE_ITEMS;
}

export function saveArchitectureShowcaseItems(items: ArchitectureShowcaseItem[]): void {
  try {
    localStorage.setItem(ARCH_SHOWCASE_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(ARCH_SHOWCASE_UPDATED_EVENT, { detail: items }));
  } catch (err) {
    console.error('Failed to save architecture showcase items:', err);
  }
}

export function subscribeToArchitectureShowcaseItems(callback: (items: ArchitectureShowcaseItem[]) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<ArchitectureShowcaseItem[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(loadArchitectureShowcaseItems());
    }
  };
  window.addEventListener(ARCH_SHOWCASE_UPDATED_EVENT, handler);
  return () => window.removeEventListener(ARCH_SHOWCASE_UPDATED_EVENT, handler);
}
