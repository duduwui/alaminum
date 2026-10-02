import React, { useEffect, useState } from 'react';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import mobileHeroImage from '../../ChatGPT Image Sep 25, 2026, 08_37_12 AM.png';
import desktopHeroImage from '../../ChatGPT Image Sep 25, 2026, 08_35_55 AM.png';

interface HeroSectionProps {
  onOpenQuoteModal?: () => void;
  onExploreProducts?: () => void;
}

const HERO_QUOTES_BY_LANG: Record<string, string[]> = {
  "en": [
    "Modern architectural design.",
    "Smart fenestration solutions.",
    "Reliable European quality.",
    "Extreme 50°C climate protection.",
    "Precision CNC fabrication."
  ],
  "en-GB": [
    "Modern architectural design.",
    "Smart fenestration solutions.",
    "Reliable European quality.",
    "Extreme 50°C climate protection.",
    "Precision CNC fabrication."
  ],
  "en-US": [
    "Modern architectural design.",
    "Smart fenestration solutions.",
    "Reliable European quality.",
    "Extreme 50°C climate protection.",
    "Precision CNC fabrication."
  ],
  "ar": [
    "تصميم معماري عصري وحديث.",
    "حلول هندسية ذكية للأبواب والنوافذ.",
    "جودة أوروبية موثوقة ومعتمدة.",
    "حماية فائقة في درجات حرارة 50°م.",
    "تصنيع دقيق بتقنية CNC في أربيل."
  ],
  "ckb": [
    "نەخشەسازی تەلارسازیی مۆدێرن.",
    "چارەسەری زیرەکی پەنجەرە و دەرگا.",
    "کوالێتی باوەڕپێکراوی ئەوروپی.",
    "پاراستنی تەواو لە پلەی گەرمای ٥٠°C.",
    "دروستکراوی ورد بە سی ئێن سی لە هەولێر."
  ],
  "kmr": [
    "Sêwirana mîmarî ya nûjen.",
    "Çareseriyên derî û pencereyên jîr.",
    "Kalîteya ewropî ya pêbawer.",
    "Parastina tevahî ji germahiya 50°C.",
    "Hilberîna rast a CNC li Hewlêrê."
  ],
  "tr": [
    "Modern mimari tasarım.",
    "Akıllı kapı ve pencere sistemleri.",
    "Güvenilir Avrupa kalitesi.",
    "50°C aşırı iklim koruması.",
    "Yüksek hassasiyetli CNC üretimi."
  ],
  "de": [
    "Modernes architektonisches Design.",
    "Intelligente Fenster- & Türsysteme.",
    "Zuverlässige europäische Qualität.",
    "Extremer 50°C Klimaschutz.",
    "Präzise CNC-Fertigung."
  ],
  "fr": [
    "Design architectural moderne.",
    "Solutions intelligentes pour portes et fenêtres.",
    "Qualité européenne certifiée.",
    "Protection thermique extrême jusqu'à 50°C.",
    "Fabrication de précision sur CNC."
  ],
  "it": [
    "Design architettonico moderno.",
    "Soluzioni intelligenti per porte e finestre.",
    "Affidabile qualità europea.",
    "Protezione climatica estrema a 50°C.",
    "Produzione CNC di alta precisione."
  ],
  "es": [
    "Diseño arquitectónico moderno.",
    "Soluciones inteligentes de carpintería.",
    "Calidad europea certificada.",
    "Protección climática extrema a 50°C.",
    "Fabricación de precisión CNC."
  ],
  "es-MX": [
    "Diseño arquitectónico moderno.",
    "Soluciones inteligentes de cancelería.",
    "Calidad europea certificada.",
    "Protección climática extrema a 50°C.",
    "Fabricación de precisión CNC."
  ],
  "pt": [
    "Design arquitetónico moderno.",
    "Soluções inteligentes de caixilharia.",
    "Qualidade europeia certificada.",
    "Proteção climática extrema até 50°C.",
    "Fabrico CNC de alta precisão."
  ],
  "pt-BR": [
    "Design arquitetônico moderno.",
    "Soluções inteligentes de esquadrias.",
    "Qualidade europeia certificada.",
    "Proteção climática extrema até 50°C.",
    "Fabricação CNC de alta precisão."
  ],
  "fa": [
    "طراحی مدرن معماری.",
    "راهکارهای هوشمند درب و پنجره.",
    "کیفیت معتبر و تضمین‌شده اروپایی.",
    "مقاومت کامل در برابر گرمای بالای ۵۰ درجه.",
    "تولید دقیق با دستگاه‌های CNC مدرن."
  ],
  "ru": [
    "Современный архитектурный дизайн.",
    "Умные решения для окон и дверей.",
    "Надежное европейское качество.",
    "Защита от экстремальной жары до 50°C.",
    "Высокоточное производство на ЧПУ."
  ],
  "zh-CN": [
    "现代前沿建筑设计。",
    "智能门窗工程系统。",
    "值得信赖的纯正欧洲品质。",
    "抵御50°C严苛极端气候。",
    "高精度CNC智能数控智造。"
  ],
  "nl": [
    "Modern architectonisch design.",
    "Slimme kozijnoplossingen.",
    "Betrouwbare Europese kwaliteit.",
    "Extreme 50°C klimaatbescherming.",
    "Uiterst nauwkeurige CNC-productie."
  ],
  "pl": [
    "Nowoczesny design architektoniczny.",
    "Inteligentne rozwiązania stolarki otworowej.",
    "Niezawodna europejska jakość.",
    "Ochrona przed ekstremalnymi upałami 50°C.",
    "Precyzyjna produkcja CNC."
  ],
  "ro": [
    "Design arhitectural modern.",
    "Soluții inteligente pentru uși și ferestre.",
    "Calitate europeană certificată.",
    "Protecție climatică extremă la 50°C.",
    "Producție de precizie pe CNC."
  ],
  "el": [
    "Μοντέρνος αρχιτεκτονικός σχεδιασμός.",
    "Έξυπνες λύσεις για πόρτες και παράθυρα.",
    "Αξιόπιστη ευρωπαϊκή ποιότητα.",
    "Προστασία από ακραίο κλίμα 50°C.",
    "Κατασκευή ακριβείας με CNC."
  ],
  "sv": [
    "Modern arkitektonisk design.",
    "Smarta fönster- och dörrlösningar.",
    "Pålitlig europeisk kvalitet.",
    "Skydd mot extrema temperaturer upp till 50°C.",
    "Högprecisionstillverkning med CNC."
  ],
  "hi": [
    "आधुनिक वास्तुशिल्प डिजाइन।",
    "स्मार्ट खिड़की और दरवाजे के समाधान।",
    "विश्वसनीय यूरोपीय गुणवत्ता।",
    "50 डिग्री सेल्सियस अत्यधिक जलवायु सुरक्षा।",
    "सटीक सीएनसी निर्माण।"
  ],
  "ja": [
    "モダンな建築デザイン。",
    "スマートな窓・ドアソリューション。",
    "信頼のヨーロッパ品質。",
    "50°Cの過酷な気候に対応する断熱性。",
    "高精度CNC加工技術。"
  ],
  "ko": [
    "모던한 건축 디자인.",
    "스마트 창호 엔지니어링 솔루션.",
    "신뢰할 수 있는 유럽 최고급 품질.",
    "50°C 극한 기후 단열 보호.",
    "정밀 CNC 로봇 가공."
  ],
  "kk": [
    "Заманауи сәулеттік дизайн.",
    "Терезе мен есіктің ақылды шешімдері.",
    "Сенімді еуропалық сапа.",
    "50°C төтенше климаттан қорғау.",
    "CNC жоғары дәлдіктегі өндірісі."
  ],
  "sr": [
    "Модеран архитектонски дизајн.",
    "Паметна решења за прозоре и врата.",
    "Поуздан европски квалитет.",
    "Заштита од екстремних климатских услова до 50°C.",
    "Високопрецизна CNC производња."
  ],
  "hr": [
    "Moderan arhitektonski dizajn.",
    "Pametna rješenja za prozore i vrata.",
    "Pouzdana europska kvaliteta.",
    "Zaštita od ekstremne klime do 50°C.",
    "Visokoprecizna CNC proizvodnja."
  ],
  "bs": [
    "Moderan arhitektonski dizajn.",
    "Pametna rješenja za prozore i vrata.",
    "Pouzdana evropska kvaliteta.",
    "Zaštita od ekstremne klime do 50°C.",
    "Visokoprecizna CNC proizvodnja."
  ],
  "sq": [
    "Dizajn modern arkitekturor.",
    "Zgjidhje inteligjente për dyer dhe dritare.",
    "Cilësi e besueshme evropiane.",
    "Mbrojtje nga klima ekstreme 50°C.",
    "Prodhimi me precizion të lartë CNC."
  ],
  "bg": [
    "Модерен архитектурен дизайн.",
    "Интелигентни решения за врати и прозорци.",
    "Надеждно европейско качество.",
    "Защита от екстремни температури до 50°C.",
    "Прецизно CNC производство."
  ]
};

const HERO_CONTENT_BY_LANG: Record<string, { title: string; exploreBtn: string }> = {
  "en": {
    "title": "European Fenestration & Architectural Systems",
    "exploreBtn": "See All Products"
  },
  "en-GB": {
    "title": "European Fenestration & Architectural Systems",
    "exploreBtn": "See All Products"
  },
  "en-US": {
    "title": "European Fenestration & Architectural Systems",
    "exploreBtn": "See All Products"
  },
  "ar": {
    "title": "الأنظمة المعمارية والأبواب والنوافذ الأوروبية",
    "exploreBtn": "تصفح جميع المنتجات"
  },
  "ckb": {
    "title": "سیستەمی ئەندازیاری پەنجەرە و دەرگای ئەوروپی",
    "exploreBtn": "بینینی هەموو بەرهەمەکان"
  },
  "kmr": {
    "title": "Pergalên Mîmarî û Pencereyên Ewropî",
    "exploreBtn": "Hemû Berheman Bibîne"
  },
  "tr": {
    "title": "Avrupa Doğrama ve Mimari Sistemleri",
    "exploreBtn": "Tüm Ürünleri İnceleyin"
  },
  "de": {
    "title": "Europäische Fenster- & Architektursysteme",
    "exploreBtn": "Alle Produkte anzeigen"
  },
  "fr": {
    "title": "Systèmes de Menuiserie et d'Architecture Européens",
    "exploreBtn": "Voir tous les produits"
  },
  "it": {
    "title": "Sistemi di Serramenti e Architetture Europee",
    "exploreBtn": "Vedi tutti i prodotti"
  },
  "es": {
    "title": "Sistemas de Cerramientos y Arquitectura Europea",
    "exploreBtn": "Ver todos los productos"
  },
  "es-MX": {
    "title": "Sistemas de Cerramientos y Arquitectura Europea",
    "exploreBtn": "Ver todos los productos"
  },
  "pt": {
    "title": "Sistemas de Caixilharia e Arquitetura Europeia",
    "exploreBtn": "Ver todos os produtos"
  },
  "pt-BR": {
    "title": "Sistemas de Esquadrias e Arquitetura Europeia",
    "exploreBtn": "Ver todos os produtos"
  },
  "fa": {
    "title": "سیستم‌های مهندسی درب و پنجره و معماری اروپایی",
    "exploreBtn": "مشاهده تمام محصولات"
  },
  "ru": {
    "title": "Европейские оконные и архитектурные системы",
    "exploreBtn": "Все продукты"
  },
  "zh-CN": {
    "title": "欧洲顶级门窗与建筑幕墙系统",
    "exploreBtn": "浏览全部产品"
  },
  "nl": {
    "title": "Europese kozijnen- en architectuursystemen",
    "exploreBtn": "Bekijk alle producten"
  },
  "pl": {
    "title": "Europejskie systemy stolarki otworowej i architektonicznej",
    "exploreBtn": "Zobacz wszystkie produkty"
  },
  "ro": {
    "title": "Sisteme Europene de Tâmplărie și Arhitectură",
    "exploreBtn": "Vezi toate produsele"
  },
  "el": {
    "title": "Ευρωπαϊκά Συστήματα Κουφωμάτων & Αρχιτεκτονικής",
    "exploreBtn": "Δείτε όλα τα προϊόντα"
  },
  "sv": {
    "title": "Europeiska fönster- och arkitektursystem",
    "exploreBtn": "Visa alla produkter"
  },
  "hi": {
    "title": "यूरोपीय फेनेस्ट्रेशन और वास्तुशिल्प प्रणाली",
    "exploreBtn": "सभी उत्पाद देखें"
  },
  "ja": {
    "title": "ヨーロッパ基準の窓・ドアおよび建築システム",
    "exploreBtn": "すべての製品を見る"
  },
  "ko": {
    "title": "유럽 프리미엄 창호 및 건축 시스템",
    "exploreBtn": "모든 제품 보기"
  },
  "kk": {
    "title": "Еуропалық терезе-есік және сәулет жүйелері",
    "exploreBtn": "Барлық өнімдерді көру"
  },
  "sr": {
    "title": "Европски системи прозора, врата и архитектуре",
    "exploreBtn": "Погледајте све производе"
  },
  "hr": {
    "title": "Europski sustavi prozora, vrata i arhitekture",
    "exploreBtn": "Pogledajte sve proizvode"
  },
  "bs": {
    "title": "Evropski sistemi prozora, vrata i arhitekture",
    "exploreBtn": "Pogledajte sve proizvode"
  },
  "sq": {
    "title": "Sisteme Evropiane të Dritareve dhe Arkitekturës",
    "exploreBtn": "Shiko të gjitha produktet"
  },
  "bg": {
    "title": "Европейски архитектурни и прозоречни системи",
    "exploreBtn": "Вижте всички продукти"
  }
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenQuoteModal, onExploreProducts }) => {
  const { currentLanguage } = useLanguage();
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const baseLang = currentLanguage.code.split('-')[0];
  const quotes = HERO_QUOTES_BY_LANG[currentLanguage.code] || HERO_QUOTES_BY_LANG[baseLang] || HERO_QUOTES_BY_LANG.en;
  const heroContent = HERO_CONTENT_BY_LANG[currentLanguage.code] || HERO_CONTENT_BY_LANG[baseLang] || HERO_CONTENT_BY_LANG.en;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFade(false);
      window.setTimeout(() => {
        setQuoteIdx((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 300);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [quotes.length]);

  return (
    <section id="home" className="relative flex min-h-screen w-full flex-col justify-start overflow-hidden bg-slate-50 pb-12 pt-10 sm:pt-14 md:pt-18">
      <div className="absolute inset-0 z-0 bg-cover bg-bottom md:hidden" style={{ backgroundImage: `url(${mobileHeroImage})` }} />
      <div className="absolute inset-0 z-0 hidden bg-cover bg-right-bottom md:block" style={{ backgroundImage: `url(${desktopHeroImage})` }} />

      <div className="relative z-10 mx-auto mt-0 w-full max-w-7xl px-6 py-0 sm:mt-2 sm:px-10 sm:py-2 md:mt-4 lg:px-12">
        <div className="max-w-2xl space-y-4 text-start sm:space-y-6">
          <h1 className="hero-masked-heading select-none overflow-visible pb-3 pt-1 text-3xl font-black leading-[1.24] tracking-tight sm:text-5xl sm:leading-[1.18] lg:text-6xl">
            <bdi dir="auto">{heroContent.title}</bdi>
          </h1>
          <p className="flex min-h-[3.5rem] max-w-xl items-center text-lg font-extrabold leading-snug text-slate-800 sm:text-2xl lg:text-3xl">
            <span className={`inline-block text-slate-800 transition-all duration-300 ${fade ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-1 scale-98 opacity-0'}`}>
              <bdi dir="auto">{quotes[quoteIdx % quotes.length]}</bdi>
            </span>
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onExploreProducts || onOpenQuoteModal}
              className="btn2 btn2-lg !text-base sm:!text-lg !font-black cursor-pointer group"
            >
              <span className="spn2 text-slate-900 font-black flex items-center gap-3 py-1">
                <LayoutGrid className="w-5 h-5 text-red-600" />
                <span><bdi dir="auto">{heroContent.exploreBtn}</bdi></span>
                <ArrowRight className="w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
