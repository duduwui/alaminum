import React from 'react';
import CardSwap, { Card } from './CardSwap';
import { ArrowRight } from 'lucide-react';
import { ProductItem, UPVC_PRODUCTS, ALUMINUM_PRODUCTS } from '../data/winhomeData';
import { useLanguage } from '../context/LanguageContext';
import { loadLocalProducts } from '../services/productService';

interface SignatureShowcaseProps {
  onSelectProduct?: (product: ProductItem) => void;
  onSelectProductByName?: (name: string) => void;
  onOpenQuote?: (productName: string) => void;
  onOpenQuoteModal?: (productName?: string) => void;
  onGoToProducts?: (category?: string) => void;
}

export const SHOWCASE_TEXT_BY_LANG: Record<string, { title: string; subtitle: string; estimateBtn: string; specsBtn: string; inspectHint: string }> = {
  "en": {
    "title": "5 Architectural Window & Door Systems Built for Extreme Climates",
    "subtitle": "Explore our top European window and door systems. From passive-certified uPVC with 6 thermal chambers to monumental lift & slide aluminum.",
    "estimateBtn": "Estimate Cost",
    "specsBtn": "Full Specs",
    "inspectHint": "Click card to inspect system"
  },
  "en-GB": {
    "title": "5 Architectural Window & Door Systems Built for Extreme Climates",
    "subtitle": "Explore our top European window and door systems. From passive-certified uPVC with 6 thermal chambers to monumental lift & slide aluminum.",
    "estimateBtn": "Estimate Cost",
    "specsBtn": "Full Specs",
    "inspectHint": "Click card to inspect system"
  },
  "en-US": {
    "title": "5 Architectural Window & Door Systems Built for Extreme Climates",
    "subtitle": "Explore our top European window and door systems. From passive-certified uPVC with 6 thermal chambers to monumental lift & slide aluminum.",
    "estimateBtn": "Estimate Cost",
    "specsBtn": "Full Specs",
    "inspectHint": "Click card to inspect system"
  },
  "ar": {
    "title": "5 أنظمة معمارية للأبواب والنوافذ مصممة للمناخ القاسي",
    "subtitle": "استكشف أفضل أنظمة الأبواب والنوافذ الأوروبية المصنعة في مصنعنا، من قطاعات uPVC العازلة بـ 6 غرف إلى أنظمة السحب البانورامية الفاخرة.",
    "estimateBtn": "تقدير التكلفة",
    "specsBtn": "المواصفات الكاملة",
    "inspectHint": "اضغط لمعاينة تفاصيل النظام"
  },
  "ckb": {
    "title": "٥ سیستەمی ئەندازیاری پەنجەرە و دەرگا بۆ کەشوهەوای توند",
    "subtitle": "باشترین سیستەمەکانی پەنجەرە و دەرگای ئەوروپی لە کارگەکەمان بپشکنە، لە uPVCی عەزلی ٦-خانەیی بۆ ئەلۆمنیۆمی سلایدینگی پانۆراما.",
    "estimateBtn": "خەمڵاندنی تێچوو",
    "specsBtn": "زانیاری تەواو",
    "inspectHint": "کلیک بکە بۆ بینینی وردەکاری سیستەمەکە"
  },
  "kmr": {
    "title": "5 Pergalên Endezyarî yên Derî û Pencereyan",
    "subtitle": "Pergalên herî pêşketî yên ewropî yên li fabrîqeya me hatine çêkirin bibîne.",
    "estimateBtn": "Bihayê Bibîne",
    "specsBtn": "Agahiyên Tevahî",
    "inspectHint": "Ji bo hûrguliyan bitikîne"
  },
  "tr": {
    "title": "Aşırı İklimler İçin Üretilmiş 5 Mimari Pencere ve Kapı Sistemi",
    "subtitle": "Avrupa standartlarında üretilen pencere ve kapı sistemlerimizi keşfedin. 6 odacıklı uPVC sistemlerinden panoramik alüminyum sürme sistemlerine kadar.",
    "estimateBtn": "Fiyat Teklifi Al",
    "specsBtn": "Tüm Özellikler",
    "inspectHint": "İncelemek için karta tıklayın"
  },
  "de": {
    "title": "5 Architektonische Fenster- und Türsysteme für Extremklima",
    "subtitle": "Entdecken Sie unsere europäischen Fenster- und Türsysteme – von hochgedämmtem 6-Kammer-uPVC bis hin zu monumentalen Hebeschiebe-Aluminiumsystemen.",
    "estimateBtn": "Kostenvoranschlag",
    "specsBtn": "Vollständige Daten",
    "inspectHint": "Klicken zum Erkunden"
  },
  "fr": {
    "title": "5 Systèmes Architecturaux de Portes et Fenêtres pour Climats Extrêmes",
    "subtitle": "Découvrez nos systèmes européens d'exception : du PVC 6 chambres certifié maison passive aux monumentales baies coulissantes en aluminium.",
    "estimateBtn": "Estimer le Coût",
    "specsBtn": "Spécifications",
    "inspectHint": "Cliquez pour examiner le système"
  },
  "it": {
    "title": "5 Sistemi Architettonici di Porte e Finestre per Climi Estremi",
    "subtitle": "Esplora i nostri migliori sistemi europei per porte e finestre: dal PVC certificato casa passiva a 6 camere termiche all'alluminio scorrevole alzante monumentale.",
    "estimateBtn": "Preventivo di Costo",
    "specsBtn": "Specifiche Complete",
    "inspectHint": "Clicca sulla scheda per esaminare il sistema"
  },
  "es": {
    "title": "5 Sistemas Arquitectónicos de Puertas y Ventanas para Climas Extremos",
    "subtitle": "Explore nuestros mejores sistemas europeos: desde PVC certificado casa pasiva con 6 cámaras hasta monumentales correderas elevables de aluminio.",
    "estimateBtn": "Calcular Coste",
    "specsBtn": "Especificaciones",
    "inspectHint": "Haga clic para examinar el sistema"
  },
  "es-MX": {
    "title": "5 Sistemas Arquitectónicos de Puertas y Ventanas para Climas Extremos",
    "subtitle": "Explore nuestros mejores sistemas europeos: desde PVC certificado casa pasiva con 6 cámaras hasta monumentales canceles corredizos de aluminio.",
    "estimateBtn": "Calcular Costo",
    "specsBtn": "Especificaciones",
    "inspectHint": "Haga clic para examinar el sistema"
  },
  "pt": {
    "title": "5 Sistemas Arquitetónicos de Portas e Janelas para Climas Extremos",
    "subtitle": "Explore os nossos melhores sistemas europeus: desde o PVC certificado passivhaus de 6 câmaras até ao alumínio elevador de correr monumental.",
    "estimateBtn": "Orçamento Rápido",
    "specsBtn": "Especificações",
    "inspectHint": "Clique no cartão para inspecionar"
  },
  "pt-BR": {
    "title": "5 Sistemas Arquitetônicos de Portas e Janelas para Climas Extremos",
    "subtitle": "Conheça nossos sistemas europeus de alta performance: de esquadrias de PVC passivhaus de 6 câmaras a sistemas monumentais de correr em alumínio.",
    "estimateBtn": "Calcular Custo",
    "specsBtn": "Especificações",
    "inspectHint": "Clique no cartão para inspecionar"
  },
  "fa": {
    "title": "۵ سیستم مهندسی درب و پنجره برای شرایط اقلیمی سخت",
    "subtitle": "برترین سیستم‌های درب و پنجره اروپایی ما را بررسی کنید؛ از uPVC شش‌کاناله عایق حرارتی تا سیستم‌های آلومینیومی اسلایدینگ عظیم.",
    "estimateBtn": "برآورد هزینه",
    "specsBtn": "مشخصات کامل",
    "inspectHint": "جهت مشاهده جزئیات کلیک کنید"
  },
  "ru": {
    "title": "5 архитектурных оконных и дверных систем для экстремального климата",
    "subtitle": "Изучите наши ведущие европейские системы: от 6-камерного энергоэффективного ПВХ до монументальных подъемно-сдвижных алюминиевых конструкций.",
    "estimateBtn": "Рассчитать стоимость",
    "specsBtn": "Характеристики",
    "inspectHint": "Нажмите для подробностей"
  },
  "zh-CN": {
    "title": "专为严苛气候设计的5大顶级建筑门窗系统",
    "subtitle": "探索我们制造的欧洲顶级门窗系统：从6腔体被动房级uPVC到极简全景重型提升推拉铝合金系统。",
    "estimateBtn": "估算工程预算",
    "specsBtn": "系统完整参数",
    "inspectHint": "点击卡片查看系统详情"
  },
  "nl": {
    "title": "5 Architectonische Kozijnsystemen voor Extreme Klimaten",
    "subtitle": "Ontdek onze hoogwaardige Europese systemen: van 6-kamer passiefhuis uPVC tot monumentale hefschuifsystemen in aluminium.",
    "estimateBtn": "Kosten schatten",
    "specsBtn": "Volledige specificaties",
    "inspectHint": "Klik op de kaart voor details"
  },
  "pl": {
    "title": "5 Architektonicznych Systemów Okien i Drzwi dla Klimatów Ekstremalnych",
    "subtitle": "Poznaj nasze najlepsze europejskie systemy: od 6-komorowego uPVC z certyfikatem domu pasywnego po monumentalne aluminiowe drzwi podnoszono-przesuwne.",
    "estimateBtn": "Wyceń projekt",
    "specsBtn": "Specyfikacja techniczna",
    "inspectHint": "Kliknij kartę, aby zobaczyć szczegóły"
  },
  "ro": {
    "title": "5 Sisteme Arhitecturale de Uși și Ferestre pentru Climat Extrem",
    "subtitle": "Descoperiți sistemele noastre europene de top: de la uPVC cu 6 camere certificat pentru case pasive până la sisteme monumentale culisante din aluminiu.",
    "estimateBtn": "Estimează Costul",
    "specsBtn": "Specificații Complete",
    "inspectHint": "Apasă cardul pentru detalii"
  },
  "el": {
    "title": "5 Αρχιτεκτονικά Συστήματα Κουφωμάτων για Ακραίες Κλιματικές Συνθήκες",
    "subtitle": "Ανακαλύψτε κορυφαία ευρωπαϊκά συστήματα: από 6-θαλαμικό uPVC παθητικού κτιρίου έως μνημειώδη συρόμενα αλουμινίου.",
    "estimateBtn": "Εκτίμηση Κόστους",
    "specsBtn": "Πλήρη Στοιχεία",
    "inspectHint": "Κάντε κλικ στην κάρτα"
  },
  "sv": {
    "title": "5 Arkitektoniska Fönster- och Dörrsystem för Extremklimat",
    "subtitle": "Upptäck våra ledande europeiska fönster- och dörrsystem från passivhus-certifierad uPVC till monumentala lyftskjutpartier i aluminium.",
    "estimateBtn": "Beräkna kostnad",
    "specsBtn": "Fullständiga specifikationer",
    "inspectHint": "Klicka på kortet för detaljer"
  },
  "hi": {
    "title": "अत्यधिक जलवायु के लिए निर्मित 5 वास्तुशिल्प खिड़की और दरवाजा प्रणाली",
    "subtitle": "हमारी शीर्ष यूरोपीय खिड़की और दरवाजा प्रणालियों का अन्वेषण करें।",
    "estimateBtn": "लागत अनुमान",
    "specsBtn": "पूर्ण विवरण",
    "inspectHint": "सिस्टम देखने के लिए क्लिक करें"
  },
  "ja": {
    "title": "過酷な気候に対応する5大建築用窓・ドアシステム",
    "subtitle": "パッシブハウス認定の6チャンバーuPVCから大型リフト＆スライドアルミシステムまで、欧州基準の窓とドアをご覧ください。",
    "estimateBtn": "費用見積り",
    "specsBtn": "仕様詳細",
    "inspectHint": "カードをクリックして詳細を表示"
  },
  "ko": {
    "title": "극한 기후를 위해 설계된 5대 프리미엄 창호 시스템",
    "subtitle": "6챔버 패시브하우스 인증 uPVC부터 초대형 알루미늄 리프트 슬라이딩까지 유럽 정밀 엔지니어링 창호를 만나보세요.",
    "estimateBtn": "예상 견적 산출",
    "specsBtn": "전체 사양 확인",
    "inspectHint": "시스템 세부정보를 보려면 카드 클릭"
  },
  "kk": {
    "title": "Төтенше климатқа арналған 5 сәулеттік терезе мен есік жүйесі",
    "subtitle": "Пассивті үй стандартындағы 6 камералы uPVC-ден монументалды жылжымалы алюминийге дейінгі еуропалық жүйелерді тамашалаңыз.",
    "estimateBtn": "Бағасын бағалау",
    "specsBtn": "Толық сипаттама",
    "inspectHint": "Мәліметті көру үшін басыңыз"
  },
  "sr": {
    "title": "5 архитектонских система прозора и врата за екстремне климе",
    "subtitle": "Истражите наше врхунске европске системе од 6-коморног uPVC-а до монументалних подизно-клизних алуминијумских портала.",
    "estimateBtn": "Процена трошкова",
    "specsBtn": "Комплетне спецификације",
    "inspectHint": "Кликните за преглед система"
  },
  "hr": {
    "title": "5 arhitektonskih sustava prozora i vrata za ekstremne klime",
    "subtitle": "Istražite naše vrhunske europske sustave od 6-komornog uPVC-a do monumentalnih podizno-kliznih aluminijskih stijena.",
    "estimateBtn": "Procjena troškova",
    "specsBtn": "Potpune specifikacije",
    "inspectHint": "Kliknite za pregled sustava"
  },
  "bs": {
    "title": "5 arhitektonskih sistema prozora i vrata za ekstremne klime",
    "subtitle": "Istražite naše vrhunske evropske sisteme od 6-komornog uPVC-a do monumentalnih podizno-kliznih aluminijskih sistema.",
    "estimateBtn": "Procjena troškova",
    "specsBtn": "Potpune specifikacije",
    "inspectHint": "Kliknite za pregled sistema"
  },
  "sq": {
    "title": "5 Sisteme Arkitekturore të Dritareve dhe Dyerve për Klimë Ekstreme",
    "subtitle": "Eksploroni sistemet tona evropiane të dritareve dhe dyerve: nga uPVC me 6 dhoma për shtëpi pasive deri te sistemet rrëshqitëse të aluminit.",
    "estimateBtn": "Llogarit Koston",
    "specsBtn": "Specifikimet",
    "inspectHint": "Kliko për të parë sistemin"
  },
  "bg": {
    "title": "5 архитектурни системи за прозорци и врати за екстремен климат",
    "subtitle": "Разгледайте нашите първокласни европейски системи от 6-камерен пасивен uPVC до монументални плъзгащи алуминиеви портали.",
    "estimateBtn": "Изчислете цена",
    "specsBtn": "Пълни параметри",
    "inspectHint": "Кликнете за преглед"
  }
};

interface LocalizedItem {
  title?: string;
  brand?: string;
  category: string;
  badge: string;
  description: string;
  specs: { label: string; val: string }[];
}

export const ITEM_LOCALES: Record<string, Record<string, LocalizedItem>> = {
  "ckb": {
    "legend-80": {
      "title": "دیکۆنینک لێجەند ٨٠",
      "brand": "دیکۆنینکی بەلجیکی",
      "category": "پەنجەرە و دەرگای uPVC ی عەزل",
      "badge": "ستانداردی خانەی پاسیڤ",
      "description": "سیستەمی پێشەنگی ئەوروپی uPVC بە ٦ خانەی عەزلی گەرمی بۆ بەرگەگرتنی گەرمای سەروی ٥٠ پلە.",
      "specs": [
        {
          "label": "قووڵی پرۆفایل",
          "val": "80 mm"
        },
        {
          "label": "پێکهاتە",
          "val": "٦ خانەی عەزل"
        },
        {
          "label": "عەزلی گەرمی",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "لۆرێنزۆلاین 70LS مۆنومێنتال",
      "brand": "سیستەمەکانی لۆرێنزۆ",
      "category": "ئەلۆمنیۆمی سلایدینگی عەزلی گەرمی",
      "badge": "شوشەبەندی پانۆراما",
      "description": "سیستەمی سلایدینگی تەلارسازی بۆ شوشەی گەورەی سەر زەوی تا بنمیچ تا بەرزی ٣ مەتر بە جوڵەیەکی زۆر نەرم و ئاسان.",
      "specs": [
        {
          "label": "قووڵی باڵ",
          "val": "70 mm"
        },
        {
          "label": "قورسایی باڵ",
          "val": "٣٠٠ کگم"
        },
        {
          "label": "بەربەستی پۆلیەماید",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "کێرتن وۆڵ 50F بۆ باڵەخانە",
      "brand": "ئەلۆمنیۆمی تەلارسازی",
      "category": "سیستەمی ڕووکاری کێرتن وۆڵ",
      "badge": "بڕوانامەی EN-13830",
      "description": "سیستەمی ڕووکاری شوشەیی بۆ تاوەرە بازرگانییەکان، پێشانگای ئۆتۆمبێل و ڤێلا مۆدێرنەکان لە سەرانسەری عێراق.",
      "specs": [
        {
          "label": "پانی پرۆفایل",
          "val": "50 mm"
        },
        {
          "label": "پێکهاتە",
          "val": "ستوونی مولیۆن"
        },
        {
          "label": "جۆری شوشە",
          "val": "دوو قاتی ئەندازیاری"
        }
      ]
    },
    "hs76-sliding": {
      "title": "سیستەمی هێبێ-شیبێ HS76",
      "brand": "دیکۆنینک / وینسا",
      "category": "سلایدینگی بەهێزی uPVC",
      "badge": "پۆلی ٤ دژە-ڕەشەبا",
      "description": "ئەندازیاری سلایدینگی قورس و تۆکمە بۆ پاراستن و ڕێگری تەواو لە تۆزوخۆڵ و ڕەشەبای بیابان.",
      "specs": [
        {
          "label": "قووڵی چوارچێوە",
          "val": "175 mm"
        },
        {
          "label": "پتەوکەر",
          "val": "شیشی ستیل"
        },
        {
          "label": "عەزلی با",
          "val": "لاستیکی EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "وینسا دۆرادۆ ٧٦ عەزلی دەنگ",
      "brand": "پەنجەرە و دەرگای وینسا",
      "category": "uPVCی عەزلی دەنگی پۆلی A",
      "badge": "بێدەنگی ٤٤ دیبی",
      "description": "پرۆفایلی ئەستووری پۆلی A بە ٥ خانەی ناوەکی بۆ دابڕینی ژاوەژاو و دەنگەدەنگی زۆری شەقام و شاری قەرەباڵغ.",
      "specs": [
        {
          "label": "قووڵی پرۆفایل",
          "val": "76 mm"
        },
        {
          "label": "خانەی عەزل",
          "val": "٥ خانە"
        },
        {
          "label": "عەزلی دەنگ",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "kmr": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belçîka",
      "category": "Pencere û Deriyên uPVC yên Îzolekirî",
      "badge": "Standarda Xaniyê Pasîf",
      "description": "Rêze-berhema sereke ya uPVC a ewropî bi 6 odeyên germiyê ji bo germahiya 50°C+.",
      "specs": [
        {
          "label": "Kûrahiya Profilê",
          "val": "80 mm"
        },
        {
          "label": "Avahî",
          "val": "6 Ode"
        },
        {
          "label": "Îzolasyon",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Sîstemên Lorenzo",
      "category": "Alumînyûma Xilskî ya Germî",
      "badge": "Camên Panoramîk",
      "description": "Pergala xilskî ya mîmarî ji bo camên mezin ên heta 3 metreyan bi şemitînek pir hêsan.",
      "specs": [
        {
          "label": "Kûrahiya Baskê",
          "val": "70 mm"
        },
        {
          "label": "Barkirina Herî Zêde",
          "val": "300 kg"
        },
        {
          "label": "Bendê Polîamîd",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Façade 50F Dîwarê Camî",
      "brand": "Alumînyûma Mîmarî",
      "category": "Pergala Dîwarê Camî yê Bazirganî",
      "badge": "Bawernameya EN-13830",
      "description": "Pergala rûyê camî ya avahiyan ji bo bircên bazirganî û vîlayên nûjen li seranserê Iraqê.",
      "specs": [
        {
          "label": "Pêşiya Dîtinê",
          "val": "50 mm"
        },
        {
          "label": "Avahî",
          "val": "Torra Mulyonê"
        },
        {
          "label": "Cama Avahîsaziyê",
          "val": "Cama Ducarî"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Hebe-Schiebe HS76",
      "brand": "Deceuninck / Winsa",
      "category": "uPVC ya Xilskî ya Hêzdar",
      "badge": "Pola 4 a li dijî Bayê",
      "description": "Endezyariya xilskî ya giran ji bo ragirtina hewayê li hember bayê çolê û bahozên tozê.",
      "specs": [
        {
          "label": "Kûrahiya Çarçoveyê",
          "val": "175 mm"
        },
        {
          "label": "Hêzkirin",
          "val": "Dilekî Polayî"
        },
        {
          "label": "Morkirina Bayê",
          "val": "EPDM a Pirqat"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Akustîk",
      "brand": "Winsa Derî û Pencere",
      "category": "uPVC ya Bêdeng a Pola A",
      "badge": "Îzolasyona Dengê 44 dB",
      "description": "Profila akustîk a stûr a Pola A bi 5 odeyên hundirîn ji bo bêdengkirina dengê trafîk û bajêr.",
      "specs": [
        {
          "label": "Kûrahiya Profilê",
          "val": "76 mm"
        },
        {
          "label": "Odeyên Akustîk",
          "val": "5 Ode"
        },
        {
          "label": "Asta Dengê",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "ar": {
    "legend-80": {
      "title": "ديكونينك ليجند 80",
      "brand": "ديكونينك بلجيكا",
      "category": "أبواب ونوافذ uPVC فائقة العزل",
      "badge": "معيار المنزل السلبي",
      "description": "نظام uPVC أوروبي رائد مصمم بـ 6 حجرات عزل لمقاومة درجات حرارة الصيف التي تتجاوز 50 درجة مئوية.",
      "specs": [
        {
          "label": "عمق القطاع",
          "val": "80 مم"
        },
        {
          "label": "البنية الداخلية",
          "val": "6 حجرات عزل"
        },
        {
          "label": "العزل الحراري",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "لورنزولاين 70LS الترا مونومنتال",
      "brand": "أنظمة لورنزو",
      "category": "ألمنيوم سحاب عازل حرارياً",
      "badge": "واجهات زجاجية بانورامية",
      "description": "نظام سحب معماري للفتحات الزجاجية العملاقة الممتدة من الأرض إلى السقف بارتفاع يصل إلى 3 أمتار بحركة سلسة وفائقة النعومة.",
      "specs": [
        {
          "label": "عمق الضلفة",
          "val": "70 مم"
        },
        {
          "label": "حمولة الدرفة",
          "val": "300 كجم"
        },
        {
          "label": "عازل بولي أميد",
          "val": "24 مم"
        }
      ]
    },
    "curtain-50f": {
      "title": "واجهات كيرتن وول 50F الإنشائية",
      "brand": "ألمنيوم معماري",
      "category": "نظام واجهات ستائرية للمشاريع",
      "badge": "معتمد بموجب EN-13830",
      "description": "نظام واجهات زجاجية هندسية مصمم للأبراج التجارية ومعارض السيارات الفاخرة والفلل العصرية في جميع أنحاء العراق.",
      "specs": [
        {
          "label": "العرض المرئي",
          "val": "50 مم"
        },
        {
          "label": "الهيكل الداخلي",
          "val": "شبكة مقاطع ألمنيوم"
        },
        {
          "label": "نوع الزجاج",
          "val": "زجاج مزدوج هندسي"
        }
      ]
    },
    "hs76-sliding": {
      "title": "نظام هيبي شيبى HS76",
      "brand": "ديكونينك / وينسا",
      "category": "سحاب uPVC للأوزان الثقيلة",
      "badge": "فئة 4 لمقاومة الرياح",
      "description": "هندسة سحب ورفع فائقة التحمل توفر إغلاقاً محكماً يمنع دخول الغبار والرياح الصحراوية الجافة والعواصف الرملية.",
      "specs": [
        {
          "label": "عمق الإطار",
          "val": "175 مم"
        },
        {
          "label": "التسليح الداخلي",
          "val": "حديد مجلفن مقوى"
        },
        {
          "label": "عزل الهواء والغبار",
          "val": "مطاط EPDM متعدد الطبقات"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "وينسا دورادو 76 أكوستيك",
      "brand": "أبواب ونوافذ وينسا",
      "category": "uPVC عازل للصوت فئة A",
      "badge": "عزل صوتي 44 ديسبل",
      "description": "قطاع صوتي عالي السماكة من الفئة A مزود بـ 5 حجرات داخلية لعزل ضوضاء الشوارع وحركة المرور المزدحمة في المدن.",
      "specs": [
        {
          "label": "عمق القطاع",
          "val": "76 مم"
        },
        {
          "label": "حجرات العزل",
          "val": "5 حجرات"
        },
        {
          "label": "مستوى العزل الصوتي",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "tr": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belçika",
      "category": "Pasif Ev Standardı uPVC Doğrama",
      "badge": "Pasif Ev Sertifikalı",
      "description": "50°C üzerindeki çöl sıcaklıklarına dayanacak şekilde 6 yalıtım odacığı ile tasarlanmış öncü Avrupa uPVC sistemi.",
      "specs": [
        {
          "label": "Profil Derinliği",
          "val": "80 mm"
        },
        {
          "label": "İç Odacık",
          "val": "6 Odacıklı"
        },
        {
          "label": "Isı İzolasyonu",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Lorenzo Alüminyum",
      "category": "Isı Yalıtımlı Alüminyum Sürme",
      "badge": "Panoramik Cam Sistemleri",
      "description": "Yerden tavana kadar 3 metreye varan devasa cam açıklıklar için ultra akıcı hareket kabiliyetine sahip mimari sürme sistemi.",
      "specs": [
        {
          "label": "Kanat Derinliği",
          "val": "70 mm"
        },
        {
          "label": "Kanat Taşıma",
          "val": "300 kg"
        },
        {
          "label": "Poliamid Bariyer",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Giydirme Cephe 50F",
      "brand": "Mimari Alüminyum Cephe",
      "category": "Ticari Giydirme Cephe Sistemi",
      "badge": "EN-13830 Onaylı",
      "description": "Ticari kuleler, lüks showroomlar ve prestijli villalar için geliştirilmiş yüksek performanslı alüminyum cephe sistemi.",
      "specs": [
        {
          "label": "Görünen Genişlik",
          "val": "50 mm"
        },
        {
          "label": "Statik Taşıyıcı",
          "val": "Düşey Grid"
        },
        {
          "label": "Cam Kombinasyonu",
          "val": "Çift Isıcam"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Hebe-Schiebe HS76 Sürme",
      "brand": "Deceuninck / Winsa",
      "category": "Ağır Hizmet uPVC Hebeschiebe",
      "badge": "Sınıf 4 Hava Geçirimsiz",
      "description": "Çöl rüzgarlarına ve kum fırtınalarına karşı tam sızdırmazlık sunan ağır hizmet tipi kaldırmalı sürme mühendisliği.",
      "specs": [
        {
          "label": "Kasa Derinliği",
          "val": "175 mm"
        },
        {
          "label": "Destek Sacı",
          "val": "Çelik Çekirdek"
        },
        {
          "label": "Hava Yalıtımı",
          "val": "Çoklu EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Akustik",
      "brand": "Winsa Kapı ve Pencere",
      "category": "A Sınıfı Ses Yalıtımlı uPVC",
      "badge": "44 dB Akustik İzolasyon",
      "description": "Yoğun şehir gürültüsünü engellemek için 5 yalıtım odacığına sahip A sınıfı et kalınlığında akustik pencere profili.",
      "specs": [
        {
          "label": "Profil Derinliği",
          "val": "76 mm"
        },
        {
          "label": "Akustik Odacık",
          "val": "5 Odacık"
        },
        {
          "label": "Gürültü Bariyeri",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "de": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belgien",
      "category": "Passivhaus uPVC Fenster & Türen",
      "badge": "Passivhaus-Standard",
      "description": "Europäisches Premium-uPVC-System mit 6 Isolierkammern, entwickelt für extreme Hitzeperioden über 50°C.",
      "specs": [
        {
          "label": "Profiltiefe",
          "val": "80 mm"
        },
        {
          "label": "Kammeraufbau",
          "val": "6 Kammern"
        },
        {
          "label": "Wärmedämmung",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Lorenzo Systeme",
      "category": "Thermisches Aluminium-Schiebesystem",
      "badge": "Panoramaglasung",
      "description": "Architektonisches Schiebesystem für raumhohe Glasfronten bis 3 m Höhe mit federleichtem Laufkomfort.",
      "specs": [
        {
          "label": "Flügeltiefe",
          "val": "70 mm"
        },
        {
          "label": "Flügelgewicht",
          "val": "300 kg"
        },
        {
          "label": "Polyamidsteg",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Pfosten-Riegel-Fassade 50F",
      "brand": "Architektur-Aluminium",
      "category": "Gewerbliche Glasfassadensysteme",
      "badge": "EN-13830 Zertifiziert",
      "description": "Strukturelles Glasfassadensystem für Gewerbetürme, exklusive Showrooms und moderne Luxusvillen.",
      "specs": [
        {
          "label": "Ansichtsbreite",
          "val": "50 mm"
        },
        {
          "label": "Konstruktion",
          "val": "Pfosten-Riegel-Raster"
        },
        {
          "label": "Isolierverglasung",
          "val": "Zweifach Low-E"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Hebeschiebe-System HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Hochbelastbares uPVC Schiebesystem",
      "badge": "Klasse 4 Luftdicht",
      "description": "Massives Hebeschiebesystem für perfekten Schutz vor Wüstenwinden und saisonalen Sandstürmen.",
      "specs": [
        {
          "label": "Rahmentiefe",
          "val": "175 mm"
        },
        {
          "label": "Verstärkung",
          "val": "Stahlkern"
        },
        {
          "label": "Dichtsystem",
          "val": "Mehrfach EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Akustik",
      "brand": "Winsa Fenster & Türen",
      "category": "Klasse A Schallschutz uPVC",
      "badge": "44 dB Schallschutz",
      "description": "Akustikprofil der Wanddickenklasse A mit 5 Innenkammern zur Schallisolation von Stadtverkehrslärm.",
      "specs": [
        {
          "label": "Profiltiefe",
          "val": "76 mm"
        },
        {
          "label": "Schallschutz-Kammern",
          "val": "5 Kammern"
        },
        {
          "label": "Schallschutzwert",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "fr": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belgique",
      "category": "Portes et Fenêtres uPVC Maison Passive",
      "badge": "Standard Maison Passive",
      "description": "Système uPVC haut de gamme à 6 chambres d'isolation, conçu pour résister à des températures caniculaires supérieures à 50°C.",
      "specs": [
        {
          "label": "Profondeur Profil",
          "val": "80 mm"
        },
        {
          "label": "Isolation",
          "val": "6 Chambres"
        },
        {
          "label": "Isolation Thermique",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Systèmes Lorenzo",
      "category": "Aluminium Coulissant à Rupture de Pont Thermique",
      "badge": "Vitrages Panoramiques",
      "description": "Système coulissant architectural pour grandes baies vitrées sol-plafond jusqu'à 3 mètres avec glissement ultra-fluide.",
      "specs": [
        {
          "label": "Profondeur Vantail",
          "val": "70 mm"
        },
        {
          "label": "Poids Max Vantail",
          "val": "300 kg"
        },
        {
          "label": "Barrette Polyamide",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Façade Mur-Rideau 50F",
      "brand": "Aluminium Architectural",
      "category": "Système de Façade Mur-Rideau Commercial",
      "badge": "Certifié EN-13830",
      "description": "Système de façade vitrée structurelle pour tours d'affaires, showrooms haut de gamme et villas contemporaines.",
      "specs": [
        {
          "label": "Largeur Vue",
          "val": "50 mm"
        },
        {
          "label": "Structure",
          "val": "Grille Montant-Traverse"
        },
        {
          "label": "Vitrage Technique",
          "val": "Double Vitrage Low-E"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Système Coulissant à Levage HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Coulissant uPVC Haute Résistance",
      "badge": "Classe 4 Étanchéité à l'Air",
      "description": "Ingénierie coulissante à levage pour charges lourdes garantissant une étanchéité absolue contre les vents chauds et tempêtes de sable.",
      "specs": [
        {
          "label": "Profondeur Dormant",
          "val": "175 mm"
        },
        {
          "label": "Renfort",
          "val": "Noyau Acier"
        },
        {
          "label": "Joints Étanchéité",
          "val": "Multi-EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acoustique",
      "brand": "Portes et Fenêtres Winsa",
      "category": "uPVC Acoustique Classe A",
      "badge": "Isolation Acoustique 44 dB",
      "description": "Profilé acoustique haute épaisseur Classe A à 5 chambres intérieures pour neutraliser les bruits urbains intenses.",
      "specs": [
        {
          "label": "Profondeur Profil",
          "val": "76 mm"
        },
        {
          "label": "Chambres Acoustiques",
          "val": "5 Chambres"
        },
        {
          "label": "Indice Acoustique",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "it": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belgio",
      "category": "Porte e Finestre uPVC Passivhaus",
      "badge": "Standard Casa Passiva",
      "description": "Serie europea di punta in uPVC certificata per case passive, progettata con 6 camere di isolamento termico per resistere a temperature superiori a 50°C.",
      "specs": [
        {
          "label": "Profondità Profilo",
          "val": "80 mm"
        },
        {
          "label": "Geometria",
          "val": "6 Camere"
        },
        {
          "label": "Isolamento Termico",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumentale",
      "brand": "Sistemi Lorenzo",
      "category": "Alluminio Scorrevole a Taglio Termico",
      "badge": "Vetrata Panoramica",
      "description": "Sistema scorrevole architettonico per ampie vetrate dal pavimento al soffitto fino a 3 metri di altezza con scorrimento ultra-fluido.",
      "specs": [
        {
          "label": "Profondità Anta",
          "val": "70 mm"
        },
        {
          "label": "Portata Anta",
          "val": "300 kg"
        },
        {
          "label": "Barretta Poliammide",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Facciata Continua 50F per Edifici",
      "brand": "Alluminio Architettonico",
      "category": "Sistema di Facciata Continua Commerciale",
      "badge": "Certificato EN-13830",
      "description": "Sistema di facciata continua in vetro per torri commerciali, showroom di lusso e ville contemporanee in tutto il paese.",
      "specs": [
        {
          "label": "Larghezza Vista",
          "val": "50 mm"
        },
        {
          "label": "Struttura",
          "val": "Montanti e Traversi"
        },
        {
          "label": "Vetro Tecnico",
          "val": "Doppio Vetro Basso-Emissivo"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Sistema Alzante Scorrevole HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Scorrevole uPVC per Grandi Carichi",
      "badge": "Classe 4 Tenuta all'Aria",
      "description": "Ingegneria alzante scorrevole rinforzata per garantire una perfetta tenuta contro i venti caldi del deserto e le tempeste di sabbia.",
      "specs": [
        {
          "label": "Profondità Telaio",
          "val": "175 mm"
        },
        {
          "label": "Rinforzo",
          "val": "Anima in Acciaio"
        },
        {
          "label": "Tenuta Vento",
          "val": "Guarnizioni EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acustico",
      "brand": "Porte e Finestre Winsa",
      "category": "uPVC Fonoisolante Classe A",
      "badge": "Insonorizzazione 44 dB",
      "description": "Profilo acustico con spessore di parete Classe A e 5 camere interne per isolare gli interni dal forte rumore del traffico urbano.",
      "specs": [
        {
          "label": "Profondità Profilo",
          "val": "76 mm"
        },
        {
          "label": "Camere Acustiche",
          "val": "5 Camere"
        },
        {
          "label": "Barriera Rumore",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "es": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Bélgica",
      "category": "Ventanas y Puertas uPVC Passivhaus",
      "badge": "Estándar Passivhaus",
      "description": "Serie europea líder en uPVC con 6 cámaras térmicas diseñada para soportar temperaturas superiores a 50°C.",
      "specs": [
        {
          "label": "Profundidad Perfil",
          "val": "80 mm"
        },
        {
          "label": "Estructura",
          "val": "6 Cámaras"
        },
        {
          "label": "Aislamiento Térmico",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Sistemas Lorenzo",
      "category": "Aluminio Corredera con Rotura Térmica",
      "badge": "Acristalamiento Panorámico",
      "description": "Sistema corredero de altas prestaciones para grandes ventanales de suelo a techo hasta 3 metros de altura con deslizamiento suave.",
      "specs": [
        {
          "label": "Profundidad Hoja",
          "val": "70 mm"
        },
        {
          "label": "Carga Máx Hoja",
          "val": "300 kg"
        },
        {
          "label": "Pletina Poliamida",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Fachada Muro Cortina 50F",
      "brand": "Aluminio Arquitectónico",
      "category": "Muro Cortina Comercial de Alta Prestación",
      "badge": "Certificado EN-13830",
      "description": "Sistema de fachada estructural acristalada para torres corporativas, concesionarios y villas residenciales de vanguardia.",
      "specs": [
        {
          "label": "Ancho Visto",
          "val": "50 mm"
        },
        {
          "label": "Estructura",
          "val": "Retícula Montante-Travesaño"
        },
        {
          "label": "Vidrio de Proyecto",
          "val": "Doble Acristalamiento Bajo Emisivo"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Sistema Elevable HS76",
      "brand": "Deceuninck / Winsa",
      "category": "uPVC Corredera Elevable Pesada",
      "badge": "Clase 4 Estanqueidad al Aire",
      "description": "Ingeniería elevable de alta gama que garantiza un sellado hermético contra vientos secos y tormentas de polvo.",
      "specs": [
        {
          "label": "Profundidad Marco",
          "val": "175 mm"
        },
        {
          "label": "Refuerzo",
          "val": "Alma de Acero"
        },
        {
          "label": "Juntas Estanqueidad",
          "val": "EPDM Continuo"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acústico",
      "brand": "Ventanas y Puertas Winsa",
      "category": "uPVC Acústico Clase A",
      "badge": "Aislamiento Acústico 44 dB",
      "description": "Perfil acústico Clase A con 5 cámaras interiores para aislar por completo los interiores del intenso ruido del tráfico.",
      "specs": [
        {
          "label": "Profundidad Perfil",
          "val": "76 mm"
        },
        {
          "label": "Cámaras Aislantes",
          "val": "5 Cámaras"
        },
        {
          "label": "Atenuación Sonora",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "en": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belgium",
      "category": "Passive uPVC Window & Door",
      "badge": "Passive House Standard",
      "description": "Flagship European passive-certified uPVC series engineered with 6 insulation chambers to withstand heat over 50°C.",
      "specs": [
        {
          "label": "Profile Depth",
          "val": "80 mm"
        },
        {
          "label": "Chambers",
          "val": "6 Thermal"
        },
        {
          "label": "Insulation",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Lorenzo Systems",
      "category": "Thermal Aluminum Sliding",
      "badge": "Panoramic Glazing",
      "description": "Architectural sliding system for floor-to-ceiling glass spans up to 3 meters with effortless feather-touch glide.",
      "specs": [
        {
          "label": "Sash Depth",
          "val": "70 mm"
        },
        {
          "label": "Max Load",
          "val": "300 kg"
        },
        {
          "label": "Polyamide Break",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Façade 50F Curtain Wall",
      "brand": "Architectural Aluminum",
      "category": "Commercial Curtain Wall System",
      "badge": "EN-13830 Certified",
      "description": "Engineered structural glass facade system for commercial towers, car showrooms, and modern villas across Iraq.",
      "specs": [
        {
          "label": "Sightline",
          "val": "50 mm"
        },
        {
          "label": "Structure",
          "val": "Mullion Grid"
        },
        {
          "label": "Architectural Glass",
          "val": "Double Glazed"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Hebe-Schiebe HS76 System",
      "brand": "Deceuninck / Winsa",
      "category": "Heavy-Duty uPVC Sliding",
      "badge": "Class 4 Airtight",
      "description": "Heavyweight lift-and-slide engineering delivering airtight sealing against high-velocity dry desert winds and seasonal sandstorms.",
      "specs": [
        {
          "label": "Frame Depth",
          "val": "175 mm"
        },
        {
          "label": "Reinforcement",
          "val": "Steel Core"
        },
        {
          "label": "Wind Seal",
          "val": "Multi EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acoustic",
      "brand": "Winsa Windows & Doors",
      "category": "Class A Soundproof uPVC",
      "badge": "Sound Proof 44 dB",
      "description": "Class A wall-thickness acoustic profile with multi-chamber interior baffling to isolate indoor spaces from heavy city traffic noise.",
      "specs": [
        {
          "label": "Profile Depth",
          "val": "76 mm"
        },
        {
          "label": "Acoustic Baffle",
          "val": "5 Chambers"
        },
        {
          "label": "Noise Barrier",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "en-GB": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belgium",
      "category": "Passive uPVC Window & Door",
      "badge": "Passive House Standard",
      "description": "Flagship European passive-certified uPVC series engineered with 6 insulation chambers to withstand heat over 50°C.",
      "specs": [
        {
          "label": "Profile Depth",
          "val": "80 mm"
        },
        {
          "label": "Chambers",
          "val": "6 Thermal"
        },
        {
          "label": "Insulation",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Lorenzo Systems",
      "category": "Thermal Aluminum Sliding",
      "badge": "Panoramic Glazing",
      "description": "Architectural sliding system for floor-to-ceiling glass spans up to 3 meters with effortless feather-touch glide.",
      "specs": [
        {
          "label": "Sash Depth",
          "val": "70 mm"
        },
        {
          "label": "Max Load",
          "val": "300 kg"
        },
        {
          "label": "Polyamide Break",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Façade 50F Curtain Wall",
      "brand": "Architectural Aluminum",
      "category": "Commercial Curtain Wall System",
      "badge": "EN-13830 Certified",
      "description": "Engineered structural glass facade system for commercial towers, car showrooms, and modern villas across Iraq.",
      "specs": [
        {
          "label": "Sightline",
          "val": "50 mm"
        },
        {
          "label": "Structure",
          "val": "Mullion Grid"
        },
        {
          "label": "Architectural Glass",
          "val": "Double Glazed"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Hebe-Schiebe HS76 System",
      "brand": "Deceuninck / Winsa",
      "category": "Heavy-Duty uPVC Sliding",
      "badge": "Class 4 Airtight",
      "description": "Heavyweight lift-and-slide engineering delivering airtight sealing against high-velocity dry desert winds and seasonal sandstorms.",
      "specs": [
        {
          "label": "Frame Depth",
          "val": "175 mm"
        },
        {
          "label": "Reinforcement",
          "val": "Steel Core"
        },
        {
          "label": "Wind Seal",
          "val": "Multi EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acoustic",
      "brand": "Winsa Windows & Doors",
      "category": "Class A Soundproof uPVC",
      "badge": "Sound Proof 44 dB",
      "description": "Class A wall-thickness acoustic profile with multi-chamber interior baffling to isolate indoor spaces from heavy city traffic noise.",
      "specs": [
        {
          "label": "Profile Depth",
          "val": "76 mm"
        },
        {
          "label": "Acoustic Baffle",
          "val": "5 Chambers"
        },
        {
          "label": "Noise Barrier",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "en-US": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belgium",
      "category": "Passive uPVC Window & Door",
      "badge": "Passive House Standard",
      "description": "Flagship European passive-certified uPVC series engineered with 6 insulation chambers to withstand heat over 50°C.",
      "specs": [
        {
          "label": "Profile Depth",
          "val": "80 mm"
        },
        {
          "label": "Chambers",
          "val": "6 Thermal"
        },
        {
          "label": "Insulation",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Lorenzo Systems",
      "category": "Thermal Aluminum Sliding",
      "badge": "Panoramic Glazing",
      "description": "Architectural sliding system for floor-to-ceiling glass spans up to 3 meters with effortless feather-touch glide.",
      "specs": [
        {
          "label": "Sash Depth",
          "val": "70 mm"
        },
        {
          "label": "Max Load",
          "val": "300 kg"
        },
        {
          "label": "Polyamide Break",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Façade 50F Curtain Wall",
      "brand": "Architectural Aluminum",
      "category": "Commercial Curtain Wall System",
      "badge": "EN-13830 Certified",
      "description": "Engineered structural glass facade system for commercial towers, car showrooms, and modern villas across Iraq.",
      "specs": [
        {
          "label": "Sightline",
          "val": "50 mm"
        },
        {
          "label": "Structure",
          "val": "Mullion Grid"
        },
        {
          "label": "Architectural Glass",
          "val": "Double Glazed"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Hebe-Schiebe HS76 System",
      "brand": "Deceuninck / Winsa",
      "category": "Heavy-Duty uPVC Sliding",
      "badge": "Class 4 Airtight",
      "description": "Heavyweight lift-and-slide engineering delivering airtight sealing against high-velocity dry desert winds and seasonal sandstorms.",
      "specs": [
        {
          "label": "Frame Depth",
          "val": "175 mm"
        },
        {
          "label": "Reinforcement",
          "val": "Steel Core"
        },
        {
          "label": "Wind Seal",
          "val": "Multi EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acoustic",
      "brand": "Winsa Windows & Doors",
      "category": "Class A Soundproof uPVC",
      "badge": "Sound Proof 44 dB",
      "description": "Class A wall-thickness acoustic profile with multi-chamber interior baffling to isolate indoor spaces from heavy city traffic noise.",
      "specs": [
        {
          "label": "Profile Depth",
          "val": "76 mm"
        },
        {
          "label": "Acoustic Baffle",
          "val": "5 Chambers"
        },
        {
          "label": "Noise Barrier",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "es-MX": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Bélgica",
      "category": "Ventanas y Puertas uPVC Passivhaus",
      "badge": "Estándar Passivhaus",
      "description": "Serie europea líder en uPVC con 6 cámaras térmicas diseñada para soportar temperaturas superiores a 50°C.",
      "specs": [
        {
          "label": "Profundidad Perfil",
          "val": "80 mm"
        },
        {
          "label": "Estructura",
          "val": "6 Cámaras"
        },
        {
          "label": "Aislamiento Térmico",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Sistemas Lorenzo",
      "category": "Aluminio Corredera con Rotura Térmica",
      "badge": "Acristalamiento Panorámico",
      "description": "Sistema corredero de altas prestaciones para grandes ventanales de suelo a techo hasta 3 metros de altura con deslizamiento suave.",
      "specs": [
        {
          "label": "Profundidad Hoja",
          "val": "70 mm"
        },
        {
          "label": "Carga Máx Hoja",
          "val": "300 kg"
        },
        {
          "label": "Pletina Poliamida",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Fachada Muro Cortina 50F",
      "brand": "Aluminio Arquitectónico",
      "category": "Muro Cortina Comercial de Alta Prestación",
      "badge": "Certificado EN-13830",
      "description": "Sistema de fachada estructural acristalada para torres corporativas, concesionarios y villas residenciales de vanguardia.",
      "specs": [
        {
          "label": "Ancho Visto",
          "val": "50 mm"
        },
        {
          "label": "Estructura",
          "val": "Retícula Montante-Travesaño"
        },
        {
          "label": "Vidrio de Proyecto",
          "val": "Doble Acristalamiento Bajo Emisivo"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Sistema Elevable HS76",
      "brand": "Deceuninck / Winsa",
      "category": "uPVC Corredera Elevable Pesada",
      "badge": "Clase 4 Estanqueidad al Aire",
      "description": "Ingeniería elevable de alta gama que garantiza un sellado hermético contra vientos secos y tormentas de polvo.",
      "specs": [
        {
          "label": "Profundidad Marco",
          "val": "175 mm"
        },
        {
          "label": "Refuerzo",
          "val": "Alma de Acero"
        },
        {
          "label": "Juntas Estanqueidad",
          "val": "EPDM Continuo"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acústico",
      "brand": "Ventanas y Puertas Winsa",
      "category": "uPVC Acústico Clase A",
      "badge": "Aislamiento Acústico 44 dB",
      "description": "Perfil acústico Clase A con 5 cámaras interiores para aislar por completo los interiores del intenso ruido del tráfico.",
      "specs": [
        {
          "label": "Profundidad Perfil",
          "val": "76 mm"
        },
        {
          "label": "Cámaras Aislantes",
          "val": "5 Cámaras"
        },
        {
          "label": "Atenuación Sonora",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "ru": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Бельгия",
      "category": "Окна и двери ПВХ Passivhaus",
      "badge": "Стандарт Passivhaus",
      "description": "Флагманская 6-камерная европейская система ПВХ для экстремальных температур свыше 50°C.",
      "specs": [
        {
          "label": "Глубина профиля",
          "val": "80 мм"
        },
        {
          "label": "Камеры",
          "val": "6 камер"
        },
        {
          "label": "Теплоизоляция",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Монументаль",
      "brand": "Системы Lorenzo",
      "category": "Теплый алюминий раздвижной",
      "badge": "Панорамное остекление",
      "description": "Архитектурная раздвижная система для панорамного остекления высотой до 3 метров с плавным ходом.",
      "specs": [
        {
          "label": "Глубина створки",
          "val": "70 мм"
        },
        {
          "label": "Вес створки",
          "val": "300 кг"
        },
        {
          "label": "Терморазрыв",
          "val": "24 мм"
        }
      ]
    },
    "curtain-50f": {
      "title": "Фасад 50F Витражный",
      "brand": "Архитектурный алюминий",
      "category": "Коммерческий стоечно-ригельный фасад",
      "badge": "Сертификат EN-13830",
      "description": "Конструкционная фасадная система для бизнес-центров, автосалонов и элитных вилл.",
      "specs": [
        {
          "label": "Ширина профиля",
          "val": "50 мм"
        },
        {
          "label": "Каркас",
          "val": "Стоечно-ригельный"
        },
        {
          "label": "Остекление",
          "val": "Двухкамерный стеклопакет"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Подъемно-сдвижная HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Тяжелый подъемно-сдвижной ПВХ",
      "badge": "Класс герметичности 4",
      "description": "Усиленная подъемно-сдвижная конструкция, защищающая от пылевых бурь и ураганных ветров.",
      "specs": [
        {
          "label": "Глубина рамы",
          "val": "175 мм"
        },
        {
          "label": "Армирование",
          "val": "Стальной сердечник"
        },
        {
          "label": "Уплотнитель",
          "val": "Многоконтурный EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Акустик",
      "brand": "Окна и двери Winsa",
      "category": "Звукоизоляционный ПВХ класса A",
      "badge": "Звукоизоляция 44 дБ",
      "description": "Акустический профиль класса А с 5 камерами для надежной защиты от интенсивного городского шума.",
      "specs": [
        {
          "label": "Глубина профиля",
          "val": "76 мм"
        },
        {
          "label": "Камеры",
          "val": "5 камер"
        },
        {
          "label": "Шумоизоляция",
          "val": "Rw = 44 дБ"
        }
      ]
    }
  },
  "fa": {
    "legend-80": {
      "title": "دکونینک لجند ۸۰",
      "brand": "دکونینک بلژیک",
      "category": "درب و پنجره uPVC خانه غیرفعال",
      "badge": "استاندارد خانه غیرفعال",
      "description": "سیستم پرچمدار اروپایی با ۶ کانال عایق حرارتی طراحی‌شده برای گرمای بالای ۵۰ درجه.",
      "specs": [
        {
          "label": "عمق پروفیل",
          "val": "80 mm"
        },
        {
          "label": "تعداد کانال",
          "val": "۶ کاناله"
        },
        {
          "label": "عایق حرارتی",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "لورنزولاین 70LS مانیومنتال",
      "brand": "سیستم‌های لورنزو",
      "category": "آلومینیوم کشویی ترمال بریک",
      "badge": "شیشه‌های پانوراما",
      "description": "سیستم اسلایدینگ معماری برای شیشه‌های سرتاسری کف تا سقف تا ارتفاع ۳ متر با حرکتی بسیار نرم.",
      "specs": [
        {
          "label": "عمق لنگه",
          "val": "70 mm"
        },
        {
          "label": "تحمل وزن",
          "val": "۳۰۰ کیلوگرم"
        },
        {
          "label": "تیغه پلی‌آمید",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "نمای کرتین وال 50F",
      "brand": "آلومینیوم معماری",
      "category": "سیستم نمای شیشه‌ای تجاری",
      "badge": "دارای استاندارد EN-13830",
      "description": "نمای شیشه‌ای مهندسی‌شده برای برج‌های اداری، نمایشگاه‌ها و ویلاهای لوکس مدرن.",
      "specs": [
        {
          "label": "عرض دید",
          "val": "50 mm"
        },
        {
          "label": "سازه",
          "val": "شبکه لامل"
        },
        {
          "label": "شیشه مهندسی",
          "val": "دوجداره"
        }
      ]
    },
    "hs76-sliding": {
      "title": "سیستم هبه شیبه HS76",
      "brand": "دکونینک / وینسا",
      "category": "اسلایدینگ سنگین uPVC",
      "badge": "کلاس ۴ هوابندی",
      "description": "مکانیزم لیفت اند اسلاید قدرتمند جهت عایق‌بندی کامل در برابر طوفان‌های شن و بادهای کویری.",
      "specs": [
        {
          "label": "عمق فریم",
          "val": "175 mm"
        },
        {
          "label": "تقویت‌کننده",
          "val": "هسته فولادی"
        },
        {
          "label": "لاستیک آب‌بندی",
          "val": "EPDM چندلایه"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "وینسا دورادو ۷۶ آکوستیک",
      "brand": "درب و پنجره وینسا",
      "category": "uPVC ضد صدا کلاس A",
      "badge": "عایق صوتی ۴۴ دسی‌بل",
      "description": "پروفیل ضخیم کلاس A با ۵ محفظه داخلی برای جلوگیری کامل از نفوذ صدای تردد شهری.",
      "specs": [
        {
          "label": "عمق پروفیل",
          "val": "76 mm"
        },
        {
          "label": "کانال آکوستیک",
          "val": "۵ کاناله"
        },
        {
          "label": "کاهش صدا",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "zh-CN": {
    "legend-80": {
      "title": "比利时 Deceuninck Legend 80",
      "brand": "Deceuninck 比利时原厂",
      "category": "被动房高隔热 uPVC 门窗系统",
      "badge": "德国被动房认证",
      "description": "欧洲旗舰级6腔体超高隔热系统，专为抵御50°C以上极限炎热酷暑而设计。",
      "specs": [
        {
          "label": "型材深度",
          "val": "80 mm"
        },
        {
          "label": "腔体结构",
          "val": "6 腔体"
        },
        {
          "label": "传热系数",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS 极简全景推拉门",
      "brand": "Lorenzo 欧洲建筑系统",
      "category": "断桥隔热超重型提升推拉门",
      "badge": "全景落地视野",
      "description": "顶级全景推拉系统，支持单扇高逾3米巨幅落地玻璃，轻巧顺滑如丝。",
      "specs": [
        {
          "label": "扇料厚度",
          "val": "70 mm"
        },
        {
          "label": "最大承重",
          "val": "300 kg"
        },
        {
          "label": "隔热条规格",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Façade 50F 建筑玻璃幕墙系统",
      "brand": "高标建筑铝型材",
      "category": "商业与豪宅玻璃幕墙系统",
      "badge": "欧盟 EN-13830 认证",
      "description": "高强度立柱横梁式幕墙系统，广泛应用于地标写字楼、豪车展厅和现代别墅。",
      "specs": [
        {
          "label": "外立面可视宽",
          "val": "50 mm"
        },
        {
          "label": "结构形式",
          "val": "龙骨网格"
        },
        {
          "label": "玻璃配置",
          "val": "双银 Low-E 中空玻璃"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Hebe-Schiebe HS76 提升推拉门",
      "brand": "Deceuninck / Winsa",
      "category": "重型密封 uPVC 提升推拉门",
      "badge": "4级超高气密性",
      "description": "重型提升开启结构，在遭遇干燥强风与沙尘暴天气时提供极致密封隔绝。",
      "specs": [
        {
          "label": "外框深度",
          "val": "175 mm"
        },
        {
          "label": "加强衬钢",
          "val": "热镀锌加厚钢衬"
        },
        {
          "label": "密封配置",
          "val": "三元乙丙多道密封"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 顶级隔音系统",
      "brand": "Winsa 欧洲门窗",
      "category": "A级壁厚专业静音 uPVC 系统",
      "badge": "44 dB 录音棚级降噪",
      "description": "A级壁厚5腔体声学构型，有效隔绝繁杂车流声与工业喧嚣，营造安宁空间。",
      "specs": [
        {
          "label": "型材厚度",
          "val": "76 mm"
        },
        {
          "label": "隔音腔室",
          "val": "5 腔室"
        },
        {
          "label": "计权隔声量",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "pt": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Bélgica",
      "category": "Portas e Janelas uPVC Passivhaus",
      "badge": "Padrão Casa Passiva",
      "description": "Série europeia líder em uPVC com 6 câmaras térmicas para resistir a temperaturas superiores a 50°C.",
      "specs": [
        {
          "label": "Profundidade Perfil",
          "val": "80 mm"
        },
        {
          "label": "Câmaras",
          "val": "6 Câmaras"
        },
        {
          "label": "Isolamento Térmico",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Sistemas Lorenzo",
      "category": "Alumínio de Correr com Corte Térmico",
      "badge": "Vidros Panorâmicos",
      "description": "Sistema de correr arquitetónico para vãos panorâmicos até 3 metros de altura com deslizamento ultra-suave.",
      "specs": [
        {
          "label": "Profundidade Folha",
          "val": "70 mm"
        },
        {
          "label": "Carga Máx",
          "val": "300 kg"
        },
        {
          "label": "Barra Poliamida",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Fachada Cortina 50F",
      "brand": "Alumínio Arquitetónico",
      "category": "Sistema de Fachada Cortina Comercial",
      "badge": "Certificado EN-13830",
      "description": "Sistema de fachada estrutural em vidro para edifícios corporativos, showrooms e moradias modernas.",
      "specs": [
        {
          "label": "Largura Vista",
          "val": "50 mm"
        },
        {
          "label": "Estrutura",
          "val": "Grelha Prumada-Travessa"
        },
        {
          "label": "Vidro Técnico",
          "val": "Vidro Duplo Low-E"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Sistema Elevador HS76",
      "brand": "Deceuninck / Winsa",
      "category": "uPVC Elevador de Correr de Alta Carga",
      "badge": "Classe 4 Estanquidade ao Ar",
      "description": "Engenharia de correr elevadora robusta que garante estanquidade absoluta contra tempestades de poeira e ventos fortes.",
      "specs": [
        {
          "label": "Profundidade Aro",
          "val": "175 mm"
        },
        {
          "label": "Reforço",
          "val": "Alma de Aço"
        },
        {
          "label": "Vedação Vento",
          "val": "Multi EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acústico",
      "brand": "Janelas e Portas Winsa",
      "category": "uPVC Acústico Classe A",
      "badge": "Insonorização 44 dB",
      "description": "Perfil acústico Classe A com 5 câmaras interiores para isolar os interiores do ruído intenso do tráfego.",
      "specs": [
        {
          "label": "Profundidade Perfil",
          "val": "76 mm"
        },
        {
          "label": "Câmaras Acústicas",
          "val": "5 Câmaras"
        },
        {
          "label": "Barreira Acústica",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "pt-BR": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Bélgica",
      "category": "Portas e Janelas uPVC Passivhaus",
      "badge": "Padrão Casa Passiva",
      "description": "Série europeia líder em uPVC com 6 câmaras térmicas para resistir a temperaturas superiores a 50°C.",
      "specs": [
        {
          "label": "Profundidade Perfil",
          "val": "80 mm"
        },
        {
          "label": "Câmaras",
          "val": "6 Câmaras"
        },
        {
          "label": "Isolamento Térmico",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Sistemas Lorenzo",
      "category": "Alumínio de Correr com Corte Térmico",
      "badge": "Vidros Panorâmicos",
      "description": "Sistema de correr arquitetónico para vãos panorâmicos até 3 metros de altura com deslizamento ultra-suave.",
      "specs": [
        {
          "label": "Profundidade Folha",
          "val": "70 mm"
        },
        {
          "label": "Carga Máx",
          "val": "300 kg"
        },
        {
          "label": "Barra Poliamida",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Fachada Cortina 50F",
      "brand": "Alumínio Arquitetónico",
      "category": "Sistema de Fachada Cortina Comercial",
      "badge": "Certificado EN-13830",
      "description": "Sistema de fachada estrutural em vidro para edifícios corporativos, showrooms e moradias modernas.",
      "specs": [
        {
          "label": "Largura Vista",
          "val": "50 mm"
        },
        {
          "label": "Estrutura",
          "val": "Grelha Prumada-Travessa"
        },
        {
          "label": "Vidro Técnico",
          "val": "Vidro Duplo Low-E"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Sistema Elevador HS76",
      "brand": "Deceuninck / Winsa",
      "category": "uPVC Elevador de Correr de Alta Carga",
      "badge": "Classe 4 Estanquidade ao Ar",
      "description": "Engenharia de correr elevadora robusta que garante estanquidade absoluta contra tempestades de poeira e ventos fortes.",
      "specs": [
        {
          "label": "Profundidade Aro",
          "val": "175 mm"
        },
        {
          "label": "Reforço",
          "val": "Alma de Aço"
        },
        {
          "label": "Vedação Vento",
          "val": "Multi EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acústico",
      "brand": "Janelas e Portas Winsa",
      "category": "uPVC Acústico Classe A",
      "badge": "Insonorização 44 dB",
      "description": "Perfil acústico Classe A com 5 câmaras interiores para isolar os interiores do ruído intenso do tráfego.",
      "specs": [
        {
          "label": "Profundidade Perfil",
          "val": "76 mm"
        },
        {
          "label": "Câmaras Acústicas",
          "val": "5 Câmaras"
        },
        {
          "label": "Barreira Acústica",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "nl": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck België",
      "category": "Passiefhuis uPVC Kozijnen",
      "badge": "Passiefhuis Standaard",
      "description": "Toonaangevend Europees uPVC-systeem met 6 isolatiekamers ontworpen voor extreme temperaturen boven 50°C.",
      "specs": [
        {
          "label": "Profieldiepte",
          "val": "80 mm"
        },
        {
          "label": "Kamers",
          "val": "6 Kamers"
        },
        {
          "label": "Warmte-isolatie",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Lorenzo Systemen",
      "category": "Aluminium Schuifsysteem met Thermische Onderbreking",
      "badge": "Panoramische Beglazing",
      "description": "Architectonisch schuifsysteem voor vloer-tot-plafond glaspartijen tot 3 meter hoog met vederlichte bediening.",
      "specs": [
        {
          "label": "Vleugeldiepte",
          "val": "70 mm"
        },
        {
          "label": "Draagkracht",
          "val": "300 kg"
        },
        {
          "label": "Polyamidestrip",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Vliesgevel 50F",
      "brand": "Architectonisch Aluminium",
      "category": "Commercieel Vliesgevelsysteem",
      "badge": "EN-13830 Gecertificeerd",
      "description": "Structureel glasgevelsysteem voor kantoortorens, showrooms en exclusieve villa's.",
      "specs": [
        {
          "label": "Aanzichtbreedte",
          "val": "50 mm"
        },
        {
          "label": "Constructie",
          "val": "Stijl- en Regelwerk"
        },
        {
          "label": "Beglazing",
          "val": "Dubbel Hoogrendementsglas"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Hefschuifsysteem HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Zwaar uPVC Hefschuifsysteem",
      "badge": "Klasse 4 Luchtdicht",
      "description": "Zwaar hefschuifsysteem met optimale afdichting tegen woestijnwind en zandstormen.",
      "specs": [
        {
          "label": "Kaderdiepte",
          "val": "175 mm"
        },
        {
          "label": "Versterking",
          "val": "Stalen kern"
        },
        {
          "label": "Afdichting",
          "val": "Meervoudig EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Akoestiek",
      "brand": "Winsa Ramen & Deuren",
      "category": "Klasse A Geluidsisolerend uPVC",
      "badge": "44 dB Geluidsisolatie",
      "description": "Klasse A akoestisch profiel met 5 kamers om verkeerslawaai volledig buiten te sluiten.",
      "specs": [
        {
          "label": "Profieldiepte",
          "val": "76 mm"
        },
        {
          "label": "Akoestische Kamers",
          "val": "5 Kamers"
        },
        {
          "label": "Geluidsreductie",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "pl": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belgia",
      "category": "Okna i Drzwi uPVC Dom Pasywny",
      "badge": "Standard Domu Pasywnego",
      "description": "Europejski system uPVC z 6 komorami izolacyjnymi, odporny na upały powyżej 50°C.",
      "specs": [
        {
          "label": "Głębokość profilu",
          "val": "80 mm"
        },
        {
          "label": "Komory",
          "val": "6 Komór"
        },
        {
          "label": "Izolacja termiczna",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Systemy Lorenzo",
      "category": "Ciepłe Aluminiowe Drzwi Przesuwne",
      "badge": "Przeszklenia Panoramiczne",
      "description": "Architektoniczny system przesuwny do przeszkleń do 3 m wysokości z lekkim i płynnym ruchem.",
      "specs": [
        {
          "label": "Głębokość skrzydła",
          "val": "70 mm"
        },
        {
          "label": "Maks. nośność",
          "val": "300 kg"
        },
        {
          "label": "Przekładka poliamidowa",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Fasada Słupowo-Ryglowa 50F",
      "brand": "Aluminium Architektoniczne",
      "category": "Fasada Szklana Komercyjna",
      "badge": "Certyfikat EN-13830",
      "description": "System fasad szklanych dla biurowców, salonów samochodowych i nowoczesnych willi.",
      "specs": [
        {
          "label": "Szerokość widoczna",
          "val": "50 mm"
        },
        {
          "label": "Konstrukcja",
          "val": "Siatka słup-rygiel"
        },
        {
          "label": "Szklenie",
          "val": "Szyba zespolona"
        }
      ]
    },
    "hs76-sliding": {
      "title": "System Podnoszono-Przesuwny HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Ciężkie Przesuwne uPVC",
      "badge": "Klasa 4 Szczelności",
      "description": "Solidny mechanizm HS zapewniający pełną szczelność przed wiatrem i burzami piaskowymi.",
      "specs": [
        {
          "label": "Głębokość ramy",
          "val": "175 mm"
        },
        {
          "label": "Wzmocnienie",
          "val": "Rdzeń stalowy"
        },
        {
          "label": "Uszczelnienie",
          "val": "Wielokrotny EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Akustik",
      "brand": "Okna i Drzwi Winsa",
      "category": "Dźwiękochłonne uPVC Klasy A",
      "badge": "Izolacja akustyczna 44 dB",
      "description": "Grubościenny profil akustyczny klasy A z 5 komorami tłumiący hałas uliczny.",
      "specs": [
        {
          "label": "Głębokość profilu",
          "val": "76 mm"
        },
        {
          "label": "Komory akustyczne",
          "val": "5 Komór"
        },
        {
          "label": "Tłumienie hałasu",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "ro": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belgia",
      "category": "Tâmplărie uPVC Casă Pasivă",
      "badge": "Standard Casă Pasivă",
      "description": "Sistem uPVC de top cu 6 camere termoizolante, creat pentru a rezista la temperaturi de peste 50°C.",
      "specs": [
        {
          "label": "Adâncime profil",
          "val": "80 mm"
        },
        {
          "label": "Camere",
          "val": "6 Camere"
        },
        {
          "label": "Izolație termică",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Sisteme Lorenzo",
      "category": "Aluminiu Culisant cu Rulmenți",
      "badge": "Vitraj Panoramic",
      "description": "Sistem culisant pentru suprafețe vitrate de până la 3 m înălțime cu culisare lină.",
      "specs": [
        {
          "label": "Adâncime cercevea",
          "val": "70 mm"
        },
        {
          "label": "Portanță max.",
          "val": "300 kg"
        },
        {
          "label": "Barieră poliamidă",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Fațadă Cortină 50F",
      "brand": "Aluminiu Arhitectural",
      "category": "Sistem Fațadă Cortină",
      "badge": "Certificat EN-13830",
      "description": "Fațadă structurală din sticlă pentru clădiri de birouri, showroom-uri și vile luxoase.",
      "specs": [
        {
          "label": "Lățime vizibilă",
          "val": "50 mm"
        },
        {
          "label": "Structură",
          "val": "Grilă Montant-Traversă"
        },
        {
          "label": "Tip Geam",
          "val": "Geam Dublu Low-E"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Sistem Culisant HS76",
      "brand": "Deceuninck / Winsa",
      "category": "uPVC Culisant cu Ridicare",
      "badge": "Etanșeitate Clasa 4",
      "description": "Inginerie hebe-schiebe robustă pentru etanșare maximă împotriva prafului și vântului.",
      "specs": [
        {
          "label": "Adâncime toc",
          "val": "175 mm"
        },
        {
          "label": "Armătură",
          "val": "Miez Oțel"
        },
        {
          "label": "Etanșare vânt",
          "val": "Garnituri EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acustic",
      "brand": "Uși și Ferestre Winsa",
      "category": "uPVC Fonoizolant Clasa A",
      "badge": "Izolare Fonică 44 dB",
      "description": "Profil acustic clasa A cu 5 camere pentru izolarea zgomotului urban intens.",
      "specs": [
        {
          "label": "Adâncime profil",
          "val": "76 mm"
        },
        {
          "label": "Camere acustice",
          "val": "5 Camere"
        },
        {
          "label": "Barieră fonică",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "sr": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Бельгия",
      "category": "Окна и двери ПВХ Passivhaus",
      "badge": "Стандарт Passivhaus",
      "description": "Флагманская 6-камерная европейская система ПВХ для экстремальных температур свыше 50°C.",
      "specs": [
        {
          "label": "Глубина профиля",
          "val": "80 мм"
        },
        {
          "label": "Камеры",
          "val": "6 камер"
        },
        {
          "label": "Теплоизоляция",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Монументаль",
      "brand": "Системы Lorenzo",
      "category": "Теплый алюминий раздвижной",
      "badge": "Панорамное остекление",
      "description": "Архитектурная раздвижная система для панорамного остекления высотой до 3 метров с плавным ходом.",
      "specs": [
        {
          "label": "Глубина створки",
          "val": "70 мм"
        },
        {
          "label": "Вес створки",
          "val": "300 кг"
        },
        {
          "label": "Терморазрыв",
          "val": "24 мм"
        }
      ]
    },
    "curtain-50f": {
      "title": "Фасад 50F Витражный",
      "brand": "Архитектурный алюминий",
      "category": "Коммерческий стоечно-ригельный фасад",
      "badge": "Сертификат EN-13830",
      "description": "Конструкционная фасадная система для бизнес-центров, автосалонов и элитных вилл.",
      "specs": [
        {
          "label": "Ширина профиля",
          "val": "50 мм"
        },
        {
          "label": "Каркас",
          "val": "Стоечно-ригельный"
        },
        {
          "label": "Остекление",
          "val": "Двухкамерный стеклопакет"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Подъемно-сдвижная HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Тяжелый подъемно-сдвижной ПВХ",
      "badge": "Класс герметичности 4",
      "description": "Усиленная подъемно-сдвижная конструкция, защищающая от пылевых бурь и ураганных ветров.",
      "specs": [
        {
          "label": "Глубина рамы",
          "val": "175 мм"
        },
        {
          "label": "Армирование",
          "val": "Стальной сердечник"
        },
        {
          "label": "Уплотнитель",
          "val": "Многоконтурный EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Акустик",
      "brand": "Окна и двери Winsa",
      "category": "Звукоизоляционный ПВХ класса A",
      "badge": "Звукоизоляция 44 дБ",
      "description": "Акустический профиль класса А с 5 камерами для надежной защиты от интенсивного городского шума.",
      "specs": [
        {
          "label": "Глубина профиля",
          "val": "76 мм"
        },
        {
          "label": "Камеры",
          "val": "5 камер"
        },
        {
          "label": "Шумоизоляция",
          "val": "Rw = 44 дБ"
        }
      ]
    }
  },
  "bg": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Бельгия",
      "category": "Окна и двери ПВХ Passivhaus",
      "badge": "Стандарт Passivhaus",
      "description": "Флагманская 6-камерная европейская система ПВХ для экстремальных температур свыше 50°C.",
      "specs": [
        {
          "label": "Глубина профиля",
          "val": "80 мм"
        },
        {
          "label": "Камеры",
          "val": "6 камер"
        },
        {
          "label": "Теплоизоляция",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Монументаль",
      "brand": "Системы Lorenzo",
      "category": "Теплый алюминий раздвижной",
      "badge": "Панорамное остекление",
      "description": "Архитектурная раздвижная система для панорамного остекления высотой до 3 метров с плавным ходом.",
      "specs": [
        {
          "label": "Глубина створки",
          "val": "70 мм"
        },
        {
          "label": "Вес створки",
          "val": "300 кг"
        },
        {
          "label": "Терморазрыв",
          "val": "24 мм"
        }
      ]
    },
    "curtain-50f": {
      "title": "Фасад 50F Витражный",
      "brand": "Архитектурный алюминий",
      "category": "Коммерческий стоечно-ригельный фасад",
      "badge": "Сертификат EN-13830",
      "description": "Конструкционная фасадная система для бизнес-центров, автосалонов и элитных вилл.",
      "specs": [
        {
          "label": "Ширина профиля",
          "val": "50 мм"
        },
        {
          "label": "Каркас",
          "val": "Стоечно-ригельный"
        },
        {
          "label": "Остекление",
          "val": "Двухкамерный стеклопакет"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Подъемно-сдвижная HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Тяжелый подъемно-сдвижной ПВХ",
      "badge": "Класс герметичности 4",
      "description": "Усиленная подъемно-сдвижная конструкция, защищающая от пылевых бурь и ураганных ветров.",
      "specs": [
        {
          "label": "Глубина рамы",
          "val": "175 мм"
        },
        {
          "label": "Армирование",
          "val": "Стальной сердечник"
        },
        {
          "label": "Уплотнитель",
          "val": "Многоконтурный EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Акустик",
      "brand": "Окна и двери Winsa",
      "category": "Звукоизоляционный ПВХ класса A",
      "badge": "Звукоизоляция 44 дБ",
      "description": "Акустический профиль класса А с 5 камерами для надежной защиты от интенсивного городского шума.",
      "specs": [
        {
          "label": "Глубина профиля",
          "val": "76 мм"
        },
        {
          "label": "Камеры",
          "val": "5 камер"
        },
        {
          "label": "Шумоизоляция",
          "val": "Rw = 44 дБ"
        }
      ]
    }
  },
  "kk": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Бельгия",
      "category": "Окна и двери ПВХ Passivhaus",
      "badge": "Стандарт Passivhaus",
      "description": "Флагманская 6-камерная европейская система ПВХ для экстремальных температур свыше 50°C.",
      "specs": [
        {
          "label": "Глубина профиля",
          "val": "80 мм"
        },
        {
          "label": "Камеры",
          "val": "6 камер"
        },
        {
          "label": "Теплоизоляция",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Монументаль",
      "brand": "Системы Lorenzo",
      "category": "Теплый алюминий раздвижной",
      "badge": "Панорамное остекление",
      "description": "Архитектурная раздвижная система для панорамного остекления высотой до 3 метров с плавным ходом.",
      "specs": [
        {
          "label": "Глубина створки",
          "val": "70 мм"
        },
        {
          "label": "Вес створки",
          "val": "300 кг"
        },
        {
          "label": "Терморазрыв",
          "val": "24 мм"
        }
      ]
    },
    "curtain-50f": {
      "title": "Фасад 50F Витражный",
      "brand": "Архитектурный алюминий",
      "category": "Коммерческий стоечно-ригельный фасад",
      "badge": "Сертификат EN-13830",
      "description": "Конструкционная фасадная система для бизнес-центров, автосалонов и элитных вилл.",
      "specs": [
        {
          "label": "Ширина профиля",
          "val": "50 мм"
        },
        {
          "label": "Каркас",
          "val": "Стоечно-ригельный"
        },
        {
          "label": "Остекление",
          "val": "Двухкамерный стеклопакет"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Подъемно-сдвижная HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Тяжелый подъемно-сдвижной ПВХ",
      "badge": "Класс герметичности 4",
      "description": "Усиленная подъемно-сдвижная конструкция, защищающая от пылевых бурь и ураганных ветров.",
      "specs": [
        {
          "label": "Глубина рамы",
          "val": "175 мм"
        },
        {
          "label": "Армирование",
          "val": "Стальной сердечник"
        },
        {
          "label": "Уплотнитель",
          "val": "Многоконтурный EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Акустик",
      "brand": "Окна и двери Winsa",
      "category": "Звукоизоляционный ПВХ класса A",
      "badge": "Звукоизоляция 44 дБ",
      "description": "Акустический профиль класса А с 5 камерами для надежной защиты от интенсивного городского шума.",
      "specs": [
        {
          "label": "Глубина профиля",
          "val": "76 мм"
        },
        {
          "label": "Камеры",
          "val": "5 камер"
        },
        {
          "label": "Шумоизоляция",
          "val": "Rw = 44 дБ"
        }
      ]
    }
  },
  "hr": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belgio",
      "category": "Porte e Finestre uPVC Passivhaus",
      "badge": "Standard Casa Passiva",
      "description": "Serie europea di punta in uPVC certificata per case passive, progettata con 6 camere di isolamento termico per resistere a temperature superiori a 50°C.",
      "specs": [
        {
          "label": "Profondità Profilo",
          "val": "80 mm"
        },
        {
          "label": "Geometria",
          "val": "6 Camere"
        },
        {
          "label": "Isolamento Termico",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumentale",
      "brand": "Sistemi Lorenzo",
      "category": "Alluminio Scorrevole a Taglio Termico",
      "badge": "Vetrata Panoramica",
      "description": "Sistema scorrevole architettonico per ampie vetrate dal pavimento al soffitto fino a 3 metri di altezza con scorrimento ultra-fluido.",
      "specs": [
        {
          "label": "Profondità Anta",
          "val": "70 mm"
        },
        {
          "label": "Portata Anta",
          "val": "300 kg"
        },
        {
          "label": "Barretta Poliammide",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Facciata Continua 50F per Edifici",
      "brand": "Alluminio Architettonico",
      "category": "Sistema di Facciata Continua Commerciale",
      "badge": "Certificato EN-13830",
      "description": "Sistema di facciata continua in vetro per torri commerciali, showroom di lusso e ville contemporanee in tutto il paese.",
      "specs": [
        {
          "label": "Larghezza Vista",
          "val": "50 mm"
        },
        {
          "label": "Struttura",
          "val": "Montanti e Traversi"
        },
        {
          "label": "Vetro Tecnico",
          "val": "Doppio Vetro Basso-Emissivo"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Sistema Alzante Scorrevole HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Scorrevole uPVC per Grandi Carichi",
      "badge": "Classe 4 Tenuta all'Aria",
      "description": "Ingegneria alzante scorrevole rinforzata per garantire una perfetta tenuta contro i venti caldi del deserto e le tempeste di sabbia.",
      "specs": [
        {
          "label": "Profondità Telaio",
          "val": "175 mm"
        },
        {
          "label": "Rinforzo",
          "val": "Anima in Acciaio"
        },
        {
          "label": "Tenuta Vento",
          "val": "Guarnizioni EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acustico",
      "brand": "Porte e Finestre Winsa",
      "category": "uPVC Fonoisolante Classe A",
      "badge": "Insonorizzazione 44 dB",
      "description": "Profilo acustico con spessore di parete Classe A e 5 camere interne per isolare gli interni dal forte rumore del traffico urbano.",
      "specs": [
        {
          "label": "Profondità Profilo",
          "val": "76 mm"
        },
        {
          "label": "Camere Acustiche",
          "val": "5 Camere"
        },
        {
          "label": "Barriera Rumore",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "bs": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belgio",
      "category": "Porte e Finestre uPVC Passivhaus",
      "badge": "Standard Casa Passiva",
      "description": "Serie europea di punta in uPVC certificata per case passive, progettata con 6 camere di isolamento termico per resistere a temperature superiori a 50°C.",
      "specs": [
        {
          "label": "Profondità Profilo",
          "val": "80 mm"
        },
        {
          "label": "Geometria",
          "val": "6 Camere"
        },
        {
          "label": "Isolamento Termico",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumentale",
      "brand": "Sistemi Lorenzo",
      "category": "Alluminio Scorrevole a Taglio Termico",
      "badge": "Vetrata Panoramica",
      "description": "Sistema scorrevole architettonico per ampie vetrate dal pavimento al soffitto fino a 3 metri di altezza con scorrimento ultra-fluido.",
      "specs": [
        {
          "label": "Profondità Anta",
          "val": "70 mm"
        },
        {
          "label": "Portata Anta",
          "val": "300 kg"
        },
        {
          "label": "Barretta Poliammide",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Facciata Continua 50F per Edifici",
      "brand": "Alluminio Architettonico",
      "category": "Sistema di Facciata Continua Commerciale",
      "badge": "Certificato EN-13830",
      "description": "Sistema di facciata continua in vetro per torri commerciali, showroom di lusso e ville contemporanee in tutto il paese.",
      "specs": [
        {
          "label": "Larghezza Vista",
          "val": "50 mm"
        },
        {
          "label": "Struttura",
          "val": "Montanti e Traversi"
        },
        {
          "label": "Vetro Tecnico",
          "val": "Doppio Vetro Basso-Emissivo"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Sistema Alzante Scorrevole HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Scorrevole uPVC per Grandi Carichi",
      "badge": "Classe 4 Tenuta all'Aria",
      "description": "Ingegneria alzante scorrevole rinforzata per garantire una perfetta tenuta contro i venti caldi del deserto e le tempeste di sabbia.",
      "specs": [
        {
          "label": "Profondità Telaio",
          "val": "175 mm"
        },
        {
          "label": "Rinforzo",
          "val": "Anima in Acciaio"
        },
        {
          "label": "Tenuta Vento",
          "val": "Guarnizioni EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acustico",
      "brand": "Porte e Finestre Winsa",
      "category": "uPVC Fonoisolante Classe A",
      "badge": "Insonorizzazione 44 dB",
      "description": "Profilo acustico con spessore di parete Classe A e 5 camere interne per isolare gli interni dal forte rumore del traffico urbano.",
      "specs": [
        {
          "label": "Profondità Profilo",
          "val": "76 mm"
        },
        {
          "label": "Camere Acustiche",
          "val": "5 Camere"
        },
        {
          "label": "Barriera Rumore",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "sq": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belgio",
      "category": "Porte e Finestre uPVC Passivhaus",
      "badge": "Standard Casa Passiva",
      "description": "Serie europea di punta in uPVC certificata per case passive, progettata con 6 camere di isolamento termico per resistere a temperature superiori a 50°C.",
      "specs": [
        {
          "label": "Profondità Profilo",
          "val": "80 mm"
        },
        {
          "label": "Geometria",
          "val": "6 Camere"
        },
        {
          "label": "Isolamento Termico",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumentale",
      "brand": "Sistemi Lorenzo",
      "category": "Alluminio Scorrevole a Taglio Termico",
      "badge": "Vetrata Panoramica",
      "description": "Sistema scorrevole architettonico per ampie vetrate dal pavimento al soffitto fino a 3 metri di altezza con scorrimento ultra-fluido.",
      "specs": [
        {
          "label": "Profondità Anta",
          "val": "70 mm"
        },
        {
          "label": "Portata Anta",
          "val": "300 kg"
        },
        {
          "label": "Barretta Poliammide",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Facciata Continua 50F per Edifici",
      "brand": "Alluminio Architettonico",
      "category": "Sistema di Facciata Continua Commerciale",
      "badge": "Certificato EN-13830",
      "description": "Sistema di facciata continua in vetro per torri commerciali, showroom di lusso e ville contemporanee in tutto il paese.",
      "specs": [
        {
          "label": "Larghezza Vista",
          "val": "50 mm"
        },
        {
          "label": "Struttura",
          "val": "Montanti e Traversi"
        },
        {
          "label": "Vetro Tecnico",
          "val": "Doppio Vetro Basso-Emissivo"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Sistema Alzante Scorrevole HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Scorrevole uPVC per Grandi Carichi",
      "badge": "Classe 4 Tenuta all'Aria",
      "description": "Ingegneria alzante scorrevole rinforzata per garantire una perfetta tenuta contro i venti caldi del deserto e le tempeste di sabbia.",
      "specs": [
        {
          "label": "Profondità Telaio",
          "val": "175 mm"
        },
        {
          "label": "Rinforzo",
          "val": "Anima in Acciaio"
        },
        {
          "label": "Tenuta Vento",
          "val": "Guarnizioni EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acustico",
      "brand": "Porte e Finestre Winsa",
      "category": "uPVC Fonoisolante Classe A",
      "badge": "Insonorizzazione 44 dB",
      "description": "Profilo acustico con spessore di parete Classe A e 5 camere interne per isolare gli interni dal forte rumore del traffico urbano.",
      "specs": [
        {
          "label": "Profondità Profilo",
          "val": "76 mm"
        },
        {
          "label": "Camere Acustiche",
          "val": "5 Camere"
        },
        {
          "label": "Barriera Rumore",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "el": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belgio",
      "category": "Porte e Finestre uPVC Passivhaus",
      "badge": "Standard Casa Passiva",
      "description": "Serie europea di punta in uPVC certificata per case passive, progettata con 6 camere di isolamento termico per resistere a temperature superiori a 50°C.",
      "specs": [
        {
          "label": "Profondità Profilo",
          "val": "80 mm"
        },
        {
          "label": "Geometria",
          "val": "6 Camere"
        },
        {
          "label": "Isolamento Termico",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumentale",
      "brand": "Sistemi Lorenzo",
      "category": "Alluminio Scorrevole a Taglio Termico",
      "badge": "Vetrata Panoramica",
      "description": "Sistema scorrevole architettonico per ampie vetrate dal pavimento al soffitto fino a 3 metri di altezza con scorrimento ultra-fluido.",
      "specs": [
        {
          "label": "Profondità Anta",
          "val": "70 mm"
        },
        {
          "label": "Portata Anta",
          "val": "300 kg"
        },
        {
          "label": "Barretta Poliammide",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Facciata Continua 50F per Edifici",
      "brand": "Alluminio Architettonico",
      "category": "Sistema di Facciata Continua Commerciale",
      "badge": "Certificato EN-13830",
      "description": "Sistema di facciata continua in vetro per torri commerciali, showroom di lusso e ville contemporanee in tutto il paese.",
      "specs": [
        {
          "label": "Larghezza Vista",
          "val": "50 mm"
        },
        {
          "label": "Struttura",
          "val": "Montanti e Traversi"
        },
        {
          "label": "Vetro Tecnico",
          "val": "Doppio Vetro Basso-Emissivo"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Sistema Alzante Scorrevole HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Scorrevole uPVC per Grandi Carichi",
      "badge": "Classe 4 Tenuta all'Aria",
      "description": "Ingegneria alzante scorrevole rinforzata per garantire una perfetta tenuta contro i venti caldi del deserto e le tempeste di sabbia.",
      "specs": [
        {
          "label": "Profondità Telaio",
          "val": "175 mm"
        },
        {
          "label": "Rinforzo",
          "val": "Anima in Acciaio"
        },
        {
          "label": "Tenuta Vento",
          "val": "Guarnizioni EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Acustico",
      "brand": "Porte e Finestre Winsa",
      "category": "uPVC Fonoisolante Classe A",
      "badge": "Insonorizzazione 44 dB",
      "description": "Profilo acustico con spessore di parete Classe A e 5 camere interne per isolare gli interni dal forte rumore del traffico urbano.",
      "specs": [
        {
          "label": "Profondità Profilo",
          "val": "76 mm"
        },
        {
          "label": "Camere Acustiche",
          "val": "5 Camere"
        },
        {
          "label": "Barriera Rumore",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "sv": {
    "legend-80": {
      "title": "Deceuninck Legend 80",
      "brand": "Deceuninck Belgien",
      "category": "Passivhaus uPVC Fenster & Türen",
      "badge": "Passivhaus-Standard",
      "description": "Europäisches Premium-uPVC-System mit 6 Isolierkammern, entwickelt für extreme Hitzeperioden über 50°C.",
      "specs": [
        {
          "label": "Profiltiefe",
          "val": "80 mm"
        },
        {
          "label": "Kammeraufbau",
          "val": "6 Kammern"
        },
        {
          "label": "Wärmedämmung",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS Monumental",
      "brand": "Lorenzo Systeme",
      "category": "Thermisches Aluminium-Schiebesystem",
      "badge": "Panoramaglasung",
      "description": "Architektonisches Schiebesystem für raumhohe Glasfronten bis 3 m Höhe mit federleichtem Laufkomfort.",
      "specs": [
        {
          "label": "Flügeltiefe",
          "val": "70 mm"
        },
        {
          "label": "Flügelgewicht",
          "val": "300 kg"
        },
        {
          "label": "Polyamidsteg",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Pfosten-Riegel-Fassade 50F",
      "brand": "Architektur-Aluminium",
      "category": "Gewerbliche Glasfassadensysteme",
      "badge": "EN-13830 Zertifiziert",
      "description": "Strukturelles Glasfassadensystem für Gewerbetürme, exklusive Showrooms und moderne Luxusvillen.",
      "specs": [
        {
          "label": "Ansichtsbreite",
          "val": "50 mm"
        },
        {
          "label": "Konstruktion",
          "val": "Pfosten-Riegel-Raster"
        },
        {
          "label": "Isolierverglasung",
          "val": "Zweifach Low-E"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Hebeschiebe-System HS76",
      "brand": "Deceuninck / Winsa",
      "category": "Hochbelastbares uPVC Schiebesystem",
      "badge": "Klasse 4 Luftdicht",
      "description": "Massives Hebeschiebesystem für perfekten Schutz vor Wüstenwinden und saisonalen Sandstürmen.",
      "specs": [
        {
          "label": "Rahmentiefe",
          "val": "175 mm"
        },
        {
          "label": "Verstärkung",
          "val": "Stahlkern"
        },
        {
          "label": "Dichtsystem",
          "val": "Mehrfach EPDM"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 Akustik",
      "brand": "Winsa Fenster & Türen",
      "category": "Klasse A Schallschutz uPVC",
      "badge": "44 dB Schallschutz",
      "description": "Akustikprofil der Wanddickenklasse A mit 5 Innenkammern zur Schallisolation von Stadtverkehrslärm.",
      "specs": [
        {
          "label": "Profiltiefe",
          "val": "76 mm"
        },
        {
          "label": "Schallschutz-Kammern",
          "val": "5 Kammern"
        },
        {
          "label": "Schallschutzwert",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "hi": {
    "legend-80": {
      "title": "比利时 Deceuninck Legend 80",
      "brand": "Deceuninck 比利时原厂",
      "category": "被动房高隔热 uPVC 门窗系统",
      "badge": "德国被动房认证",
      "description": "欧洲旗舰级6腔体超高隔热系统，专为抵御50°C以上极限炎热酷暑而设计。",
      "specs": [
        {
          "label": "型材深度",
          "val": "80 mm"
        },
        {
          "label": "腔体结构",
          "val": "6 腔体"
        },
        {
          "label": "传热系数",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS 极简全景推拉门",
      "brand": "Lorenzo 欧洲建筑系统",
      "category": "断桥隔热超重型提升推拉门",
      "badge": "全景落地视野",
      "description": "顶级全景推拉系统，支持单扇高逾3米巨幅落地玻璃，轻巧顺滑如丝。",
      "specs": [
        {
          "label": "扇料厚度",
          "val": "70 mm"
        },
        {
          "label": "最大承重",
          "val": "300 kg"
        },
        {
          "label": "隔热条规格",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Façade 50F 建筑玻璃幕墙系统",
      "brand": "高标建筑铝型材",
      "category": "商业与豪宅玻璃幕墙系统",
      "badge": "欧盟 EN-13830 认证",
      "description": "高强度立柱横梁式幕墙系统，广泛应用于地标写字楼、豪车展厅和现代别墅。",
      "specs": [
        {
          "label": "外立面可视宽",
          "val": "50 mm"
        },
        {
          "label": "结构形式",
          "val": "龙骨网格"
        },
        {
          "label": "玻璃配置",
          "val": "双银 Low-E 中空玻璃"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Hebe-Schiebe HS76 提升推拉门",
      "brand": "Deceuninck / Winsa",
      "category": "重型密封 uPVC 提升推拉门",
      "badge": "4级超高气密性",
      "description": "重型提升开启结构，在遭遇干燥强风与沙尘暴天气时提供极致密封隔绝。",
      "specs": [
        {
          "label": "外框深度",
          "val": "175 mm"
        },
        {
          "label": "加强衬钢",
          "val": "热镀锌加厚钢衬"
        },
        {
          "label": "密封配置",
          "val": "三元乙丙多道密封"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 顶级隔音系统",
      "brand": "Winsa 欧洲门窗",
      "category": "A级壁厚专业静音 uPVC 系统",
      "badge": "44 dB 录音棚级降噪",
      "description": "A级壁厚5腔体声学构型，有效隔绝繁杂车流声与工业喧嚣，营造安宁空间。",
      "specs": [
        {
          "label": "型材厚度",
          "val": "76 mm"
        },
        {
          "label": "隔音腔室",
          "val": "5 腔室"
        },
        {
          "label": "计权隔声量",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "ja": {
    "legend-80": {
      "title": "比利时 Deceuninck Legend 80",
      "brand": "Deceuninck 比利时原厂",
      "category": "被动房高隔热 uPVC 门窗系统",
      "badge": "德国被动房认证",
      "description": "欧洲旗舰级6腔体超高隔热系统，专为抵御50°C以上极限炎热酷暑而设计。",
      "specs": [
        {
          "label": "型材深度",
          "val": "80 mm"
        },
        {
          "label": "腔体结构",
          "val": "6 腔体"
        },
        {
          "label": "传热系数",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS 极简全景推拉门",
      "brand": "Lorenzo 欧洲建筑系统",
      "category": "断桥隔热超重型提升推拉门",
      "badge": "全景落地视野",
      "description": "顶级全景推拉系统，支持单扇高逾3米巨幅落地玻璃，轻巧顺滑如丝。",
      "specs": [
        {
          "label": "扇料厚度",
          "val": "70 mm"
        },
        {
          "label": "最大承重",
          "val": "300 kg"
        },
        {
          "label": "隔热条规格",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Façade 50F 建筑玻璃幕墙系统",
      "brand": "高标建筑铝型材",
      "category": "商业与豪宅玻璃幕墙系统",
      "badge": "欧盟 EN-13830 认证",
      "description": "高强度立柱横梁式幕墙系统，广泛应用于地标写字楼、豪车展厅和现代别墅。",
      "specs": [
        {
          "label": "外立面可视宽",
          "val": "50 mm"
        },
        {
          "label": "结构形式",
          "val": "龙骨网格"
        },
        {
          "label": "玻璃配置",
          "val": "双银 Low-E 中空玻璃"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Hebe-Schiebe HS76 提升推拉门",
      "brand": "Deceuninck / Winsa",
      "category": "重型密封 uPVC 提升推拉门",
      "badge": "4级超高气密性",
      "description": "重型提升开启结构，在遭遇干燥强风与沙尘暴天气时提供极致密封隔绝。",
      "specs": [
        {
          "label": "外框深度",
          "val": "175 mm"
        },
        {
          "label": "加强衬钢",
          "val": "热镀锌加厚钢衬"
        },
        {
          "label": "密封配置",
          "val": "三元乙丙多道密封"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 顶级隔音系统",
      "brand": "Winsa 欧洲门窗",
      "category": "A级壁厚专业静音 uPVC 系统",
      "badge": "44 dB 录音棚级降噪",
      "description": "A级壁厚5腔体声学构型，有效隔绝繁杂车流声与工业喧嚣，营造安宁空间。",
      "specs": [
        {
          "label": "型材厚度",
          "val": "76 mm"
        },
        {
          "label": "隔音腔室",
          "val": "5 腔室"
        },
        {
          "label": "计权隔声量",
          "val": "Rw = 44 dB"
        }
      ]
    }
  },
  "ko": {
    "legend-80": {
      "title": "比利时 Deceuninck Legend 80",
      "brand": "Deceuninck 比利时原厂",
      "category": "被动房高隔热 uPVC 门窗系统",
      "badge": "德国被动房认证",
      "description": "欧洲旗舰级6腔体超高隔热系统，专为抵御50°C以上极限炎热酷暑而设计。",
      "specs": [
        {
          "label": "型材深度",
          "val": "80 mm"
        },
        {
          "label": "腔体结构",
          "val": "6 腔体"
        },
        {
          "label": "传热系数",
          "val": "Uf 0.92"
        }
      ]
    },
    "lorenzo-70ls": {
      "title": "Lorenzoline 70LS 极简全景推拉门",
      "brand": "Lorenzo 欧洲建筑系统",
      "category": "断桥隔热超重型提升推拉门",
      "badge": "全景落地视野",
      "description": "顶级全景推拉系统，支持单扇高逾3米巨幅落地玻璃，轻巧顺滑如丝。",
      "specs": [
        {
          "label": "扇料厚度",
          "val": "70 mm"
        },
        {
          "label": "最大承重",
          "val": "300 kg"
        },
        {
          "label": "隔热条规格",
          "val": "24 mm"
        }
      ]
    },
    "curtain-50f": {
      "title": "Façade 50F 建筑玻璃幕墙系统",
      "brand": "高标建筑铝型材",
      "category": "商业与豪宅玻璃幕墙系统",
      "badge": "欧盟 EN-13830 认证",
      "description": "高强度立柱横梁式幕墙系统，广泛应用于地标写字楼、豪车展厅和现代别墅。",
      "specs": [
        {
          "label": "外立面可视宽",
          "val": "50 mm"
        },
        {
          "label": "结构形式",
          "val": "龙骨网格"
        },
        {
          "label": "玻璃配置",
          "val": "双银 Low-E 中空玻璃"
        }
      ]
    },
    "hs76-sliding": {
      "title": "Hebe-Schiebe HS76 提升推拉门",
      "brand": "Deceuninck / Winsa",
      "category": "重型密封 uPVC 提升推拉门",
      "badge": "4级超高气密性",
      "description": "重型提升开启结构，在遭遇干燥强风与沙尘暴天气时提供极致密封隔绝。",
      "specs": [
        {
          "label": "外框深度",
          "val": "175 mm"
        },
        {
          "label": "加强衬钢",
          "val": "热镀锌加厚钢衬"
        },
        {
          "label": "密封配置",
          "val": "三元乙丙多道密封"
        }
      ]
    },
    "winsa-dorado-76": {
      "title": "Winsa Dorado 76 顶级隔音系统",
      "brand": "Winsa 欧洲门窗",
      "category": "A级壁厚专业静音 uPVC 系统",
      "badge": "44 dB 录音棚级降噪",
      "description": "A级壁厚5腔体声学构型，有效隔绝繁杂车流声与工业喧嚣，营造安宁空间。",
      "specs": [
        {
          "label": "型材厚度",
          "val": "76 mm"
        },
        {
          "label": "隔音腔室",
          "val": "5 腔室"
        },
        {
          "label": "计权隔声量",
          "val": "Rw = 44 dB"
        }
      ]
    }
  }
};

export const SignatureShowcase: React.FC<SignatureShowcaseProps> = ({
  onSelectProduct,
  onSelectProductByName,
  onOpenQuote,
  onOpenQuoteModal
}) => {
  const { currentLanguage } = useLanguage();
  const baseLang = currentLanguage.code.split('-')[0];
  const localized =
    SHOWCASE_TEXT_BY_LANG[currentLanguage.code] ||
    SHOWCASE_TEXT_BY_LANG[baseLang] ||
    SHOWCASE_TEXT_BY_LANG.en;
  const itemLocales =
    ITEM_LOCALES[currentLanguage.code] ||
    ITEM_LOCALES[baseLang] ||
    {};
  const [cmsMedia, setCmsMedia] = React.useState<{ showcaseProductIds?: Record<string, string>; showcaseImages?: Record<string, string>; showcaseContent?: Record<string, { title?: string; subtitle?: string; description?: string }>; showcaseContentByLanguage?: Record<string, Record<string, { title?: string; subtitle?: string; description?: string }>>; showcaseSectionText?: Record<string, { title?: string; subtitle?: string }> } | null>(() => {
    try { return JSON.parse(localStorage.getItem('winhome_cms_homepage_media') || 'null'); } catch { return null; }
  });
  React.useEffect(() => {
    const sync = () => {
      try { setCmsMedia(JSON.parse(localStorage.getItem('winhome_cms_homepage_media') || 'null')); } catch { /* Keep current cards. */ }
    };
    window.addEventListener('cms_homepage_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('cms_homepage_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const sectionText = cmsMedia?.showcaseSectionText?.[currentLanguage.code] || cmsMedia?.showcaseSectionText?.[baseLang] || (cmsMedia?.showcaseProductIds ? cmsMedia?.showcaseSectionText?.en : undefined);
  const sectionTitle = sectionText?.title?.trim() || localized.title;
  const sectionSubtitle = sectionText?.subtitle?.trim() || localized.subtitle;

  const showcaseItems = React.useMemo(() => {
    const customImages = cmsMedia?.showcaseImages || {};
    const rawItems = [
      {
        id: 'legend-80',
        title: 'Deceuninck Legend 80',
        shortName: 'Legend 80',
        category: 'Passive uPVC Window & Door',
        brand: 'Deceuninck Belgium',
        image: customImages['legend-80'] || './assets/doorhome/10.png',
        fallbackImage: './assets/doorhome/photo_2023-07-03_15-41-20-1280x820.jpg',
        badge: 'Passive House Standard',
        description: 'Flagship European passive-certified uPVC series engineered with 6 insulation chambers to withstand heat over 50°C.',
        specs: [
          { label: 'Profile Depth', val: '80 mm' },
          { label: 'Structure', val: '6 Chambers' },
          { label: 'Insulation', val: 'Uf 0.92 W/m²K' }
        ]
      },
      {
        id: 'lorenzo-70ls',
        title: 'Lorenzoline 70LS Monumental',
        shortName: 'Lorenzo 70LS',
        category: 'Thermal Lift & Slide Aluminum',
        brand: 'Lorenzoline Systems',
        image: customImages['lorenzo-70ls'] || './assets/doorhome/LIFT-SLIDE-70LS-Medium-300x300.jpeg',
        fallbackImage: './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        badge: 'Monumental Glazing',
        description: 'Architectural sliding system enabling panoramic floor-to-ceiling glass spans up to 3 meters with finger-touch glide.',
        specs: [
          { label: 'Leaf Depth', val: '70 mm' },
          { label: 'Max Load', val: '300 kg / Leaf' },
          { label: 'Thermal Break', val: 'Polyamide 24mm' }
        ]
      },
      {
        id: 'curtain-50f',
        title: 'Façade 50F Curtain Wall',
        shortName: 'Façade 50F',
        category: 'Commercial Facade System',
        brand: 'Architectural Aluminum',
        image: customImages['curtain-50f'] || './assets/doorhome/24-1.jpg',
        fallbackImage: './assets/doorhome/photo_2023-07-03_15-42-28-1120x716.jpg',
        badge: 'EN-13830 Certified',
        description: 'Structural mullion facade system fabricated for corporate towers, automobile showrooms, and luxury modern villas across Iraq.',
        specs: [
          { label: 'Sightline', val: '50 mm' },
          { label: 'Structure', val: 'Mullion Grid' },
          { label: 'Glass Specs', val: 'Structural Double' }
        ]
      },
      {
        id: 'hs76-sliding',
        title: 'Hebe-Schiebe HS76 System',
        shortName: 'HS76 Sliding',
        category: 'Heavy-Duty uPVC Sliding',
        brand: 'Deceuninck / Winsa',
        image: customImages['hs76-sliding'] || './assets/doorhome/photo_2023-07-03_15-40-04-1104x720.jpg',
        fallbackImage: './assets/doorhome/2-1.png',
        badge: 'Class 4 Airtight',
        description: 'Heavyweight lift-and-slide engineering delivering airtight sealing against high-velocity dry desert winds and seasonal sandstorms.',
        specs: [
          { label: 'Frame Depth', val: '175 mm' },
          { label: 'Reinforcement', val: 'Steel Core' },
          { label: 'Wind Seal', val: 'Multi EPDM' }
        ]
      },
      {
        id: 'winsa-dorado-76',
        title: 'Winsa Dorado 76 Acoustic',
        shortName: 'Dorado 76',
        category: 'Class A Soundproof uPVC',
        brand: 'Winsa Windows & Doors',
        image: customImages['winsa-dorado-76'] || './assets/doorhome/2-1.png',
        fallbackImage: './assets/doorhome/photo_2023-07-03_15-41-20-1280x820.jpg',
        badge: 'Sound Proof 44 dB',
        description: 'Class A wall-thickness acoustic profile with multi-chamber interior baffling to isolate indoor spaces from heavy city traffic noise.',
        specs: [
          { label: 'Profile Depth', val: '76 mm' },
          { label: 'Acoustic Baffle', val: '5 Chambers' },
          { label: 'Noise Barrier', val: 'Rw = 44 dB' }
        ]
      }
    ];

    return rawItems.map((item) => {
      const loc = itemLocales[item.id];
      const localizedOverride = cmsMedia?.showcaseContentByLanguage?.[currentLanguage.code]?.[item.id]
        || cmsMedia?.showcaseContentByLanguage?.[baseLang]?.[item.id];
      const globalOverride = cmsMedia?.showcaseContent?.[item.id];
      return {
        ...item,
        title: localizedOverride?.title || globalOverride?.title || loc?.title || item.title,
        subtitle: localizedOverride?.subtitle || globalOverride?.subtitle,
        brand: cmsMedia?.showcaseProductIds?.[item.id] ? 'Doorhome' : loc?.brand || item.brand,
        category: cmsMedia?.showcaseProductIds?.[item.id] ? (localizedOverride?.subtitle || globalOverride?.subtitle || '') : loc?.category || item.category,
        badge: cmsMedia?.showcaseProductIds?.[item.id] ? '' : loc?.badge || item.badge,
        description: localizedOverride?.description || globalOverride?.description || loc?.description || item.description,
        specs: cmsMedia?.showcaseProductIds?.[item.id] ? [] : loc?.specs || item.specs
      };
    });
  }, [cmsMedia, itemLocales, currentLanguage.code, baseLang]);

  const handleSelectProduct = (title: string, id: string) => {
    if (onSelectProduct) {
      const linkedId = cmsMedia?.showcaseProductIds?.[id];
      if (linkedId) {
        const linkedProduct = loadLocalProducts().find((product) => product.id === linkedId);
        if (linkedProduct) { onSelectProduct(linkedProduct); return; }
      }
      const allProducts = [...UPVC_PRODUCTS, ...ALUMINUM_PRODUCTS];
      const found = allProducts.find(
        (p) => p.id === id || p.name.toLowerCase().includes(title.toLowerCase().slice(0, 10))
      );
      if (found) {
        onSelectProduct(found);
        return;
      }
      const item = showcaseItems.find((s) => s.id === id || s.title === title);
      if (item) {
        onSelectProduct({
          id: item.id,
          name: item.title,
          category: item.category.toLowerCase().includes('aluminum') ? 'aluminum' : 'upvc',
          image: item.image,
          fallbackImage: item.fallbackImage,
          description: item.description,
          depth: item.specs[0]?.val || '',
          insulationValue: item.specs[2]?.val || '',
          features: [
            `${item.brand} certified profile extrusion`,
            `${item.specs[0]?.label}: ${item.specs[0]?.val}`,
            `${item.specs[1]?.label}: ${item.specs[1]?.val}`,
            `${item.specs[2]?.label}: ${item.specs[2]?.val}`,
            'Class S severe climate resistance'
          ]
        });
        return;
      }
    }
    if (onSelectProductByName) {
      onSelectProductByName(title);
    }
  };

  const handleOpenQuoteCall = (productTitle?: string) => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal(productTitle);
    } else if (onOpenQuote) {
      onOpenQuote(productTitle || '');
    }
  };

  return (
    <section
      id="typology"
      data-section="signature-systems"
      className="scroll-mt-24 pt-6 sm:pt-8 pb-4 sm:pb-12 border-b border-slate-200 relative"
    >
      {/* Fixed background image layer for smooth parallax/fixed texture on scroll */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none"
        style={{ backgroundImage: "url('./assets/doorhome/bg.jpeg')" }}
      />

      {/* Light translucent overlay so bg.jpeg texture is rich & clearly visible */}
      <div className="absolute inset-0 bg-white/25 backdrop-blur-[1px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 1. MOBILE/TABLET VIEW: Smooth Hardware-Accelerated Sticky Stacking (< lg) */}
        <div className="block lg:hidden">
          {/* Mobile Header */}
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {sectionTitle}
            </h2>

            <p className="text-xs sm:text-base text-slate-600 font-medium leading-relaxed mt-2">
              {sectionSubtitle}
            </p>
          </div>

          {/* Mobile Sticky Card Stacking Deck */}
          <div className="relative pb-10">
            {showcaseItems.map((item, idx) => (
              <div
                key={item.id}
                className="sticky transition-all duration-150"
                style={{
                  top: `calc(72px + ${idx * 16}px)`,
                  zIndex: idx + 10,
                  marginBottom: idx < showcaseItems.length - 1 ? '160px' : '20px'
                }}
              >
                <div className="bg-white border border-slate-200/90 p-5 rounded-3xl shadow-2xl shadow-slate-900/15 space-y-3.5">
                  {/* Card Header Row */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-[10px] font-black text-red-700 bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-100 shrink-0">
                        {item.brand}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 truncate">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded-full shrink-0">
                      {item.badge}
                    </span>
                  </div>

                  {/* Product Image Stage */}
                  <div className="relative h-40 w-full bg-slate-50 rounded-2xl p-3 flex items-center justify-center border border-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain drop-shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = item.fallbackImage;
                      }}
                    />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Clean 3-Column Specs Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                    {item.specs.map((spec, i) => (
                      <div key={i} className="text-center px-1">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider truncate">
                          {spec.label}
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 block mt-0.5 truncate">
                          {spec.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Single Action Button (Removed Estimate Cost button) */}
                  <div className="pt-1.5">
                    <button
                      onClick={() => handleSelectProduct(item.title, item.id)}
                      className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-red-600/25 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{localized.specsBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. DESKTOP / LAPTOP VIEW: Side-by-Side Unified Grid (>= lg) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 lg:gap-12 items-start pt-1">
          {/* Left Column: Title Header + 5 Profile Bullets (Aligned to left edge) */}
          <div className="col-span-6 space-y-5">
            {/* Title Header */}
            <div className="dh-reveal">
              <h2 className="text-3xl xl:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {sectionTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-2.5 max-w-xl">
                {sectionSubtitle}
              </p>
            </div>

            {/* 5 Bullet Cards with comfortable gap */}
            <div className="space-y-3">
              {showcaseItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectProduct(item.title, item.id)}
                  className={`w-full text-left py-3 px-4 rounded-2xl bg-white/80 backdrop-blur-md hover:bg-white transition-all border border-slate-200/80 hover:border-red-400 shadow-xs hover:shadow-md flex items-center justify-between text-xs group cursor-pointer dh-card-hover dh-reveal dh-stagger-${idx + 1}`}
                >
                  <div>
                    <span className="font-bold text-slate-900 block text-sm sm:text-base group-hover:text-red-600 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-slate-500 text-[11px] font-medium mt-0.5 block">
                      {item.subtitle || `${item.brand} • ${item.category}`}
                    </span>
                  </div>

                  <span className="text-red-600 font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>{item.specs[0]?.val}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: 3D CardSwap Deck */}
          <div className="col-span-6 flex justify-end items-start pt-6 lg:pt-4 pl-4 lg:pl-8">
            <div className="relative w-full max-w-[400px] h-[460px] flex items-center justify-end">
              <CardSwap
                width={370}
                height={420}
                cardDistance={28}
                verticalDistance={22}
                delay={4000}
                pauseOnHover={true}
              >
                {showcaseItems.map((item) => (
                  <Card
                    key={item.id}
                    className="p-5 flex flex-col justify-between bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden cursor-pointer group"
                    onClick={() => handleSelectProduct(item.title, item.id)}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
                        <span className="text-[10px] font-black text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {item.brand}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {item.category}
                        </span>
                      </div>

                      <div className="relative h-44 w-full bg-slate-50 rounded-2xl overflow-hidden mb-3 p-2 flex items-center justify-center border border-slate-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = item.fallbackImage;
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-snug line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <div className="grid grid-cols-3 gap-1.5 text-center text-xs mb-3 bg-slate-50 p-2 rounded-xl">
                        {item.specs.map((spec, i) => (
                          <div key={i}>
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">{spec.label}</span>
                            <span className="font-extrabold text-slate-800 text-[11px] truncate block">{spec.val}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-red-600 font-bold group-hover:translate-x-1 transition-transform">
                        <span>{localized.inspectHint}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
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
