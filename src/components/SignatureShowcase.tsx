import React from 'react';
import CardSwap, { Card } from './CardSwap';
import { ArrowRight, Download, ExternalLink, FileText, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { ProductItem } from '../data/winhomeData';
import { useLanguage } from '../context/LanguageContext';
import { loadLocalProducts } from '../services/productService';

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
  const { currentLanguage, isRtl } = useLanguage();
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
        specs: loc.specs || prod.specs
      };
    });
  }, [currentItemLocales]);

  const handleSelectProduct = (title: string, id: string) => {
    if (onSelectProductByName) {
      onSelectProductByName(title);
      return;
    }
    const products = loadLocalProducts();
    const found = products.find((p) => p.id === id || p.name.toLowerCase().includes(title.toLowerCase()));
    if (found && onSelectProduct) {
      onSelectProduct(found);
    } else if (onGoToProducts) {
      onGoToProducts('accessories');
    }
  };

  // Translations for the 2 Catalog Cards
  const isAr = currentLanguage.code === 'ar';
  const isKu = currentLanguage.code === 'ckb' || currentLanguage.code === 'kmr';
  const isTr = currentLanguage.code === 'tr';

  const cat1 = {
    badge: isAr ? 'بلجيكا • معتمد ISO' : isKu ? 'بەلجیکا • باوەڕپێکراوی ISO' : isTr ? 'BELÇİKA • ISO ONAYLI' : 'BELGIUM • ISO CERTIFIED',
    flag: '🇧🇪',
    title: isAr ? 'كتالوج شركة WIEK بلجيكا — حلول 2026' : isKu ? 'کەتەلۆگی فەرمی WIEKی بەلجیکی — ٢٠٢٦' : isTr ? 'WIEK SYSTEM Belçika — 2026 Çözümleri' : 'WIEK SYSTEM Belgium — 2026 Solutions',
    subtitle: isAr ? 'حيث تلتقي الوظيفة بالابتكار المعماري • إكسسوارات الأبواب والنوافذ' : isKu ? 'شوێنی یەکگرتنی کارامەیی و داهێنان • ئێکسسواراتی دەرگا و پەنجەرە' : isTr ? 'İnovasyon ve Fonksiyonelliğin Buluştuğu Nokta • Kapı ve Pencere Donanımları' : 'Where Function Meets Innovation • Door & Window Hardware Solutions',
    desc: isAr
      ? 'كتالوج شامل لأحدث أنظمة المفصلات المخفية (Tilt & Turn)، وآليات الأبواب القابلة للطي (Bi-Fold)، والتروس المركزية المصممة في بلجيكا بأعلى المعايير الأوروبية.'
      : isKu
      ? 'کەتەلۆگی گشتگیر بۆ نوێترین سیستەمی نەرمەلۆی شاردراوە، دەرگای ئەکۆردیۆن و گێڕبۆکسی پارێزراو کە لە بەلجیکا دیزاین کراون بە بەرزترین ستاندارد.'
      : isTr
      ? 'Belçika mühendisliğiyle üretilen gizli menteşeli çift açılım, katlanır kapı mekanizmaları ve emniyet kilit sistemlerini içeren 88 sayfalık resmi 2026 kataloğu.'
      : 'Comprehensive 88-page technical guide featuring Belgium-engineered hidden hinge systems, synchronized bi-folding patio gearboxes, and ISO-tested hardware.',
    pdfUrl: '/catalogs/wiek-general-catalog-2026.pdf',
    fileName: 'WIEK-General-Catalog-2026.pdf',
    size: '65 MB'
  };

  const cat2 = {
    badge: isAr ? 'إسبانيا • معتمد EN-13830' : isKu ? 'ئیسپانیا • باوەڕپێکراوی EN' : isTr ? 'İSPANYA • EN-13830 ONAYLI' : 'SPAIN • EN-13830 CERTIFIED',
    flag: '🇪🇸',
    title: isAr ? 'كتالوج شركة STAC إسبانيا العام للإكسسوارات' : isKu ? 'کەتەلۆگی گشتی STACی ئیسپانی بۆ ئێکسسوارات' : isTr ? 'STAC İspanya Genel Donanım ve Aksesuar Kataloğu' : 'STAC Spain General Hardware & Accessories Catalogue',
    subtitle: isAr ? 'المرجع الهندسي الشامل — 442 صفحة من الأنظمة المعمارية الفاخرة' : isKu ? 'سەرچاوەی ئەندازیاری گشتگیر — ٤٤٢ پەڕە لە سیستەمی تەلارسازی' : isTr ? 'Kapsamlı Mimari Teknik Referans — 442 Sayfa Sistem Rehberi' : 'Comprehensive Architectural Engineering Reference — 442 Pages',
    desc: isAr
      ? 'الدليل التقني الشامل لمنتجات STAC الإسبانية: مقابض المينيماليست بدون بروز، تروس الرفع والسحب العملاقة حتى 400 كغم، والمفصلات المقاومة للتآكل بالدرجة الخامسة EN-1670.'
      : isKu
      ? 'ڕێبەری تەکنیکی فەرمی STACی ئیسپانیا: دەسکی مۆدێرنی بێ بەرزایی، سیستەمی لیفت و سلایدینگ بۆ شوشەی تا ٤٠٠ کگم، و ئێکسسواراتی دژە ژەنگ بە پلەی پێنجەمی EN-1670.'
      : isTr
      ? 'İspanya menşeili STAC ürünlerinin 442 sayfalık tam teknik kataloğu: 0 mm çıkıntısız kollar, 400 kg kapasiteli hebe-schiebe donanımları ve Grade 5 korozyon dayanımlı parçalar.'
      : 'The definitive 442-page technical catalog from STAC Spain: flush minimalist cremones (0 mm protrusion), monumental lift & slide mechanisms up to 400 kg, and Grade 5 anti-corrosion components.',
    pdfUrl: '/catalogs/stac-hardware-accessories.pdf',
    fileName: 'STAC-Hardware-Accessories-Catalogue.pdf',
    size: '140 MB'
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#f9fafb] via-white to-[#f4f6fa] relative overflow-hidden border-b border-slate-200">
      {/* Background Architectural Accent Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: 2 Dedicated European Catalog Presentation Cards */}
          <div className="col-span-1 lg:col-span-6 space-y-6">
            <div className="border-s-4 border-red-600 ps-4 dh-reveal">
              <span className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <bdi dir="auto">{isAr ? 'الكتالوجات الأوروبية الفنية المعتمدة' : isKu ? 'کەتەلۆگی فەرمی و باوەڕپێکراوی ئەوروپا' : 'CERTIFIED EUROPEAN TECHNICAL CATALOGUES'}</bdi>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                <bdi dir="auto">{localizedText.title}</bdi>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-2.5 max-w-xl">
                <bdi dir="auto">{localizedText.subtitle}</bdi>
              </p>
            </div>

            {/* Catalog Card 1: WIEK SYSTEM Belgium */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-red-300 transition-all space-y-3.5 relative overflow-hidden group">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{cat1.flag}</span>
                  <span className="text-[11px] font-extrabold text-red-700 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {cat1.badge}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">PDF • {cat1.size}</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-red-600 transition-colors">
                  <bdi dir="auto">{cat1.title}</bdi>
                </h3>
                <p className="text-xs font-bold text-red-600 mt-0.5">
                  <bdi dir="auto">{cat1.subtitle}</bdi>
                </p>
                <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2">
                  <bdi dir="auto">{cat1.desc}</bdi>
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-slate-100">
                <a
                  href={cat1.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{localizedText.specsBtn}</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                <a
                  href={cat1.pdfUrl}
                  download={cat1.fileName}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>{localizedText.estimateBtn}</span>
                </a>
              </div>
            </div>

            {/* Catalog Card 2: STAC Spain */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-red-300 transition-all space-y-3.5 relative overflow-hidden group">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{cat2.flag}</span>
                  <span className="text-[11px] font-extrabold text-red-700 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {cat2.badge}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">PDF • {cat2.size}</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-red-600 transition-colors">
                  <bdi dir="auto">{cat2.title}</bdi>
                </h3>
                <p className="text-xs font-bold text-red-600 mt-0.5">
                  <bdi dir="auto">{cat2.subtitle}</bdi>
                </p>
                <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2">
                  <bdi dir="auto">{cat2.desc}</bdi>
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-slate-100">
                <a
                  href={cat2.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{localizedText.specsBtn}</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                <a
                  href={cat2.pdfUrl}
                  download={cat2.fileName}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>{localizedText.estimateBtn}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive CardDeck with Systems from the Catalogs */}
          <div className="col-span-1 lg:col-span-6 flex justify-center lg:justify-end items-start pt-4 lg:pt-0">
            <div className="relative w-full max-w-[400px] h-[480px] flex items-center justify-center lg:justify-end">
              <CardSwap
                width={380}
                height={450}
                cardDistance={26}
                verticalDistance={20}
                delay={4500}
                pauseOnHover={true}
              >
                {showcaseItems.map((item) => (
                  <Card
                    key={item.id}
                    className="p-5 sm:p-6 flex flex-col justify-between bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden cursor-pointer group"
                    onClick={() => handleSelectProduct(item.title, item.id)}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
                        <span className="text-[10px] font-black text-red-700 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          <bdi dir="auto">{item.brand}</bdi>
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          <bdi dir="auto">{item.category}</bdi>
                        </span>
                      </div>

                      <div className="relative h-48 w-full bg-slate-50 rounded-2xl overflow-hidden mb-3 p-3 flex items-center justify-center border border-slate-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = item.fallbackImage;
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-slate-900/90 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                          <bdi dir="auto">{item.badge}</bdi>
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors leading-snug">
                        <bdi dir="auto">{item.title}</bdi>
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                        <bdi dir="auto">{item.description}</bdi>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <div className="grid grid-cols-3 gap-1.5 text-center text-xs mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        {item.specs.map((spec, i) => (
                          <div key={i} className="min-w-0">
                            <span className="text-[9px] text-slate-400 block font-bold uppercase truncate">{spec.label}</span>
                            <span className="font-black text-slate-800 text-[11px] truncate block mt-0.5">{spec.val}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-red-600 font-extrabold group-hover:translate-x-1 transition-transform">
                        <span>{localizedText.inspectHint}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SignatureShowcase;
