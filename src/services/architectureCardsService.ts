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

export const ARCH_SHOWCASE_STORAGE_KEY = 'winhome_cms_arch_showcase';
export const ARCH_SHOWCASE_UPDATED_EVENT = 'cms_arch_showcase_updated';

export const DEFAULT_CATALOGUE_CARDS: ArchitectureCatalogueCard[] = [
  {
    id: 'cat1',
    brand: 'WIEK SYSTEM',
    logo: '/assets/showcase/wiek-logo.png',
    image: '/assets/showcase/wiek_hidden_hinge-04.png',
    title: 'WIEK Belgium Architectural Catalog',
    desc: 'Concealed hinge solutions & architectural fenestration',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WIEK-General-Catalog-2026.pdf',
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
    image: '/assets/showcase/stac_lift_slide-108.png',
    title: 'STAC Spain Hardware Catalog',
    desc: 'Minimalist cremones & monumental lift & slide hardware',
    pdfUrl: '/catalogs/stac-hardware-accessories.pdf',
    fileName: 'STAC-Hardware-Accessories-Catalogue.pdf',
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
    id: 'wiek-hidden-hinge',
    image: '/assets/showcase/wiek_hidden_hinge-04.png',
    fallbackImage: '/assets/catalogs/wiek_page-04.png',
    title: 'WIEK Concealed Tilt & Turn System',
    titleAr: 'نظام WIEK للمفصلات المخفية (Tilt & Turn)',
    titleKu: 'سیستەمی نەرمەلۆی شاردراوەی WIEK',
    description: 'Flush concealed hinge mechanism engineered for modern minimalist architecture with 130 kg sash load capacity and multi-point perimeter security locking.',
    descriptionAr: 'مفصلات مخفية بالكامل مدمجة داخل قطاع الألمنيوم والـ uPVC مصممة للمشاريع المودرن الفاخرة بتحمل وزن يصل إلى 130 كغم مع نقاط إغلاق محكمة.',
    descriptionKu: 'سیستەمی نەرمەلۆی تەواو شاردراوە بۆ پەنجەرەی مۆدێرن و تەلارسازی پێشکەوتوو بە بەرگەی کێشی ١٣٠ کگم و قفڵکردنی چەندین خاڵیی پارێزراو.',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WIEK-General-Catalog-2026.pdf',
    buttonText: 'Open Technical Catalog (PDF)',
    buttonTextAr: 'فتح الكتالوج المعتمد (PDF)',
    buttonTextKu: 'کردنەوەی کەتەلۆگ (PDF)',
    brand: 'WIEK SYSTEM',
    category: 'Concealed Window Architecture'
  },
  {
    id: 'stac-minimal-handles',
    image: '/assets/showcase/stac_window_handles-044.png',
    fallbackImage: '/assets/catalogs/stac_page-004.png',
    title: 'STAC Minimalist Window Handles & Cremones',
    titleAr: 'مقابض STAC المينيماليست المدمجة',
    titleKu: 'دەسکە مۆدێرنەکانی STAC',
    description: 'Aerospace-grade aluminum monolithic forming with 0 mm redundant protrusion and CNC precision milling, seamlessly integrating with thermal window profiles.',
    descriptionAr: 'مقابض معمارية مصنوعة بكتلة ألمنيوم موحدة بدون أي بروز زائد (0 مم) بمكائن CNC دقيقة لتنسجم تماماً مع قطاعات النوافذ الحرارية العصرية.',
    descriptionKu: 'دەسکی تەلارسازی بێ بەرزایی زیادە (0 مم) بە ئەلۆمنیۆمی فڕۆکەوانی 6063-T5 و بڕینی وردی CNC بۆ گونجان لەگەڵ پرۆفایلە مۆدێرنەکان.',
    pdfUrl: '/catalogs/stac-hardware-accessories.pdf',
    fileName: 'STAC-Hardware-Accessories.pdf',
    buttonText: 'Open Technical Catalog (PDF)',
    buttonTextAr: 'فتح الكتالوج المعتمد (PDF)',
    buttonTextKu: 'کردنەوەی کەتەلۆگ (PDF)',
    brand: 'STAC Spain',
    category: 'Monolithic 6063-T5 Series'
  },
  {
    id: 'wiek-bifold',
    image: '/assets/showcase/wiek_bifold_door-34.png',
    fallbackImage: '/assets/catalogs/wiek_page-01.png',
    title: 'WIEK Heavy-Duty Bi-Folding Door System',
    titleAr: 'أنظمة WIEK للأبواب القابلة للطي (Bi-Fold)',
    titleKu: 'سیستەمی دەرگای ئەکۆردیۆنی WIEK (Bi-Fold)',
    description: 'Synchronized multi-leaf bi-folding hardware system with stainless steel silent bearing rollers and secure central transmission gearboxes.',
    descriptionAr: 'أنظمة حركة انسيابية للأبواب القابلة للطي متعددة الضلف برولرات فولاذية صامتة وتروس أمان مركزية متعددة النقاط لتحقيق أوسع انفتاح بانورامي.',
    descriptionKu: 'سیستەمی جوڵەی هاوکات بۆ دەرگای پانۆرامای تاپۆش بە ڕۆڵەری بێدەنگی ستیل و قفڵی چەقیی بەهێز بۆ کردنەوەی فراوانی باخچە و ڤێلا.',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WIEK-General-Catalog-2026.pdf',
    buttonText: 'Open Technical Catalog (PDF)',
    buttonTextAr: 'فتح الكتالوج المعتمد (PDF)',
    buttonTextKu: 'کردنەوەی کەتەلۆگ (PDF)',
    brand: 'WIEK SYSTEM',
    category: 'Bi-Folding & Panoramic Hardware'
  },
  {
    id: 'stac-lift-slide',
    image: '/assets/showcase/stac_lift_slide-108.png',
    fallbackImage: '/assets/showcase/stac_lift_slide-108.png',
    title: 'STAC DELTA Minimalist Lift & Slide System',
    titleAr: 'نظام STAC DELTA للأبواب البانورامية (Lift & Slide)',
    titleKu: 'سیستەمی دەسکی DELTAی ئیسپانی (Lift & Slide)',
    description: 'Minimalist aerodynamic lines with integrated flush finger pull (9.5 mm depth footprint) engineered for smooth maneuvering of heavy sliding panels with superior anti-burglary security.',
    descriptionAr: 'خطوط معمارية مينيماليست مدمجة مع مقبض سحب خارجي غاطس بعمق 9.5 مم فقط، مصممة لتحريك الضلف البانورامية الثقيلة بسلاسة فائقة مع حماية قصوى ضد التآكل والسطو.',
    descriptionKu: 'دیزاینی مۆدێرنی کەمینە لەگەڵ دەسکی دەرەکی دابەزێنراو بە قووڵی تەنها ٩.٥ ملم بۆ خلیسکاندنی ئاسانی دەرگای گەورە بە پاراستنی تەواو لە ژەنگ و دزی.',
    pdfUrl: '/catalogs/stac-hardware-accessories.pdf',
    fileName: 'STAC-Hardware-Accessories.pdf',
    buttonText: 'Open Technical Catalog (PDF)',
    buttonTextAr: 'فتح الكتالوج المعتمد (PDF)',
    buttonTextKu: 'کردنەوەی کەتەلۆگ (PDF)',
    brand: 'STAC Spain',
    category: 'Architectural Lift & Slide Series'
  }
];

// 1. Top Partner Catalogues
export function loadArchitectureCards(): ArchitectureCatalogueCard[] {
  try {
    const raw = localStorage.getItem(ARCH_CARDS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 1) {
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
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 1) {
        return parsed;
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
