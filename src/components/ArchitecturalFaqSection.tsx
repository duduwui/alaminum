import React, { useState, useMemo } from 'react';
import { ChevronDown, HelpCircle, Search, MessageCircle, ShieldCheck, Sparkles, Building2, Flame, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FaqItem {
  id: string;
  category: 'aluminum' | 'glass' | 'upvc' | 'pricing';
  question: Record<string, string>;
  answer: Record<string, string>;
  keywords: string[];
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-best-aluminum',
    category: 'aluminum',
    question: {
      ar: 'ما هي أفضل أنواع شبابيك وأبواب الألمنيوم العازلة للحرارة والصوت في العراق؟',
      ckb: 'باشترین جۆری پەنجەرە و دەرگای ئەلەمنیۆمی عازلی گەرمی و دەنگ لە عێراق چییە؟',
      en: 'What are the best thermal-break and soundproof aluminum windows in Iraq?',
      tr: "Irak'ta ısı ve ses yalıtımlı en iyi alüminyum pencere sistemleri hangileridir?"
    },
    answer: {
      ar: 'تعد أنظمة الألمنيوم الحراري (Thermal Break) مثل Lorenzo 70LS و 58TT وأنظمة Alumil الأفضل لمناخ العراق الصيفي الحار. تتميز هذه الأنظمة بوجود فاصل عازل من البولي أميد (Polyamide) وزجاج مزدوج دبل كلاس معبأ بغاز الآرجون مع طبقة عاكسة Low-E لمنع انتقال حرارة الصيف التي تفوق 50° مئوية، وعزل الضوضاء الخارجية حتى 42 ديسيبل.',
      ckb: 'سیستەمی ئەلەمنیۆمی کپس و عازلی گەرمی (Thermal Break) وەک Lorenzo 70LS و 58TT باشترین هەڵبژاردەیە بۆ کەشوهەوای توندی عێراق و کوردستان. بە بەربەستی پۆلیەماید و جامی دەبڵ گڵاسی ئارگۆن دار، ڕێگری لە گەرمای سەروو ٥٠ پلە دەکات و دەنگی دەرەوە بە تەواوی عەزل دەکات.',
      en: 'Thermal-break aluminum systems such as Lorenzo 70LS, Lorenzo 58TT, and Alumil are the premier choice for Iraq’s extreme 50°C+ summer climate. They feature polyamide thermal barrier strips and argon-filled Low-E double glazing to eliminate heat transfer and achieve up to 42 dB acoustic noise reduction.',
      tr: "Lorenzo 70LS, 58TT ve Alumil gibi termal bariyerli (Thermal Break) alüminyum sistemler, Irak'ın 50°C'yi aşan aşırı sıcak iklimi için en üstün çözümdür. Poliamid ısı yalıtım bariyerleri ve argon gazlı Low-E çift cam sayesinde ısı geçişini engeller ve 42 dB'e kadar ses yalıtımı sağlar."
    },
    keywords: ['أفضل شبابيك ألمنيوم', 'عزل حراري', 'thermal break', 'lorenzo 70ls', 'عازل صوت', 'پەنجەرەی ئەلەمنیۆم', 'عەزلی گەرمی']
  },
  {
    id: 'faq-upvc-vs-aluminum',
    category: 'upvc',
    question: {
      ar: 'هل شبابيك uPVC أفضل أم شبابيك الألمنيوم لمناخ العراق الحار؟',
      ckb: 'ئایا پەنجەرەی uPVC باشترە یاخود ئەلەمنیۆمی عازل بۆ گەرمای عێراق؟',
      en: 'Which is better for Iraq’s climate: Thermal-break Aluminum or uPVC?',
      tr: "Irak iklimi için hangisi daha iyi: Isı yalıtımlı Alüminyum mu yoksa uPVC mi?"
    },
    answer: {
      ar: 'كلا الخيارين ممتاز وفقاً للاستخدام: نوافذ uPVC (مثل Deceuninck Legend 80 سداسية الحجرات) تتفوق في أعلى كفاءة عزل حراري تام وتوفير استهلاك التكييف للفتحات القياسية. بينما يتفوق الألمنيوم الحراري (Thermal Break) في القوة الهيكلية الفائقة للواجهات الزجاجية العملاقة والأبواب السحاب البانورامية الكبيرة مع مقاومة أبدية لأشعة الشمس والرياح.',
      ckb: 'هەردووکیان بەپێی شوێن نایابن: پرۆفایلی uPVC (وەک Deceuninck Legend 80 شەش خانەیی) زۆرترین عەزلی گەرمی و ساردکردنەوە دابین دەکات بۆ پەنجەرەی ئاسایی. بەڵام ئەلەمنیۆمی گەرمایی (Thermal Break) بۆ دەرگای پانۆرامای گەورە و ڕووکاری باڵەخانەی بەرز باشترینە و خۆڕاگری بێسنوورە.',
      en: 'Both systems excel based on architectural application: Multi-chamber uPVC (such as 6-chamber Deceuninck Legend 80) delivers maximum thermal insulation and energy savings for standard window openings. Thermal-break aluminum excels in structural rigidity for monumental panoramic sliding doors and oversized curtain wall facades.',
      tr: 'Her iki sistem de kullanım amacına göre mükemmeldir: Deceuninck Legend 80 gibi 6 odacıklı uPVC profiller standart pencerelerde maksimum ısı yalıtımı sağlar. Isı yalıtımlı alüminyum ise devasa panoramik sürme kapılar ve giydirme cepheler için yüksek mukavemet ve şıklık sunar.'
    },
    keywords: ['upvc vs aluminum', 'مقارنة المنيوم وبي في سي', 'deceuninck legend 80', 'عزل التكييف', 'یو پی ڤی سی']
  },
  {
    id: 'faq-glass-stairs',
    category: 'glass',
    question: {
      ar: 'كيف يتم تصنيع وتركيب الدرج والسلالم الزجاجية المعلقة والدرابزين بأمان تام؟',
      ckb: 'چۆن پلیکانی شووشە و محاجەرەی جامی سێکۆریت بە سەلامەتی تەواو دروست دەکرێت؟',
      en: 'How are architectural glass stairs, floating steps, and balustrades safely fabricated?',
      tr: 'Cam merdivenler, konsol basamaklar ve cam korkuluklar nasıl güvenle imal ve monte edilir?'
    },
    answer: {
      ar: 'يتم تصنيع درجات السلالم الزجاجية باستخدام زجاج سيكوريت مقسى متعدد الطبقات (Triple Laminated Tempered Glass) بسماكة 10+10+10 ملم أو 12+12 ملم مع طبقات PVB أو SentryGlas عالية المتانة. وتثبت بهياكل حديدية أو ستانلس ستيل مخفية تتحمل أوزاناً تفوق 500 كغم للدرجة الواحدة مع حواف معالجة ومقاومة للانزلاق.',
      ckb: 'پلیکانی شووشە لە جامی سێکۆریتی سێ قاتی لامینەیت (10+10+10 ملم) دروست دەکرێت بە چینی PVB بەهێز. لەسەر ستراکتۆری شاراوەی ئیستیل یان ئەلەمنیۆم جێگیر دەکرێت کە بەرگەی سەروی ٥٠٠ کگم دەگرێت بۆ هەر پایەیەک و ڕێگری لە خلیسکان دەکات.',
      en: 'Glass stair treads are engineered using multi-layer structural laminated tempered glass (typically 10+10+10mm or 12+12mm with SentryGlas interlayers). They are mounted on hidden cantilever steel or aluminum substructures rated for point loads exceeding 500 kg per tread with anti-slip architectural finishes.',
      tr: 'Cam basamaklar, çok katmanlı lamine temperli camdan (genellikle 10+10+10 mm veya 12+12 mm SentryGlas ara katmanlı) üretilir. Basamak başına 500 kg üzeri yüke dayanıklı gizli çelik veya alüminyum konsol taşıyıcılarla monte edilir ve kaydırmaz yüzey işlemi uygulanır.'
    },
    keywords: ['درج زجاجي', 'سلالم معلقة', 'درابزين زجاج', 'glass stairs', 'پلیکانی شووشە', 'محاجەرەی جام', 'سيكوريت']
  },
  {
    id: 'faq-sliding-doors',
    category: 'aluminum',
    question: {
      ar: 'ما هي مواصفات ومميزات الأبواب السحاب البانورامية الكبيرة (Lift & Slide)؟',
      ckb: 'تایبەتمەندییەکانی دەرگای پانۆرامای گەورەی سلایدینگ (Lift & Slide) چییە؟',
      en: 'What are the specifications and features of Lift & Slide panoramic doors?',
      tr: 'Lift & Slide panoramik sürme kapıların özellikleri ve avantajları nelerdir?'
    },
    answer: {
      ar: 'تتميز أبواب Lift & Slide (مثل Lorenzo 70LS) بقدرتها على حمل أجنحة زجاجية ضخمة تصل إلى 400 كغم للضلفة الواحدة وبارتفاعات حتى 3.2 متر. يوفر نظام الرفع والانزلاق سلاسة خيالية بلمسة يد، مع عتبة أرضية منخفضة مستوية وعزل كامل ضد الغبار والعواصف الرملية ومياه الأمطار بفضل حشوات EPDM المتواصلة.',
      ckb: 'دەرگای لیفت ئەند سلاید (وەک Lorenzo 70LS) توانای هەڵگرتنی جامی قورس تا ٤٠٠ کگم بۆ هەر قاپاغێک هەیە بە بەرزی ٣.٢ مەتر. بە دەست لێدانێکی ئاسان دەجوڵێت، خوارەوەی تەختە لەگەڵ زەوی، و بە تەواوی ڕێگری لە تۆزوخۆڵ و باران دەکات بە لاستیکی EPDM.',
      en: 'Lift & Slide systems (such as Lorenzo 70LS) support oversized sashes weighing up to 400 kg each with heights up to 3.2 meters. The lifting gear ensures effortless fingertip sliding, flush floor thresholds, and 100% weather sealing against dust storms and heavy rain.',
      tr: "Lift & Slide sistemleri (Lorenzo 70LS gibi), kanat başına 400 kg'a kadar ağırlık ve 3.2 metreye varan yükseklikleri destekler. Sıfır eşik seçeneği, parmak ucuyla zahmetsiz kayma ve kesintisiz EPDM contalarla kum fırtınası ve yağmura karşı tam sızdırmazlık sağlar."
    },
    keywords: ['ابواب سحاب', 'lift and slide', 'lorenzo 70ls', 'ابواب بانوراما', 'دەرگای سلاید', 'panoramic sliding doors']
  },
  {
    id: 'faq-curtain-wall',
    category: 'glass',
    question: {
      ar: 'ما هي مواصفات الواجهات الزجاجية كيرتن وول (Curtain Wall 50F) واستركشر للمباني والفلل؟',
      ckb: 'تایبەتمەندی ڕووکاری شووشەیی کەرتن وۆڵ (Curtain Wall 50F) بۆ باڵەخانە چییە؟',
      en: 'What are the engineering specs for Curtain Wall 50F & structural facades?',
      tr: 'Curtain Wall 50F giydirme cephe ve strüktürel cam sistemlerinin teknik özellikleri nelerdir?'
    },
    answer: {
      ar: 'يعتمد نظام Curtain Wall 50F على قطاعات ألمنيوم إنشائية بعرض 50 ملم مصممة لتحمل ضغط الرياح العالي والأحمال الهيكلية للمباني الشاهقة والفلل المودرن. يدمج مع زجاج دبل معزول Low-E أو عاكس للضوء مع مجاري تصريف مياه داخلية وعزل حراري فائق يمنح المبنى مظهراً زجاجياً عصرياً بدون أعمدة خرسانية ظاهرة.',
      ckb: 'سیستەمی کەرتن وۆڵ ٥٠ ملم پرۆفایلی ئەلەمنیۆمی ئەندازیاری بەکاردێنێت بۆ بەرگەگرتنی فشاری با و کێشی باڵەخانە و ڤێلای مۆدێرن. بە جامی دبل لۆو-ئی عازل و سیستەمی ئاوەڕۆی ناوەکی دادەنرێت کە دیمەنێکی مۆدێرنی شووشەیی تەواو بە باڵەخانە دەبەخشێت.',
      en: 'The Curtain Wall 50F stick system uses 50mm structural aluminum mullions engineered for high wind load resistance on commercial towers and modern luxury villas. It integrates Low-E solar-reflective double glazing, internal moisture drainage channels, and thermal insulation.',
      tr: 'Curtain Wall 50F kapaklı ve strüktürel silikonlu giydirme cephe sistemi, yüksek rüzgar yükü dayanımına sahip 50 mm düşey ve yatay alüminyum profillerden oluşur. Low-E güneş kontrollü yalıtım camları ve dahili drenaj kanalları ile donatılmıştır.'
    },
    keywords: ['واجهات زجاجية', 'كيرتن وول', 'curtain wall 50f', 'استركشر', 'ڕووکاری باڵەخانە', 'facade iraq']
  },
  {
    id: 'faq-pricing-delivery',
    category: 'pricing',
    question: {
      ar: 'كم تبلغ أسعار الشبابيك والأبواب والدرج الزجاجي؟ وهل توفرون التوصيل والتركيب في كافة المحافظات؟',
      ckb: 'نرخی پەنجەرە و دەرگا و پلیکانی شووشە چەندە؟ ئایا لە هەموو پارێزگاکان دادەنرێت؟',
      en: 'What are the prices of windows, doors, and glass stairs? Do you install across all Iraqi governorates?',
      tr: "Pencere, kapı ve cam merdiven fiyatları nedir? Tüm Irak vilayetlerine montaj yapıyor musunuz?"
    },
    answer: {
      ar: 'تحدد الأسعار بناءً على المقاسات الهندسية الدقيقة، نوع القطاع (ألمنيوم حراري أو uPVC)، مواصفات الزجاج (دبل، تربل، سيكوريت)، ونوع الإكسسوارات الأوروبية. تقدم شركة Doorhome (باب المنزل) زيارة هندسية مجانية لأخذ القياسات، وخدمة التصنيع والتوصيل والتركيب المعتمد في أربيل، بغداد، السليمانية، دهوك، كركوك، البصرة، وجميع مدن العراق مع ضمان مصنعي يصل إلى 10 سنوات.',
      ckb: 'نرخەکان بەپێی قەبارەی ئەندازیاری، جۆری پرۆفایل (ئەلەمنیۆم یان uPVC)، جۆری جام، و دەسکی ئەوروپی دیاری دەکرێت. کۆمپانیای دەرگای ماڵ (Doorhome) پێوانەکردنی بێبەرامبەر و گەیاندن و دانان لە هەولێر، بەغدا، سلێمانی، دهۆک، کەرکووک و تەواوی عێراق ئەنجام دەدات لەگەڵ گرەنتی تا ١٠ ساڵ.',
      en: 'Pricing is calculated based on exact structural dimensions, profile system (Thermal-break aluminum vs uPVC), glass specifications (double/triple Low-E laminated), and European hardware. Doorhome provides on-site laser measurements, fabrication, delivery, and certified installation across Erbil, Baghdad, Sulaymaniyah, Duhok, Kirkuk, and all Iraq governorates with up to a 10-year factory warranty.',
      tr: "Fiyatlar; hassas ölçüler, seçilen profil sistemi (ısı yalıtımlı alüminyum veya uPVC), cam konfigürasyonu ve Avrupa aksesuarlarına göre belirlenir. Doorhome, Erbil, Bağdat, Süleymaniye, Duhok, Kerkük ve tüm Irak genelinde yerinde lazer ölçümü, üretim, nakliye ve 10 yıla varan resmi garantiyle montaj hizmeti sunmaktadır."
    },
    keywords: ['اسعار شبابيك المنيوم', 'اسعار درج زجاجي', 'توصيل بغداد اربيل', 'ضمان 10 سنوات', 'نرخی پەنجەرە', 'window prices iraq']
  },
  {
    id: 'faq-measuring-warranty',
    category: 'pricing',
    question: {
      ar: 'هل توفر الشركة خدمة المعاينة الهندسية المجانية والضمان المعتمد؟',
      ckb: 'ئایا کۆمپانیا خزمەتگوزاری سەردانی ئەندازیاری و گرەنتی فەرمی دابین دەکات؟',
      en: 'Do you offer free on-site engineering consultations and certified warranties?',
      tr: 'Ücretsiz yerinde keşif ve resmi garanti hizmeti veriyor musunuz?'
    },
    answer: {
      ar: 'نعم، يقوم مهندسونا المتخصصون بزيارة موقع المشروع لأخذ القياسات بالليزر ودراسة أحمال الرياح والعزل المناسب مجاناً. كما نوفر شهادة ضمان رسمية على ثبات ألوان القطاعات، العزل الحراري، عدم تكثف بخار الماء داخل الزجاج المزدوج، وجودة عمل آليات الإغلاق الأوروبية.',
      ckb: 'بەڵێ، ئەندازیارانی ئێمە سەردانی شوێنی پڕۆژە دەکەن بۆ پێوانەکردنی لەیزەری و دیاریکردنی باشترین عەزل بەبێ بەرامبەر. هەروەها بڕوانامەی گرەنتی فەرمی پێشکەش دەکرێت بۆ پاراستنی ڕەنگ، عەزلی گەرمی، جامی دبل گڵاس و قوفڵە ئەوروپییەکان.',
      en: 'Yes. Our senior fenestration engineers visit your project site for laser surveying, wind load evaluation, and thermal design at no extra charge. Every project includes an official warranty certificate covering profile powder coating, thermal break performance, hermetic double-glazing seal, and European multipoint locking mechanisms.',
      tr: 'Evet. Uzman mühendislerimiz lazer ölçümü ve rüzgar/ısı analizleri için şantiyenizi ücretsiz ziyaret eder. Her projede profil kaplaması, ısı yalıtımı, çift cam sızdırmazlığı ve Avrupa kilit mekanizmaları için resmi garanti sertifikası verilir.'
    },
    keywords: ['معاينة مجانية', 'ضمان رسمي', 'قياسات ليزر', 'پێوانەکردن', 'garanti']
  }
];

export const ArchitecturalFaqSection: React.FC<{
  onOpenQuoteModal?: () => void;
}> = ({ onOpenQuoteModal }) => {
  const { currentLanguage } = useLanguage();
  const langCode = (currentLanguage?.code || 'ar').toLowerCase();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-best-aluminum': true,
    'faq-upvc-vs-aluminum': true
  });

  const langKey = useMemo(() => {
    if (langCode.startsWith('ckb') || langCode.startsWith('ku') || langCode.startsWith('kmr')) return 'ckb';
    if (langCode.startsWith('tr')) return 'tr';
    if (langCode.startsWith('en')) return 'en';
    return 'ar';
  }, [langCode]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = useMemo(() => {
    if (langKey === 'ckb') {
      return [
        { id: 'all', label: 'هەموو پرسیارەکان' },
        { id: 'aluminum', label: 'ئەلەمنیۆم و دەرگای سلاید' },
        { id: 'glass', label: 'پلیکانی شووشە و ڕووکار' },
        { id: 'upvc', label: 'سیستەمی uPVC و عەزل' },
        { id: 'pricing', label: 'نرخ و گەیاندن و گرەنتی' }
      ];
    }
    if (langKey === 'en') {
      return [
        { id: 'all', label: 'All Questions' },
        { id: 'aluminum', label: 'Aluminum & Sliding' },
        { id: 'glass', label: 'Glass Stairs & Facades' },
        { id: 'upvc', label: 'uPVC & Acoustic' },
        { id: 'pricing', label: 'Pricing & Warranty' }
      ];
    }
    if (langKey === 'tr') {
      return [
        { id: 'all', label: 'Tüm Sorular' },
        { id: 'aluminum', label: 'Alüminyum ve Sürme' },
        { id: 'glass', label: 'Cam Merdiven ve Cephe' },
        { id: 'upvc', label: 'uPVC ve Yalıtım' },
        { id: 'pricing', label: 'Fiyat ve Garanti' }
      ];
    }
    return [
      { id: 'all', label: 'جميع الأسئلة الشائعة' },
      { id: 'aluminum', label: 'شبابيك وأبواب ألمنيوم' },
      { id: 'glass', label: 'درج زجاجي وواجهات' },
      { id: 'upvc', label: 'نوافذ uPVC وعزل الصوت' },
      { id: 'pricing', label: 'الأسعار والضمان والتركيب' }
    ];
  }, [langKey]);

  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const questionText = (item.question[langKey] || item.question.ar || '').toLowerCase();
      const answerText = (item.answer[langKey] || item.answer.ar || '').toLowerCase();
      const keywordsMatch = item.keywords.some((k) => k.toLowerCase().includes(q));

      return questionText.includes(q) || answerText.includes(q) || keywordsMatch;
    });
  }, [activeCategory, searchQuery, langKey]);

  const texts = useMemo(() => {
    if (langKey === 'ckb') {
      return {
        badge: 'ڕێبەری ئەندازیاری و پرسیارە باوەکان',
        title: 'پرسیارە گرنگەکان پێش کڕینی پەنجەرە و دەرگا و شووشە',
        subtitle: 'وەڵامی تەواوی پرسیارەکان دەربارەی باشترین کوالێتی ئەلەمنیۆم، عەزلی گەرمی، پلیکانی شووشە و نرخەکان لە عێراق و کوردستان.',
        searchPlaceholder: 'گەڕان لە پرسیارەکان (نموونە: نرخ، عەزل، پلیکانە، uPVC)...',
        noResults: 'هیچ پرسیارێک نەدۆزرایەوە بەپێی گەڕانەکەت.',
        needCustomHelp: 'پێویستت بە وەڵامی تایبەت بە پڕۆژەکەت هەیە؟',
        chatWhatsApp: 'پەیوەندی لەگەڵ ئەندازیار لە واتسئاپ',
        requestQuote: 'داواکردنی عەرزی نرخی بێبەرامبەر'
      };
    }
    if (langKey === 'en') {
      return {
        badge: 'ARCHITECTURAL BUYER GUIDE & FAQ',
        title: 'Frequently Asked Questions by Homeowners & Contractors',
        subtitle: 'Everything you need to know about choosing high-performance thermal aluminum, glass stairs, soundproof uPVC, and project delivery across Iraq.',
        searchPlaceholder: 'Search questions (e.g. price, thermal break, glass stairs, warranty)...',
        noResults: 'No questions matched your search criteria.',
        needCustomHelp: 'Have a specific architectural project question?',
        chatWhatsApp: 'Chat with Senior Engineer on WhatsApp',
        requestQuote: 'Request Free Technical Quote'
      };
    }
    if (langKey === 'tr') {
      return {
        badge: 'MİMARİ REHBER VE SIKÇA SORULAN SORULAR',
        title: 'Pencere, Kapı ve Cam Merdiven Hakkında Merak Edilenler',
        subtitle: "Irak genelinde ısı yalıtımlı alüminyum, uPVC sistemler, cam merdivenler ve montaj süreçleri hakkında tüm detaylar.",
        searchPlaceholder: 'Soru veya konu arayın (örn. fiyat, ısı yalıtımı, cam merdiven)...',
        noResults: 'Aramanızla eşleşen soru bulunamadı.',
        needCustomHelp: 'Projenize özel mühendislik desteğine mi ihtiyacınız var?',
        chatWhatsApp: "WhatsApp'tan Mühendisimize Danışın",
        requestQuote: 'Ücretsiz Teklif İsteyin'
      };
    }
    return {
      badge: 'دليل المستهلك والأسئلة الهندسية الشائعة',
      title: 'كل ما تريد معرفته قبل تفصيل الشبابيك والأبواب والدرج الزجاجي',
      subtitle: 'إجابات هندسية دقيقة وموثوقة عن أفضل أنواع الألمنيوم العازل، مقارنة uPVC، السلالم الزجاجية المعلقة، والأسعار والضمان في العراق وأربيل وبغداد.',
      searchPlaceholder: 'ابحث في الأسئلة (مثال: أسعار، عزل حراري، درج زجاجي، أبواب سحاب، uPVC)...',
      noResults: 'لم يتم العثور على نتائج تطابق بحثك.',
      needCustomHelp: 'هل لديك استفسار خاص بمخطط فيلتك أو مشروعك؟',
      chatWhatsApp: 'تحدث مباشرة مع المهندس عبر واتساب',
      requestQuote: 'طلب عرض سعر واستشارة مجانية'
    };
  }, [langKey]);

  return (
    <section id="faq" className="w-full py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800 relative overflow-hidden border-t border-slate-200">
      {/* Background Subtle Accent Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <HelpCircle className="w-4 h-4 text-red-600 animate-pulse" />
            <span>{texts.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {texts.title}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            {texts.subtitle}
          </p>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={texts.searchPlaceholder}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-2xl text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-slate-900 transition-all placeholder:text-slate-400"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 px-2 py-1 text-xs text-slate-400 hover:text-slate-700 rounded-md bg-slate-100"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-102'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">{texts.noResults}</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isOpen = Boolean(openItems[item.id]);
              const question = item.question[langKey] || item.question.ar || item.question.en;
              const answer = item.answer[langKey] || item.answer.ar || item.answer.en;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md ${
                    isOpen ? 'border-red-300/80 ring-1 ring-red-100' : 'border-slate-200/90'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left rtl:text-right gap-4 focus:outline-none cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                        Q
                      </span>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-snug">
                        {question}
                      </h3>
                    </div>

                    <div className={`p-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-red-50 text-red-600 border-red-200' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      <p className="whitespace-pre-line pl-10 rtl:pl-0 rtl:pr-10">
                        {answer}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 pl-10 rtl:pl-0 rtl:pr-10">
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Doorhome Certified Engineering Specification
                        </span>

                        <a
                          href={`https://wa.me/9647517945498?text=${encodeURIComponent(`مرحباً، لدي استفسار بخصوص: ${question}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>اسأل المهندس حول هذا البند</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-12 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white text-center sm:text-left rtl:sm:text-right flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
              {texts.needCustomHelp}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              فريقنا الهندسي في أربيل وبغداد مستعد لزيارة موقعك مجاناً لرفع القياسات وتقديم التوصيات المعمارية الأنسب لميزانيتك.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto relative z-10">
            <a
              href="https://wa.me/9647517945498?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%AD%D8%B5%D9%88%D9%84%20%D8%B9%D9%84%D9%89%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D9%87%D9%86%D8%AF%D8%B3%D9%8A%D8%A9%20%D9%88%D8%B9%D8%B1%D8%B6%20%D8%B3%D8%B9%D8%B1%20%D9%84%D9%85%D8%B4%D8%B1%D9%88%D8%B9%D9%8A"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{texts.chatWhatsApp}</span>
            </a>

            {onOpenQuoteModal && (
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{texts.requestQuote}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
