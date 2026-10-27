import React, { useState, useEffect } from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { ProductItem } from '../data/winhomeData';
import { useLanguage } from '../context/LanguageContext';
import {
  loadArchitectureCards,
  subscribeToArchitectureCards,
  ArchitectureCatalogueCard,
  DEFAULT_CATALOGUE_CARDS,
  ArchitectureShowcaseItem,
  DEFAULT_ARCHITECTURE_SHOWCASE_ITEMS,
  loadArchitectureShowcaseItems,
  subscribeToArchitectureShowcaseItems
} from '../services/architectureCardsService';

interface SignatureShowcaseProps {
  onSelectProduct?: (product: ProductItem) => void;
  onSelectProductByName?: (name: string) => void;
  onOpenQuote?: (productName: string) => void;
  onOpenQuoteModal?: (productName?: string) => void;
  onGoToProducts?: (category?: string) => void;
}

export interface LocalizedItem {
  title: string;
  brand: string;
  category: string;
  badge: string;
  description: string;
  specs: Array<{ label: string; val: string }>;
}

export const SHOWCASE_TEXT_BY_LANG: Record<string, { title: string; subtitle: string; estimateBtn: string; specsBtn: string; inspectHint: string }> = {
  "en": {
    "title": "2 Official European Architectural Catalogues & Hardware Systems",
    "subtitle": "Explore and download certified technical engineering catalogues from WIEK Belgium and STAC Spain, featuring precision fenestration hardware and monumental sliding solutions.",
    "estimateBtn": "Download PDF",
    "specsBtn": "Open Catalogue",
    "inspectHint": "Click card to inspect system"
  },
  "ar": {
    "title": "الكتالوجات المعمارية والأنظمة الأوروبية المعتمدة",
    "subtitle": "وصول مباشر وتحميل للكتالوجات الفنية الشاملة لشركة WIEK بلجيكا وSTAC إسبانيا مع أدق التفاصيل الهندسية للأبواب والنوافذ والأنظمة البانورامية.",
    "estimateBtn": "تحميل الكتالوج",
    "specsBtn": "تصفح الكتالوج",
    "inspectHint": "اضغط لمعاينة تفاصيل النظام"
  },
  "ckb": {
    "title": "کەتەلۆگە ئەندازیارییە باوەڕپێکراوەکانی ئەوروپا بۆ دەرگا و پەنجەرە",
    "subtitle": "گەڕان و داگرتنی ڕاستەوخۆی کەتەلۆگی تەکنیکی فەرمی لە WIEKی بەلجیکی و STACی ئیسپانی لەگەڵ هەموو وردەکارییە ئەندازیارییەکان.",
    "estimateBtn": "داگرتنی کەتەلۆگ",
    "specsBtn": "کردنەوەی کەتەلۆگ",
    "inspectHint": "کلیک بکە بۆ بینینی سیستەمەکە"
  },
  "kmr": {
    "title": "Katalogên Fermî yên Mîmarî yên Ewropî ji bo Derî û Pencereyan",
    "subtitle": "Katalogên teknîkî yên fermî yên WIEK (Belçîka) û STAC (Spanya) bi tevahiya taybetmendiyan vekin an daxînin.",
    "estimateBtn": "Katalogê Daxîne",
    "specsBtn": "Katalogê Veke",
    "inspectHint": "Ji bo dîtina hûrguliyan bitikîne"
  },
  "tr": {
    "title": "Resmi Avrupa Mimari Sistem Katalogları ve Donanım Çözümleri",
    "subtitle": "Belçika WIEK ve İspanya STAC firmalarının onaylı teknik mimari kataloglarına doğrudan erişin, detaylı çizim ve sistemleri inceleyin veya indirin.",
    "estimateBtn": "Kataloğu İndir",
    "specsBtn": "Kataloğu Aç",
    "inspectHint": "İncelemek için karta tıklayın"
  }
};

export const ITEM_LOCALES: Record<string, Record<string, LocalizedItem>> = {
  "en": {
    "wiek-hidden-hinge": {
      "title": "WIEK Concealed Tilt & Turn System",
      "brand": "WIEK SYSTEM",
      "category": "Concealed Window Architecture",
      "badge": "180° Hidden Hinge",
      "description": "Flush concealed hinge mechanism engineered for modern minimalist architecture with 130 kg sash load capacity and multi-point perimeter security locking.",
      "specs": [
        { "label": "Sash Load", "val": "130 kg" },
        { "label": "Structure", "val": "100% Concealed" },
        { "label": "Standard", "val": "ISO Certified" }
      ]
    },
    "stac-minimal-handles": {
      "title": "STAC Minimalist Ergonomic Handles",
      "brand": "STAC Spain",
      "category": "Monolithic 6063-T5 Series",
      "badge": "Aerospace Grade",
      "description": "Aerospace-grade aluminum monolithic forming with 0 mm redundant protrusion and CNC precision milling, seamlessly integrating with thermal window profiles.",
      "specs": [
        { "label": "Material", "val": "6063-T5 Alum" },
        { "label": "Protrusion", "val": "0 mm Flush" },
        { "label": "Finishes", "val": "12 RAL Colors" }
      ]
    },
    "wiek-bifold": {
      "title": "WIEK Bi-Folding Patio Door System",
      "brand": "WIEK SYSTEM",
      "category": "Bi-Folding Door Hardware",
      "badge": "Heavy-Duty Tandem",
      "description": "Synchronized multi-leaf bi-folding hardware system with stainless steel silent bearing rollers and secure central transmission gearboxes.",
      "specs": [
        { "label": "Load / Leaf", "val": "100 kg" },
        { "label": "Rollers", "val": "Silent Steel" },
        { "label": "Operation", "val": "Feather-Touch" }
      ]
    },
    "stac-lift-slide": {
      "title": "STAC DELTA Minimalist Lift & Slide System",
      "brand": "STAC Spain",
      "category": "Architectural Lift & Slide Series",
      "badge": "UNE-EN 1670 Grade 4",
      "description": "Minimalist aerodynamic lines with integrated flush finger pull (9.5 mm depth footprint) engineered for smooth maneuvering of heavy sliding panels with superior anti-burglary security.",
      "specs": [
        { "label": "Footprint", "val": "9.5 mm Flush" },
        { "label": "Corrosion", "val": ">240 hrs Salt Spray" },
        { "label": "Security", "val": "Keyhole Cover Plate" }
      ]
    }
  },
  "ar": {
    "wiek-hidden-hinge": {
      "title": "نظام WIEK للمفصلات المخفية (Tilt & Turn)",
      "brand": "WIEK SYSTEM بلجيكا",
      "category": "أنظمة النوافذ المخفية المعمارية",
      "badge": "مفصلات مخفية 180°",
      "description": "مفصلات مخفية بالكامل مدمجة داخل قطاع الألمنيوم والـ uPVC مصممة للمشاريع المودرن الفاخرة بتحمل وزن يصل إلى 130 كغم مع نقاط إغلاق محكمة.",
      "specs": [
        { "label": "حمولة الضلفة", "val": "130 كغم" },
        { "label": "التصميم", "val": "مخفي 100%" },
        { "label": "المعيار", "val": "شهادة ISO" }
      ]
    },
    "stac-minimal-handles": {
      "title": "مقابض STAC المينيماليست المدمجة",
      "brand": "STAC إسبانيا",
      "category": "سلسلة ألمنيوم 6063-T5 الموحدة",
      "badge": "ألمنيوم طيران مدمج",
      "description": "مقابض معمارية مصنوعة بكتلة ألمنيوم موحدة بدون أي بروز زائد (0 مم) بمكائن CNC دقيقة لتنسجم تماماً مع قطاعات النوافذ الحرارية العصرية.",
      "specs": [
        { "label": "المادة", "val": "ألمنيوم 6063-T5" },
        { "label": "البروز", "val": "0 مم مستوٍ" },
        { "label": "الألوان", "val": "12 لون RAL" }
      ]
    },
    "wiek-bifold": {
      "title": "أنظمة WIEK للأبواب القابلة للطي (Bi-Fold)",
      "brand": "WIEK SYSTEM بلجيكا",
      "category": "إكسسوارات الأبواب المطوية",
      "badge": "رولرات ستانلس ستيل",
      "description": "أنظمة حركة انسيابية للأبواب القابلة للطي متعددة الضلف برولرات فولاذية صامتة وتروس أمان مركزية متعددة النقاط لتحقيق أوسع انفتاح بانورامي.",
      "specs": [
        { "label": "وزن الضلفة", "val": "100 كغم" },
        { "label": "العجلات", "val": "ستانلس ستيل صامت" },
        { "label": "الحركة", "val": "انسيابية فائقة" }
      ]
    },
    "stac-lift-slide": {
      "title": "نظام STAC DELTA للأبواب البانورامية (Lift & Slide)",
      "brand": "STAC إسبانيا",
      "category": "سلسلة الرفع والسحب المعمارية",
      "badge": "معتمد UNE-EN 1670",
      "description": "خطوط معمارية مينيماليست مدمجة مع مقبض سحب خارجي غاطس بعمق 9.5 مم فقط، مصممة لتحريك الضلف البانورامية الثقيلة بسلاسة فائقة مع حماية قصوى ضد التآكل والسطو.",
      "specs": [
        { "label": "عمق المقبض", "val": "9.5 مم غاطس" },
        { "label": "مقاومة التآكل", "val": "درجة 4 UNE-EN" },
        { "label": "الأمان", "val": "غطاء قفل مصفح" }
      ]
    }
  },
  "ckb": {
    "wiek-hidden-hinge": {
      "title": "سیستەمی نەرمەلۆی شاردراوەی WIEK",
      "brand": "WIEK SYSTEMی بەلجیکی",
      "category": "پەنجەرەی نەرمەلۆ شاردراوە",
      "badge": "شاردراوەی ١٨٠ پلە",
      "description": "سیستەمی نەرمەلۆی تەواو شاردراوە بۆ پەنجەرەی مۆدێرن و تەلارسازی پێشکەوتوو بە بەرگەی کێشی ١٣٠ کگم و قفڵکردنی چەندین خاڵیی پارێزراو.",
      "specs": [
        { "label": "کێشی باڵ", "val": "١٣٠ کگم" },
        { "label": "پێکهاتە", "val": "١٠٠٪ شاردراوە" },
        { "label": "ستاندارد", "val": "باوەڕپێکراوی ISO" }
      ]
    },
    "stac-minimal-handles": {
      "title": "دەسکە مۆدێرنەکانی STAC",
      "brand": "STACی ئیسپانی",
      "category": "ئەلۆمنیۆمی فڕۆکەوانی",
      "badge": "سفر میلیمەتر بەرزایی",
      "description": "دەسکی تەلارسازی بێ بەرزایی زیادە (0 مم) بە ئەلۆمنیۆمی فڕۆکەوانی 6063-T5 و بڕینی وردی CNC بۆ گونجان لەگەڵ پرۆفایلە مۆدێرنەکان.",
      "specs": [
        { "label": "ماددە", "val": "6063-T5 Alum" },
        { "label": "بەرزایی", "val": "0 mm بێ دەرچوون" },
        { "label": "ڕەنگەکان", "val": "١٢ ڕەنگی جیاواز" }
      ]
    },
    "wiek-bifold": {
      "title": "سیستەمی دەرگای ئەکۆردیۆنی WIEK (Bi-Fold)",
      "brand": "WIEK SYSTEMی بەلجیکی",
      "category": "ئێکسسواراتی دەرگای ئەکۆردیۆن",
      "badge": "ڕۆڵەری بەهێزی ستیل",
      "description": "سیستەمی جوڵەی هاوکات بۆ دەرگای پانۆرامای تاپۆش بە ڕۆڵەری بێدەنگی ستیل و قفڵی چەقیی بەهێز بۆ کردنەوەی فراوانی باخچە و ڤێلا.",
      "specs": [
        { "label": "کێشی هەر باڵێک", "val": "١٠٠ کگم" },
        { "label": "ڕۆڵەر", "val": "ستیل و بێدەنگ" },
        { "label": "جووڵە", "val": "زۆر نەرم" }
      ]
    },
    "stac-lift-slide": {
      "title": "سیستەمی دەسکی DELTAی ئیسپانی (Lift & Slide)",
      "brand": "STACی ئیسپانی",
      "category": "سلایدینگی پانۆراما بۆ شوشەی گەورە",
      "badge": "ستانداردی UNE-EN 1670",
      "description": "دیزاینی مۆدێرنی کەمینە لەگەڵ دەسکی دەرەکی دابەزێنراو بە قووڵی تەنها ٩.٥ ملم بۆ خلیسکاندنی ئاسانی دەرگای گەورە بە پاراستنی تەواو لە ژەنگ و دزی.",
      "specs": [
        { "label": "قووڵی دەسک", "val": "٩.٥ ملم تەخت" },
        { "label": "بەرگری ژەنگ", "val": "پلەی ٤ UNE-EN" },
        { "label": "ئاسایش", "val": "بەرگی قفڵی مۆدێرن" }
      ]
    }
  },
  "kmr": {
    "wiek-hidden-hinge": {
      "title": "Pergala WIEK ya Menteşeyên Veşartî",
      "brand": "WIEK SYSTEM Belçîka",
      "category": "Pencereyên Mîmarî yên Veşartî",
      "badge": "Menteşeya Veşartî 180°",
      "description": "Menteşeyên bi temamî di nav profîlê de veşartî ji bo avahiyên nûjen ên bi şiyana hilgirtina 130 kg.",
      "specs": [
        { "label": "Giraniya Baskê", "val": "130 kg" },
        { "label": "Sêwirandin", "val": "100% Veşartî" },
        { "label": "Standard", "val": "ISO Certified" }
      ]
    },
    "stac-minimal-handles": {
      "title": "Destikên Mînîmalîst ên STAC",
      "brand": "STAC Spanya",
      "category": "Rêzeya Alumînyûma 6063-T5",
      "badge": "Asta Fezayî",
      "description": "Destikên mîmarî yên bêyî zêdebûna derketinê (0 mm) bi hevrêziya teknolojiya CNC ya herî pêşketî.",
      "specs": [
        { "label": "Materyal", "val": "6063-T5 Alum" },
        { "label": "Derketin", "val": "0 mm Duz" },
        { "label": "Reng", "val": "12 Rengên RAL" }
      ]
    },
    "wiek-bifold": {
      "title": "Pergala Deriyên Qatbûyî ya WIEK (Bi-Fold)",
      "brand": "WIEK SYSTEM Belçîka",
      "category": "Hêmanên Deriyê Qatbûyî",
      "badge": "Rolerên Polayî yên Bêdeng",
      "description": "Pergala herikbar a deriyên qatbûyî bi rolerên pola yên bêdeng û kilîtên ewlehiyê yên pir-xalî.",
      "specs": [
        { "label": "Bask", "val": "100 kg" },
        { "label": "Roler", "val": "Polaya Bêdeng" },
        { "label": "Tevger", "val": "Pir Nerm" }
      ]
    },
    "stac-lift-slide": {
      "title": "Mekanîzmaya Lift & Slide ya STAC",
      "brand": "STAC Spanya",
      "category": "Sûrme yên Panoramîk",
      "badge": "Heta 400 kg",
      "description": "Gearboxên bilindkirin û xişandinê yên giran ji bo paceyên dêw ên heta 400 kg.",
      "specs": [
        { "label": "Giraniya Herî Zêde", "val": "400 kg" },
        { "label": "Îzolasyon", "val": "Polyamide Break" },
        { "label": "Gasket", "val": "Sêqat EPDM" }
      ]
    }
  },
  "tr": {
    "wiek-hidden-hinge": {
      "title": "WIEK Gizli Menteşe Çift Açılım Sistemi",
      "brand": "WIEK SYSTEM Belçika",
      "category": "Gizli Pencere Mimarisi",
      "badge": "180° Gizli Menteşe",
      "description": "Minimalist modern mimari için tasarlanmış 130 kg kanat taşıma kapasiteli ve tam gizli çift açılım pencere donanımı.",
      "specs": [
        { "label": "Kanat Yükü", "val": "130 kg" },
        { "label": "Görünüm", "val": "%100 Gizli" },
        { "label": "Standart", "val": "ISO Onaylı" }
      ]
    },
    "stac-minimal-handles": {
      "title": "STAC Minimalist Ergonomik Kollar",
      "brand": "STAC İspanya",
      "category": "6063-T5 Alüminyum Serisi",
      "badge": "Havacılık Standardı",
      "description": "0 mm çıkıntısız monoblok gövde ve CNC hassas işleme ile profille kusursuz bütünleşen İspanyol tasarım pencere kolları.",
      "specs": [
        { "label": "Malzeme", "val": "6063-T5 Alüminyum" },
        { "label": "Çıkıntı", "val": "0 mm Düz" },
        { "label": "Renkler", "val": "12 RAL Rengi" }
      ]
    },
    "wiek-bifold": {
      "title": "WIEK Katlanır Kapı Donanım Sistemi (Bi-Fold)",
      "brand": "WIEK SYSTEM Belçika",
      "category": "Katlanır Kapı Sistemleri",
      "badge": "Ağır Hizmet Rulman",
      "description": "Paslanmaz çelik sessiz rulmanlı taşıyıcılar ve merkezi çok noktalı emniyet dişlileriyle senkronize katlanır kapı mekanizması.",
      "specs": [
        { "label": "Kanat Başına", "val": "100 kg" },
        { "label": "Tekerlekler", "val": "Sessiz Çelik" },
        { "label": "Kullanım", "val": "Ultra Yumuşak" }
      ]
    },
    "stac-lift-slide": {
      "title": "STAC Ağır Hizmet Hebeschiebe Mekanizması",
      "brand": "STAC İspanya",
      "category": "Anıtsal Sürme Sistemleri",
      "badge": "400 kg'a Kadar",
      "description": "Zeminden tavana kadar anıtsal cam açıklıkları için 400 kg kanat kapasiteli, polyamid termal bariyerli kaldırmalı sürme dişli seti.",
      "specs": [
        { "label": "Maks. Ağırlık", "val": "400 kg / Kanat" },
        { "label": "Isı Bariyeri", "val": "Polyamid" },
        { "label": "Fitil", "val": "Üçlü EPDM" }
      ]
    }
  }
};

const SHOWCASE_PRODUCTS = [
  {
    id: "wiek-hidden-hinge",
    title: "WIEK Concealed Tilt & Turn System",
    brand: "WIEK SYSTEM",
    origin: "Belgium 🇧🇪",
    category: "Concealed Hardware",
    image: "/assets/showcase/wiek_hidden_hinge-04.png",
    fallbackImage: "/assets/catalogs/wiek_page-04.png",
    badge: "180° Hidden Hinge",
    pdfUrl: "/catalogs/wiek-general-catalog-2026.pdf",
    description: "Flush concealed hinge mechanism engineered for modern minimalist architecture with 130 kg sash load capacity and multi-point perimeter security locking.",
    specs: [
      { label: "Sash Load", val: "130 kg" },
      { label: "Structure", val: "100% Concealed" },
      { label: "Standard", val: "ISO Tested" }
    ]
  },
  {
    id: "stac-minimal-handles",
    title: "STAC Minimalist Window Handles & Cremones",
    brand: "STAC Spain",
    origin: "Spain 🇪🇸",
    category: "Monolithic 6063-T5 Series",
    image: "/assets/showcase/stac_window_handles-044.png",
    fallbackImage: "/assets/catalogs/stac_page-004.png",
    badge: "Aerospace 6063-T5",
    pdfUrl: "/catalogs/stac-hardware-accessories.pdf",
    description: "Aerospace-grade aluminum monolithic forming with 0 mm redundant protrusion and CNC precision milling, seamlessly integrating with thermal window profiles.",
    specs: [
      { label: "Material", val: "6063-T5 Aluminum" },
      { label: "Protrusion", val: "0 mm Flush" },
      { label: "Finishes", val: "12 RAL Colors" }
    ]
  },
  {
    id: "wiek-bifold",
    title: "WIEK Heavy-Duty Bi-Folding Door System",
    brand: "WIEK SYSTEM",
    origin: "Belgium 🇧🇪",
    category: "Bi-Folding & Panoramic Hardware",
    image: "/assets/showcase/wiek_bifold_door-34.png",
    fallbackImage: "/assets/catalogs/wiek_page-01.png",
    badge: "Heavy-Duty Tandem",
    pdfUrl: "/catalogs/wiek-general-catalog-2026.pdf",
    description: "Synchronized multi-leaf bi-folding hardware system with stainless steel silent bearing rollers and secure central transmission gearboxes.",
    specs: [
      { label: "Load / Leaf", val: "100 kg" },
      { label: "Bearing", val: "Stainless Steel" },
      { label: "Operation", val: "Feather-Touch" }
    ]
  },
  {
    id: "stac-lift-slide",
    title: "STAC DELTA Minimalist Lift & Slide System",
    brand: "STAC Spain",
    origin: "Spain 🇪🇸",
    category: "Architectural Lift & Slide Series",
    image: "/assets/showcase/stac_lift_slide-108.png",
    fallbackImage: "/assets/showcase/stac_lift_slide-108.png",
    badge: "UNE-EN 1670 Grade 4",
    pdfUrl: "/catalogs/stac-hardware-accessories.pdf",
    description: "Minimalist aerodynamic lines with integrated flush finger pull (9.5 mm depth footprint) engineered for smooth maneuvering of heavy sliding panels with superior anti-burglary security.",
    specs: [
      { label: "Footprint", val: "9.5 mm Flush" },
      { label: "Corrosion", val: ">240 hrs Salt Spray" },
      { label: "Security", val: "Keyhole Cover Plate" }
    ]
  }
];

export const SignatureShowcase: React.FC<SignatureShowcaseProps> = ({
  onSelectProduct,
  onSelectProductByName,
  onGoToProducts
}) => {
  const { currentLanguage } = useLanguage();
  const baseLang = currentLanguage.code.split('-')[0];

  const localizedText =
    SHOWCASE_TEXT_BY_LANG[currentLanguage.code] ||
    SHOWCASE_TEXT_BY_LANG[baseLang] ||
    SHOWCASE_TEXT_BY_LANG.en;

  const currentItemLocales =
    ITEM_LOCALES[currentLanguage.code] ||
    ITEM_LOCALES[baseLang] ||
    ITEM_LOCALES.en;

  const showcaseItems = React.useMemo(() => {
    return SHOWCASE_PRODUCTS.map((prod) => {
      const loc = currentItemLocales[prod.id];
      if (!loc) return prod;
      return {
        ...prod,
        title: loc.title || prod.title,
        brand: loc.brand || prod.brand,
        category: loc.category || prod.category,
        badge: loc.badge || prod.badge,
        description: loc.description || prod.description,
        specs: loc.specs || prod.specs,
        pdfUrl: prod.pdfUrl
      };
    });
  }, [currentItemLocales]);

  // Architecture Systems Slideshow (Managed dynamically via Admin CMS)
  const [dynamicShowcaseItems, setDynamicShowcaseItems] = useState<ArchitectureShowcaseItem[]>(() =>
    loadArchitectureShowcaseItems()
  );

  useEffect(() => {
    return subscribeToArchitectureShowcaseItems((updated) => {
      setDynamicShowcaseItems(updated);
    });
  }, []);

  // Architecture Catalogue Cards (Managed dynamically via Admin CMS)
  const [archCards, setArchCards] = useState<ArchitectureCatalogueCard[]>(() => loadArchitectureCards());

  useEffect(() => {
    return subscribeToArchitectureCards((updated) => {
      setArchCards(updated);
    });
  }, []);

  const isAr = currentLanguage.code === 'ar' || currentLanguage.code.startsWith('ar');
  const isKu = currentLanguage.code === 'ckb' || currentLanguage.code === 'kmr' || currentLanguage.code.startsWith('ku');
  const isTr = currentLanguage.code === 'tr' || currentLanguage.code.startsWith('tr');

  const displayCards = archCards && archCards.length > 0 ? archCards : DEFAULT_CATALOGUE_CARDS;
  const activeShowcaseList = dynamicShowcaseItems && dynamicShowcaseItems.length > 0
    ? dynamicShowcaseItems
    : DEFAULT_ARCHITECTURE_SHOWCASE_ITEMS;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeShowcaseList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeShowcaseList.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeShowcaseList.length]);

  const activeItem = activeShowcaseList[currentIndex] || activeShowcaseList[0];

  const activeTitle = isAr
    ? (activeItem.titleAr || activeItem.title)
    : isKu
    ? (activeItem.titleKu || activeItem.title)
    : activeItem.title;

  const activeDesc = isAr
    ? (activeItem.descriptionAr || activeItem.description)
    : isKu
    ? (activeItem.descriptionKu || activeItem.description)
    : activeItem.description;

  const activeBtnText = isAr
    ? (activeItem.buttonTextAr || '(PDF) فتح الكتالوج المعتمد')
    : isKu
    ? (activeItem.buttonTextKu || '(PDF) کردنەوەی کەتەلۆگ')
    : (activeItem.buttonText || 'Open Technical Catalog (PDF)');

  const handleOpenPdf = (pdfUrl?: string) => {
    const url = pdfUrl || activeItem.pdfUrl || displayCards[0]?.pdfUrl || '/catalogs/wiek-general-catalog-2026.pdf';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-10 sm:py-16 bg-gradient-to-b from-[#f9fafb] via-white to-[#f4f6fa] relative overflow-hidden border-b border-slate-200">
      {/* Background Architectural Accent Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Clean, No Harsh Vertical Lines */}
        <div className="mb-6 sm:mb-8 dh-reveal">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            <bdi dir="auto">{localizedText.title}</bdi>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-1 sm:mt-1.5 max-w-xl">
            <bdi dir="auto">{localizedText.subtitle}</bdi>
          </p>
        </div>

        {/* European Official Catalogues Cards (Dynamic Grid, supports any number of cards with images) */}
        <div className={`grid grid-cols-1 ${displayCards.length === 1 ? 'max-w-md' : displayCards.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4 mb-8`}>
          {displayCards.map((card, idx) => {
            const localizedCardTitle = card.translations?.[currentLanguage.code]?.title || card.translations?.['ar']?.title || card.title;
            const localizedCardDesc = card.translations?.[currentLanguage.code]?.desc || card.translations?.['ar']?.desc || card.desc;
            const localizedBtnText = card.translations?.[currentLanguage.code]?.buttonText || card.translations?.['ar']?.buttonText || card.buttonText || (isAr ? 'فتح الكتالوج' : isKu ? 'کردنەوەی کەتەلۆگ' : 'Open Catalog');

            return (
              <div
                key={card.id || idx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-red-400 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Card Feature Image (if available) */}
                  {card.image && (
                    <div className="aspect-video w-full rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-3">
                      <img
                        src={card.image}
                        alt={localizedCardTitle}
                        className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Brand Logo Header */}
                  {card.logo && (
                    <div className="h-7 flex items-center">
                      <img
                        src={card.logo}
                        alt={card.company || card.brand || 'Partner Logo'}
                        className="max-h-6 sm:max-h-7 max-w-[120px] w-auto object-contain"
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-red-600 transition-colors leading-snug">
                      <bdi dir="auto">{localizedCardTitle}</bdi>
                    </h3>
                    <p className="text-xs text-slate-600 font-normal leading-relaxed mt-1 line-clamp-2">
                      <bdi dir="auto">{localizedCardDesc}</bdi>
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  {card.pdfUrl ? (
                    <a
                      href={card.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{localizedBtnText}</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Technical Profile</span>
                  )}
                  <span className="text-xs text-slate-500 font-medium truncate max-w-[140px]">
                    {card.company || card.brand}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean Interactive Architecture Card (Auto-slides every 4 seconds) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* 1. Large Image Stage */}
            <div className="lg:col-span-6 relative bg-slate-50 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] h-full w-full p-6 sm:p-10">
              <img
                key={activeItem.id || currentIndex}
                src={activeItem.image}
                alt={activeTitle}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = activeItem.fallbackImage || '/assets/catalogs/wiek_page_50_limiting_hinge.png';
                }}
                className="max-h-full max-w-full object-contain animate-in fade-in zoom-in-95 duration-500 cursor-pointer drop-shadow-sm"
                onClick={() => handleOpenPdf(activeItem.pdfUrl)}
              />

              {/* Clean Slide Indicators (No Ugly Arrows) */}
              <div className="absolute bottom-4 end-4 flex items-center gap-2 z-10">
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
                  {activeShowcaseList.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentIndex(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        dotIdx === currentIndex
                          ? 'w-5 h-1.5 bg-red-500'
                          : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/90'
                      }`}
                    />
                  ))}
                  <span className="text-[10px] font-mono font-bold text-white/90 ms-1">
                    {currentIndex + 1}/{activeShowcaseList.length}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Details: Title, Description & Technical PDF Button */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[300px] lg:min-h-[440px] h-auto text-start">
              <div className="space-y-4 my-auto">
                <h3
                  onClick={() => handleOpenPdf(activeItem.pdfUrl)}
                  className="text-2xl sm:text-3xl font-black text-slate-900 hover:text-red-600 transition-colors cursor-pointer leading-tight"
                >
                  <bdi dir="auto">{activeTitle}</bdi>
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                  <bdi dir="auto">{activeDesc}</bdi>
                </p>
              </div>

              {/* Action Button: Technical PDF */}
              <div className="pt-6 border-t border-slate-100 mt-6 lg:mt-0">
                <button
                  type="button"
                  onClick={() => handleOpenPdf(activeItem.pdfUrl)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-red-600/20 transition-all cursor-pointer hover:shadow-lg active:scale-98"
                >
                  <FileText className="w-4 h-4" />
                  <span>
                    <bdi dir="auto">
                      {activeBtnText}
                    </bdi>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignatureShowcase;
