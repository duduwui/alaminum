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
    brand: 'WIEK SYSTEM',
    logo: '/assets/showcase/wiek-logo.png',
    image: '/assets/catalogs/wiek_page_4_concealed_hinge.png',
    title: 'WIEK Belgium Architectural Catalog',
    desc: 'Concealed hinge solutions & architectural fenestration',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WİEK general-catalog-2026.pdf',
    company: 'WIEK Belgium',
    buttonText: 'Open Catalog',
    translations: {
      ar: {
        title: 'كتالوج شركة WIEK بلجيكا',
        desc: 'المفصلات المخفية والأنظمة المعمارية 2026',
        buttonText: 'فتح الكتالوج'
      },
      ckb: {
        title: 'کەتەلۆگی کۆمپانیای WIEKی بەلجیکی',
        desc: 'چارەسەری نەرمەلۆی شاردراوە و سیستەمی تەلارسازی',
        buttonText: 'کردنەوەی کەتەلۆگ'
      }
    }
  },
  {
    id: 'cat2',
    brand: 'STAC Spain',
    logo: '/assets/showcase/stac-logo.png',
    image: '/assets/catalogs/stac_page_51_minimalist_handles.png',
    title: 'STAC Spain Hardware Catalog',
    desc: 'Minimalist cremones & monumental lift & slide hardware',
    pdfUrl: '/catalogs/stac-hardware-accessories.pdf',
    fileName: 'EN General catalogue of hardware and accessories 0_240513_180809 (1).pdf',
    company: 'STAC Spain',
    buttonText: 'Open Catalog',
    translations: {
      ar: {
        title: 'كتالوج شركة STAC إسبانيا',
        desc: 'المقابض المينيماليست وتروس الرفع والسحب',
        buttonText: 'فتح الكتالوج'
      },
      ckb: {
        title: 'کەتەلۆگی گشتی STACی ئیسپانی',
        desc: 'دەسکی مۆدێرن و سیستەمی لیفت و سلایدینگ',
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
    title: 'WIEK LIMITING HINGE SERIES (W23045)',
    titleAr: 'سلسلة مفصلات تحديد الفتح WIEK (W23045)',
    titleKu: 'سیستەمی نەرمەلۆی سنوردارکردنی کردنەوەی WIEK (W23045)',
    description: 'Extensible/Adjustable limiting hinge set for projected windows. Suitable for European Groove profiles or 40–20 Groove profiles (Series 4000/6000), manufactured in AISI 304 Stainless Steel. Allows window opening in 5 defined positions with adjustable sash positioning.',
    descriptionAr: 'طقم مفصلات تحديد الفتح القابلة للتمديد والضبط للنوافذ القلابة والمعمارية (Projected). متوافقة مع قطاعات المجرى الأوروبي European Groove وسلسلة 4000/6000، مصنعة من الفولاذ المقاوم للصدأ AISI 304 وتتيح فتح النافذة بـ 5 وضعيات محددة مع إمكانية ضبط زاوية الفتح بدقة.',
    descriptionKu: 'کۆمەڵە نەرمەلۆی سنوردارکردنی درێژکراوە و ڕێکخراو بۆ پەنجەرەی دەرپەڕیو (Projected). گونجاوە بۆ پرۆفایلی یۆرۆ گرووڤ و زنجیرەی 4000/6000، لە ستیلی AISI 304 دروستکراوە بە ٥ دۆخی کردنەوە.',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WİEK general-catalog-2026.pdf',
    buttonText: 'Open Technical Sheet (PDF)',
    buttonTextAr: 'معاينة المخطط الفني بالكتالوج (PDF)',
    buttonTextKu: 'کردنەوەی نەخشەی تەکنیکی (PDF)',
    brand: 'WIEK SYSTEM',
    category: 'Limiting Hinge Series'
  },
  {
    id: 'wiek-precision-bifold-w00006',
    image: '/assets/catalogs/wiek_page_36_bifold_door.png',
    fallbackImage: '/assets/catalogs/wiek_page_36_bifold_door.png',
    title: 'WIEK PRECISION BI-FOLDING DOOR SYSTEM (W00006)',
    titleAr: 'نظام الأبواب القابلة للطي WIEK فائق الخفة والدقة (W00006)',
    titleKu: 'سیستەمی دەرگای تاپۆش WIEKی پێشکەوتوو (W00006)',
    description: 'Ultra-lightweight precision folding door system with synchronized rolling carriages and reinforced multi-point central locking mechanism for wide monumental residential openings.',
    descriptionAr: 'نظام حركة معمارية فائق الدقة للأبواب القابلة للطي (Bi-Folding) متعددة الضلف برولرات فولاذية صامتة وتروس أمان مركزية متعددة النقاط لتحقيق أوسع انفتاح بانورامي للحدائق والواجهات.',
    descriptionKu: 'سیستەمی دەرگای تاپۆشی پێشکەوتوو بە ڕۆڵەری بێدەنگ و قفڵی چەقیی پتەو بۆ کردنەوەی پانۆرامای باخچە و ڤێلاکان بە ڕووبەری فراوان.',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WİEK general-catalog-2026.pdf',
    buttonText: 'Open Technical Sheet (PDF)',
    buttonTextAr: 'معاينة المخطط الفني بالكتالوج (PDF)',
    buttonTextKu: 'کردنەوەی نەخشەی تەکنیکی (PDF)',
    brand: 'WIEK SYSTEM',
    category: 'Folding Door Systems'
  },
  {
    id: 'wiek-lift-slide-ls150',
    image: '/assets/catalogs/wiek_page_56_lift_slide.png',
    fallbackImage: '/assets/catalogs/wiek_page_56_lift_slide.png',
    title: 'WIEK LIFT & SLIDE SYSTEM LS150 (W00007)',
    titleAr: 'نظام السحب والرفع البانورامي WIEK LS150 (W00007)',
    titleKu: 'سیستەمی سلایدینگ و بەرزکردنەوەی WIEK LS150 (W00007)',
    description: 'Heavy-duty lift & slide hardware system engineered for monumental thermal sliding panels with high wind-load resistance and smooth transmission gearing.',
    descriptionAr: 'منظومة تروس ورولرات متطورة للأبواب السحابة العملاقة بتقنية Lift & Slide، مصممة لتحريك الضلف الزجاجية الثقيلة بسلاسة استثنائية مع عزل محكم ضد العواصف والرياح.',
    descriptionKu: 'سیستەمی ئەندازیاری پێشکەوتوو بۆ دەرگای گەورەی سلاید و بەرزکردنەوە بە جوڵەی زۆر نەرم و پاراستنی تەواو لە با و باران.',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WİEK general-catalog-2026.pdf',
    buttonText: 'Open Technical Sheet (PDF)',
    buttonTextAr: 'معاينة المخطط الفني بالكتالوج (PDF)',
    buttonTextKu: 'کردنەوەی نەخشەی تەکنیکی (PDF)',
    brand: 'WIEK SYSTEM',
    category: 'Lift & Slide Hardware'
  },
  {
    id: 'wiek-concealed-hinge-system',
    image: '/assets/catalogs/wiek_page_4_concealed_hinge.png',
    fallbackImage: '/assets/catalogs/wiek_page_4_concealed_hinge.png',
    title: 'WIEK 180° CONCEALED TILT & TURN SYSTEM (GBCHALRW)',
    titleAr: 'نظام المفصلات المخفية بالكامل WIEK 180° (GBCHALRW)',
    titleKu: 'سیستەمی نەرمەلۆی تەواو شاردراوەی WIEK 180°',
    description: 'Converts 180 degrees to 90 degrees flush concealed hinge architecture engineered for modern minimalist profiles with 130 kg sash load capacity and modular locking.',
    descriptionAr: 'مفصلات غاطسة مخفية 100% داخل قطاع الألمنيوم والـ uPVC تمنح خطوطاً معمارية متناسقة وخالية من أي بروز خارجي مع قدرة تحمل أوزان حتى 130 كغم.',
    descriptionKu: 'نەرمەلۆی تەواو شاردراوە لەناو پرۆفایل بۆ پەنجەرەی مۆدێرن بە شێوازێکی جوان و بێ بروز بە بەرگەی کێشی ١٣٠ کگم.',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WİEK general-catalog-2026.pdf',
    buttonText: 'Open Technical Sheet (PDF)',
    buttonTextAr: 'معاينة المخطط الفني بالكتالوج (PDF)',
    buttonTextKu: 'کردنەوەی نەخشەی تەکنیکی (PDF)',
    brand: 'WIEK SYSTEM',
    category: 'Concealed Window Hardware'
  },
  {
    id: 'stac-minimalist-handle-delta',
    image: '/assets/catalogs/stac_page_51_minimalist_handles.png',
    fallbackImage: '/assets/catalogs/stac_page_51_minimalist_handles.png',
    title: 'STAC MINIMALIST HANDLE & CREMONE SERIES (DELTA & GAMMA)',
    titleAr: 'سلسلة مقابض STAC المينيماليست بدون غطاء (DELTA & GAMMA)',
    titleKu: 'دەسکی مینیمالیستی STACی ئیسپانی (DELTA & GAMMA)',
    description: 'Minimalist handles for side-hung or tilt & turn systems with concealed mechanism without cover, 8 mm transmission spindle, and precision guide system minimizing clearances.',
    descriptionAr: 'مقابض مينيماليست عصرية بدون غطاء خارجي بآلية مخفية ومحور نقل حركة 8 مم ونظام توجيه هندسي يقلل الخلوص، مصممة للنوافذ المفصلية ونوافذ القلاب الحديثة.',
    descriptionKu: 'دەسکی مۆدێرنی کەمینە بە میکانیزمی شاردراوە بێ قەپاغ، بۆ پەنجەرەی باڵدار و قلاب بە جوڵەی زۆر ورد و تەمەندرێژ.',
    pdfUrl: '/catalogs/stac-hardware-accessories.pdf',
    fileName: 'STAC-Hardware-Accessories.pdf',
    buttonText: 'Open Technical Sheet (PDF)',
    buttonTextAr: 'معاينة المخطط الفني بالكتالوج (PDF)',
    buttonTextKu: 'کردنەوەی نەخشەی تەکنیکی (PDF)',
    brand: 'STAC Spain',
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
