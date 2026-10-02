import { ProductItem, BrochureItem } from '../data/winhomeData';

interface LocalizedProductInfo {
  name: string;
  description: string;
  subCategory?: string;
  features?: string[];
  specs?: Record<string, string>;
}

const PRODUCT_LOCALIZATIONS: Record<string, Record<string, LocalizedProductInfo>> = {
  it: {
      "legend-80": {
            "name": "Deceuninck Legend 80 Passivhaus",
            "description": "Il massimo dell'isolamento termico e acustico. Progettato con profondità 80 mm e 6 camere interne per resistere a temperature estive oltre i 50°C.",
            "subCategory": "Isolamento Termico Elevato",
            "features": [
                  "Design a 6 camere per il minimo consumo energetico",
                  "Guarnizioni continue triple in EPDM",
                  "Supporta tripli vetri fino a 52 mm",
                  "Resistenza al sole battente e alle tempeste di sabbia"
            ]
      },
      "winsa-dorado-76": {
            "name": "Winsa Dorado 76 Isolamento Acustico",
            "description": "Sistema robusto da 76 mm per appartamenti e ville di lusso che richiedono elevato isolamento da rumore e polvere.",
            "subCategory": "Isolamento Acustico e Silenzio",
            "features": [
                  "5 camere interne per un forte isolamento termico",
                  "Rinforzo in acciaio zincato nel profilo per resistere al vento",
                  "Chiusura perimetrale multipunto europea",
                  "Supporta doppi e tripli vetri fino a 44 mm"
            ]
      },
      "upvc-everest-max-60": {
            "name": "Everest Max 60 mm",
            "description": "Sviluppato specificamente per resistere a forti escursioni termiche, dotato di 4 camere interne e doppia guarnizione isolante.",
            "subCategory": "Residenziale Classico",
            "features": [
                  "Struttura a 4 camere per un isolamento termico equilibrato",
                  "Guarnizioni in TPE o EPDM contro infiltrazioni di aria e polvere",
                  "Acciaio rinforzato interno per la massima stabilità",
                  "Supporta vetri da 4 mm a 32 mm"
            ]
      },
      "upvc-legend-art-70": {
            "name": "Legend Art 70 mm",
            "description": "Design snello ed elegante a 5 camere che unisce la bellezza architettonica contemporanea a elevate prestazioni isolanti.",
            "subCategory": "Architettura di Pregio",
            "features": [
                  "Telaio moderno e sottile con 5 camere termiche",
                  "Guarnizione centrale speciale contro pioggia battente",
                  "Supporta tripli vetri fino a 44 mm"
            ]
      },
      "lorenzo-60t": {
            "name": "Lorenzoline 60T Battente a Taglio Termico",
            "description": "Profilo in alluminio con isolamento in poliammide per finestre e porte con apertura verso l'interno o l'esterno.",
            "subCategory": "Alluminio a Taglio Termico",
            "features": [
                  "Barretta isolante in poliammide da 24 mm",
                  "Compatibile con serrature europee multipunto",
                  "Finitura anodizzata ad alta resistenza ai raggi UV"
            ]
      },
      "lorenzo-70ls": {
            "name": "Lorenzoline 70LS Scorrevole Panoramico",
            "description": "Sistema scorrevole architettonico per vetrate alte fino a 3 metri con taglio termico in poliammide e movimento ultra-fluido.",
            "subCategory": "Alluminio Scorrevole Termico",
            "features": [
                  "Taglio termico in poliammide da 24 mm",
                  "Binari in acciaio inox per portata fino a 400 kg per anta",
                  "Drenaggio integrato per piogge intense",
                  "Chiusura multipunto europea per massima sicurezza"
            ]
      },
      "hs76-sliding": {
            "name": "Hebe-Schiebe HS76 Scorrevole Panoramico",
            "description": "Ingegneria avanzata per ante scorrevoli panoramiche fino a 300 kg con scorrimento fluido e soglia a filo pavimento.",
            "subCategory": "Scorrevole Pesante Panoramico",
            "features": [
                  "Carrelli Hebe-Schiebe per portata 300 kg di vetro",
                  "Soglia ribassata a filo pavimento senza barriere",
                  "Chiusura perimetrale ermetica contro polvere e pioggia",
                  "Massima superficie vetrata per vista panoramica"
            ]
      },
      "al-folding-77bf": {
            "name": "Sistema a Libro Bi-Fold 77BF",
            "description": "Sistema a pacchetto pieghevole ad alte prestazioni per aprire completamente gli spazi verso giardini o terrazze.",
            "subCategory": "Porte a Libro Pieghevoli",
            "features": [
                  "Apertura totale senza montanti centrali fissi",
                  "Cerniere e carrelli in acciaio inox per carichi pesanti",
                  "Ottimo isolamento termico e acustico"
            ]
      },
      "pivot-monumental-door": {
            "name": "Porta d'Ingresso Pivotante Monumentale",
            "description": "Porta d'ingresso scenografica con cerniera a perno pivotante per altezze fino a 3,5 metri e larghezze fino a 2 metri.",
            "subCategory": "Porte d'Ingresso di Lusso",
            "features": [
                  "Cerniera pivotante a terra con chiusura rallentata idraulica",
                  "Serratura elettronica e biometrica smart opzionale",
                  "Pannelli decorativi in alluminio spazzolato o legno marino"
            ]
      },
      "pergolas": {
            "name": "Pergola Bioclimatica Smart in Alluminio",
            "description": "Pergola motorizzata a lamelle orientabili in alluminio per regolare luce, ventilazione e protezione dalla pioggia in giardini e attici.",
            "subCategory": "Spazi Aperti e Giardini",
            "features": [
                  "Lamelle orientabili motorizzate da 0 a 135 gradi",
                  "Sensori automatici di pioggia e vento",
                  "Canalizzazione acqua piovana integrata nei montanti"
            ]
      },
      "facade-50f": {
            "name": "Facciata Continua 50F per Edifici",
            "description": "Sistema di facciata continua in vetro per aziende, hotel e showroom con montanti e traversi a vista da 50 mm.",
            "subCategory": "Facciate per Edifici e Uffici",
            "features": [
                  "Profili sottili da 50 mm per massima luminosità naturale",
                  "Sistema di drenaggio integrato multipiano",
                  "Finestre a sporgere a scomparsa integrabili",
                  "Elevata resistenza ai venti forti"
            ]
      },
      "curtain-50f": {
            "name": "Curtain Wall 50F Sistema a Montanti e Traversi",
            "description": "Sistema completo di facciata continua per isolamento termico, controllo solare e stabilità strutturale.",
            "subCategory": "Facciate Continue",
            "features": [
                  "Larghezza 50 mm",
                  "Alta resistenza al vento",
                  "Isolamento a taglio termico"
            ]
      },
      "atriums": {
            "name": "Coperture Vetrata e Lucernari per Atri",
            "description": "Strutture vetrate inclinate e piramidali per illuminare naturalmente grandi atri e spazi commerciali.",
            "subCategory": "Lucernari e Vetrate Zenithali",
            "features": [
                  "Canali interni di raccolta condensa",
                  "Vetri antisfondamento e di sicurezza calpestabili su richiesta"
            ]
      },
      "low-e-double": {
            "name": "Vetrocamera Isolante Basso-Emissivo con Gas Argon",
            "description": "Doppio o triplo vetrocamera ad alte prestazioni per respingere i raggi ultravioletti e conservare la temperatura interna.",
            "subCategory": "Vetro Tecnico e Glazing",
            "features": [
                  "Rivestimento magnetronico basso-emissivo Low-E",
                  "Intercapedine riempita con gas Argon al 90%",
                  "Canalina calda Warm Edge per eliminare la condensa"
            ]
      },
      "railings": {
            "name": "Parapetti in Alluminio e Vetro di Sicurezza",
            "description": "Parapetti dal design minimale per balconi, terrazze e scale con ancoraggio a pavimento o a scomparsa.",
            "subCategory": "Ringhiere e Parapetti",
            "features": [
                  "Vetro temperato stratificato fino a 21.5 mm",
                  "Profili in alluminio anodizzato anticorrosione"
            ]
      },
      "fences": {
            "name": "Recinzioni Architettoniche in Alluminio",
            "description": "Recinzioni perimetrali moderne in alluminio inattaccabili da ruggine e intemperie, a manutenzione zero.",
            "subCategory": "Recinzioni e Cancelli",
            "features": [
                  "Profili verniciati a polvere con garanzia decennale",
                  "Design a lamelle orizzontali per la massima privacy"
            ]
      },
      "spigot-glass-rail": {
            "name": "Parapetto in Vetro a Morsetti Spigot in Inox",
            "description": "Sistema di supporto a morsetti in acciaio inossidabile marino per vetrate trasparenti a bordo piscina o terrazza.",
            "subCategory": "Parapetti Minimali",
            "features": [
                  "Acciaio inossidabile marino grado AISI 316",
                  "Vetro trasparente a tutta vista senza montanti verticali"
            ]
      },
      "stac-multipoint": {
            "name": "Chiusura Multipunto Europea STAC",
            "description": "Ferramenta di chiusura perimetrale certificata spagnola STAC per garantire ermeticità e massima sicurezza.",
            "subCategory": "Ferramenta e Meccanismi",
            "features": [
                  "Perni di chiusura a fungo antieffrazione",
                  "Trattamento anticorrosione ad altissima resistenza"
            ]
      },
      "master-handles": {
            "name": "Maniglie Architettoniche di Design Master Italy",
            "description": "Maniglie ergonomiche di fabbricazione italiana per porte e finestre, resistenti all'uso intensivo.",
            "subCategory": "Maniglie e Maniglioni",
            "features": [
                  "Design italiano d'eccellenza",
                  "Meccanismo interno testato per 25.000 cicli di apertura"
            ]
      },
      "comunello-rollers": {
            "name": "Carrelli di Scorrimento Rinforzati Comunello",
            "description": "Carrelli doppi regolabili in acciaio inox e polimeri tecnici per porte scorrevoli pesanti fino a 400 kg.",
            "subCategory": "Carrelli e Cuscinetti",
            "features": [
                  "Cuscinetti a sfera sigillati in acciaio inossidabile",
                  "Regolazione millimetrica dell'altezza dell'anta"
            ]
      },
      "somfy-automation": {
            "name": "Motori e Automazioni Smart Somfy",
            "description": "Sistemi motorizzati e smart per l'apertura controllata di persiane, pergole e finestre a vasistas.",
            "subCategory": "Automazioni e Smart Home",
            "features": [
                  "Controllo remoto tramite smartphone o telecomando",
                  "Integrazione con sistemi domotici standard"
            ]
      },
      "shutters": {
            "name": "Monoblocchi e Tapparelle in Alluminio Coibentato",
            "description": "Tapparelle in alluminio estruso riempite di poliuretano espanso ad alta densità per oscuramento e isolamento.",
            "subCategory": "Tapparelle e Oscuranti",
            "features": [
                  "Isolamento termico e acustico integrato",
                  "Lamelle autobloccanti per protezione antieffrazione"
            ]
      },
      "acc-window-line": {
            "name": "Kit Ferramenta Finestra Anta-Ribalta",
            "description": "Sistema completo di chiusura perimetrale a ribalta per un ricambio d'aria continuo e sicuro.",
            "subCategory": "Accessori Finestre",
            "features": [
                  "Doppia funzione: apertura a battente e a ribalta",
                  "Cerniere a scomparsa o a vista rinforzate"
            ]
      },
      "acc-door-line": {
            "name": "Cerniere e Serrature per Porte d'Ingresso",
            "description": "Kit cerniere a tre ali regolabili e serrature di sicurezza a 3 o 5 punti di bloccaggio.",
            "subCategory": "Accessori Porte",
            "features": [
                  "Portata certificata fino a 160 kg per cerniera",
                  "Cilindro di sicurezza europeo antitrapano"
            ]
      },
      "acc-sliding-line": {
            "name": "Guide e Carrelli per Sistemi Scorrevoli",
            "description": "Binari in alluminio anodizzato e guide in acciaio inox con spazzole parapolvere ad alta densità.",
            "subCategory": "Accessori Scorrevoli",
            "features": [
                  "Spazzole parapolvere con aletta centrale rigida",
                  "Scorrimento silenzioso e duraturo nel tempo"
            ]
      },
      "acc-handle-line": {
            "name": "Maniglioni Lunghi di Pregio per Portoni",
            "description": "Maniglioni dritti o curvi in acciaio inox satinato fino a 180 cm per ingressi contemporanei.",
            "subCategory": "Maniglioni Architettonici",
            "features": [
                  "Acciaio inox spazzolato resistente a graffi e usura",
                  "Fissaggi rinforzati passanti"
            ]
      }
},

  ckb: {
    'legend-80': {
      name: 'پەنجەرەی دێکۆنینک لێجەند 80',
      description: 'لوتکەی عەزلی گەرمی و دەنگی. بە قووڵی ٨٠ ملم و ٦ خانەی ناوەکی دروستکراوە بۆ بەرگەگرتنی گەرمای سەرووی ٥٠ پلەی هاوینی هەولێر.',
      subCategory: 'عەزلی گەرمی باڵا',
      features: [
        'دیزاینی ٦-خانەیی بۆ کەمترین بەفیڕۆدانی وزە بە ستانداردی پاسیڤ هاوس',
        'لاستیکی سێقاتی EPDM بۆ بەرگری تەواو لە دەنگ و تۆز',
        'پشتگیری شوشەی سێقاتی ئەستوور هەتا ٥٢ ملم دەکات',
        'نەرمەی بەهێزی ئەوروپی بۆ پەنجەرەی قورس و بەرز',
        'بەرگری لە تیشکی بەهێزی خۆر و زریانی تۆزوخۆڵ'
      ]
    },
    'winsa-dorado-76': {
      name: 'پەنجەرەی وینسا دۆرادۆ 76',
      description: 'سیستەمی ٧٦ ملمی قورس بۆ شوقە و ڤێلا لوکسەکان کە پێویستیان بە عەزلی بەرزی دەنگ و تۆزە.',
      subCategory: 'عەزلی دەنگ و بێدەنگی',
      features: [
        '٥-خانەی ناوەکی بۆ عەزلی گەرمی بەهێز',
        'شیشی ستیلی گالڤانایز لەناو پرۆفایل بۆ بەرگری لە با و زریان',
        'قوفڵی فرە-خاڵی ئەوروپی بۆ ئاسایشی تەواو',
        'پشتگیری شوشەی دەبڵ و تریپڵ هەتا ٤٤ ملم'
      ]
    },
    'hs76-sliding': {
      name: 'دەرگای سحابی هێبێ شیبێ HS76',
      description: 'ئەندازیاری پێشکەوتووی دەرگای پانۆرامای سلایدینگ بۆ کێشی هەتا ٣٠٠ کگم بە جوڵەیەکی زۆر نەرم بە دەست و بەربەستی سیفری سەر زەوی.',
      subCategory: 'سلایدینگی پانۆرامای قورس',
      features: [
        'چەرخی هێبی شیبی بۆ هەڵگرتنی ٣٠٠ کگم کێشی شووشە',
        'بەربەستی زەوی تەخت بۆ هاتوچۆی ئاسان و بێ ئاستەنگ',
        'قوفڵی دەوری فرە-خاڵ بۆ ڕێگری لە تۆز و باران',
        'زۆرترین ڕووبەری شوشە بۆ دیمەنی پانۆراما'
      ]
    },
    'upvc-everest-max-60': {
      name: 'ئێڤرێست ماکس ٦٠ ملم',
      description: 'تایبەت بە گۆڕانکارییە توندەکانی پلەی گەرما دروستکراوە، بە ٤ خانەی ناوەکی و لاستیکی جووت عەزل.',
      subCategory: 'نیشتەجێبوونی کلاسیک',
      features: [
        'پێکهاتەی ٤-خانەیی بۆ عەزلی هاوسەنگی گەرمی',
        'لاستیکی TPE یان EPDM بۆ ڕێگری لە دزەکردنی هەوا و تۆز',
        'ستیلی بەهێزکراوی ناوەکی بۆ ڕاگرتنی پەنجەرەکە',
        'پشتگیری شوشەی تاک ٤ ملم هەتا دەبڵ ٣٢ ملم'
      ]
    },
    'upvc-legend-art-70': {
      name: 'لێجەند ئارت ٧٠ ملم',
      description: 'شێوازێکی باریک و سەرنجڕاکێش بە ٥ خانەی ناوەکی کە جوانی تەلارسازی هاوچەرخ لەگەڵ عەزلی بەرز یەکدەخات.',
      subCategory: 'تەلارسازی لوکس',
      features: [
        'چوارچێوەی باریکی مۆدێرن بە ٥ خانەی عەزلی گەرمی',
        'لاستیکی ناوەندی تایبەت بۆ ڕێگری لە دزەکردنی ئاو و هەوا',
        'پشتگیری شوشەی سێقات هەتا ٤٤ ملم'
      ]
    },
    'lorenzo-70ls': {
      name: 'دەرگای سحابی ئەلەمنیۆم لۆرێنزۆ 70LS',
      description: 'سیستەمی سلایدینگی تەلارسازی بۆ شوشەی بەرزایی هەتا ٣ مەتر بە عەزلی پۆلیەماید و جوڵەی نەرم.',
      subCategory: 'ئەلۆمنیۆمی عەزل و سلایدینگ',
      features: [
        'بەربەستی پۆلیەمایدی ٢٤ ملم بۆ جیاکردنەوەی گەرمای دەرەوە لە ژوورەوە',
        'ڕێڕەوی ستیلی دژە-ژەنگ بۆ هەڵگرتنی کێشی ٤٠٠ کگم بۆ هەر دەرگایەک',
        'سیستەمی شاراوەی ئاوەڕۆ بۆ ڕێگری لە کۆبوونەوەی باران',
        'قوفڵی فرە-خاڵی ئەوروپی بۆ ئاسایشی بەرز'
      ]
    },
    'facade-50f': {
      name: 'ڕووکاری شوشەیی کەرتن وۆڵ 50F',
      description: 'سیستەمی فەسادی شوشەیی بۆ کۆمپانیاکان، هۆتێل و پێشانگاکان بە پانی ٥٠ ملم پرۆفایلی بینراو.',
      subCategory: 'ڕوکاری باڵەخانە و کۆمپانیا',
      features: [
        'پرۆفایلی باریکی ٥٠ ملم بۆ زۆرترین هاتنەژوورەوەی ڕووناکی سروشتی',
        'سیستەمی ئاوەڕۆی ناوەکی فرە-نهۆم بۆ بارانی بەخوڕ',
        'پەنجەرەی هەواگۆڕکێی شاراوە لەناو فەسادەکەدا',
        'بەرگری بەرز لە ڕەشەبا و زریانی بەهێز'
      ]
    },
    'curtain-50f': {
      name: 'ڕووکاری شوشەیی کەرتن وۆڵ 50F',
      description: 'سیستەمی تەواوی ئەندازیاری ڕوکار بۆ عەزلی گەرمی، کۆنترۆڵی تیشکی خۆر و سەقامگیری باڵەخانە مۆدێرنەکان.',
      subCategory: 'ڕوکاری باڵەخانە و کۆمپانیا',
      features: ['پانی ٥٠ ملم', 'بەرگری باڵا لە ڕەشەبا', 'بەربەستی پۆلیەمایدی عەزل']
    },
    'pergolas': {
      name: 'سیستەمی پەڕگۆلای ئەلۆمنیۆمی زیرەک',
      description: 'پەڕگۆلای مۆتۆڕداری باڵەداری ئەلۆمنیۆم کە ڕووناکی، هەواگۆڕکێ و ئاوەڕۆ ڕێکدەخات بۆ باخچە و سەربانی ڤێلاکان.',
      subCategory: 'باخچە و دەرەوە',
      features: [
        'باڵەداری ئەلۆمنیۆمی سووڕاوە بە کۆنتڕۆڵ و هەستەوەری باران',
        'ڕووناکی لید بە توانای کەمکردنەوە و ئاوەڕۆی شاراوەی باران',
        'بەرگری تەواو لە بەفر و با بۆ هەموو وەرزەکان',
        'داپۆشینی لایەکان بە پەردەی زیرەکی زیپ یان شوشەی سلایدینگ'
      ]
    },
    'fences': {
      name: 'پەرژین و دەرگای ئەلۆمنیۆمی تەلارسازی',
      description: 'پەرژین و دەرگای سەرەکی ئەلۆمنیۆمی مۆدێرن بەبێ پێویستی بە چاککردنەوە و بە ڕەنگی نەگۆڕ بەرامبر خۆر.',
      subCategory: 'پەرژین و ئاسایشی دەوروبەر',
      features: [
        'گەرەنتی دژە-ژەنگ بەرامبەر کەشوهەوا و تیشکی بەهێزی خۆر',
        'دیزاینی مۆدێرن بۆ پاراستنی تایبەتمەندی و تێپەڕبوونی با',
        'گونجاوە لەگەڵ مۆتۆری کارەبایی دەرگای سلایدینگ و باڵدار',
        'بۆیەکرانی باڵا بە پەودەر کۆتینگی دژە-UV'
      ]
    },
    'shutters': {
      name: 'کەتیبەی کارەبایی و تاری دژە-مێروو',
      description: 'شەتەری کارەبایی مۆتۆڕدار بە فۆمی فیشاری پۆلیوریسین بۆ عەزلی گەرمی، دەنگ و پاراستنی ماڵ.',
      subCategory: 'سێبەر و پاراستن',
      features: [
        'مۆتۆری سۆمفی و کۆمۆنێللۆ بە کۆنتڕۆڵی بێ تەل',
        'فۆمی چڕی PU بۆ عەزلی گەرمی و کەمکردنەوەی ژاوەژاو',
        'تۆڕی ئەکۆردیۆنی پلایس بۆ پەنجەرە و دەرگای سلایدینگ'
      ]
    },
    'railings': {
      name: 'محاجەرەی شوشەی سکۆریتی باڵکۆن و پلیکانە',
      description: 'سیستەمی بنکەی ئەلۆمنیۆمی بێ ستوون بۆ ڕاگرتنی شوشەی لامینەیتی بەهێزی ١٦ تا ٢١.٥ ملم بە دیمەنی پانۆراما.',
      subCategory: 'سیستەمی باڵکۆن و پلیکانە',
      features: [
        'دیمەنی پانۆرامای تەواو بەبێ هیچ ستوونێکی لەربەردەست',
        'تاقیکراوەتەوە بۆ هێزی پاڵنانی ١.٥ تا ٣.٠ کیلۆنیوتن',
        'کونەکانی ئاوەڕۆی شاراوە لە بنکەی ئەلۆمنیۆمەکەدا',
        'دەسکی باریکی سەرەوە لە ئەلۆمنیۆمی مۆدێرن'
      ]
    },
    'atriums': {
      name: 'سەقفی شوشەیی و سکای لایتی ئەندازیاری',
      description: 'سەقفی شوشەیی هەرەمی و چەماوە بە ئاوەڕۆی ناوەکی دڵۆپەکردن و عەزلی گەرمی تەواو.',
      subCategory: 'سەقفی شوشە و ڕووناکی سروشتی',
      features: [
        'ڕێڕەوی ئەندازیاری بۆ دەرکردنی ئاوی دڵۆپەکردنی ناوەوە',
        'گونجاوە لەگەڵ شوشەی دژە-خۆری Low-E و سکۆریت',
        'پەنجەرەی هەواگۆڕکێی کارەبایی بە هەستەوەری باران'
      ]
    },
    'al-folding-77bf': {
      name: 'دەرگای ئەکۆردیۆنی ئەلۆمنیۆم 77BF',
      description: 'سیستەمی دەرگای فۆڵدینگ کە بە تەواوی دەچێتەوە یەک بۆ کردنەوەی تەواوی دیوار هەتا پانی ١٢ مەتر.',
      subCategory: 'دەرگای فۆڵدینگی ئەکۆردیۆن',
      features: [
        'چەرخی ستیلی قورس لە سەرەوە و خوارەوە بۆ جوڵەی ئاسان',
        'شێوازی نەرم و ڕێکخراو لە ٢ تا ١٠ باڵ',
        'لاستیکی دەبڵی EPDM بۆ عەزلی تەواوی با و باران'
      ]
    },
    'acc-window-line': {
      name: 'هێڵی ئێکسسواراتی پەنجەرە',
      description: 'کۆمەڵەی تەواوی میکانیزمی پەنجەرەی ئەوروپی لەوانە قۆڵی گێڕی قەپاتی و هەڵگەڕاوە، قۆڵی مەقەستی و نەرمە.',
      subCategory: 'میکانیزمی پەنجەرە',
      features: [
        'ئێکسسواراتی ئەوروپی باوەڕپێکراوی ماستەر ئیتاڵیا و ڤۆرنە',
        'ڕووکەشی دژە-ژەنگی زیوی بە کرۆمی پارێزەر',
        'نەرمەی سێ-ڕەهەندی بۆ پەستانی تەواوی لاستیکەکان'
      ]
    },
    'acc-door-line': {
      name: 'هێڵی ئێکسسواراتی دەرگا',
      description: 'ئێکسسواراتی دەرگای قورس لەوانە نەرمەی ڕێکخراوی سێ-ڕەهەندی، قوفڵی ئۆتۆماتیکی و سلندەری دژە-دزە.',
      subCategory: 'سیستەمی دەرگا',
      features: [
        'تاقیکراوەتەوە بۆ زیاتر لە ٢٠٠،٠٠٠ جار کردنەوە و داخستن',
        'پشتگیری دەرگای قورس هەتا کێشی ١٦٠ کگم دەکات',
        'سلندەری ئەوروپی دژە-دڕیل و دژە-شکاندن'
      ]
    },
    'acc-sliding-line': {
      name: 'هێڵی ئێکسسواراتی سلایدینگ',
      description: 'چەرخی ستیلی بێدەنگ، میکانیزمی هێبی شیبی و قوفڵی فرە-خاڵی لێوار.',
      subCategory: 'میکانیزمی سلایدینگ',
      features: [
        'چەرخی ستیلی بە دەفری نایلۆن بۆ جوڵەی بێدەنگ و نەرم',
        'میکانیزمی هێبی شیبی بۆ کێشی هەتا ٤٠٠ کگم بۆ هەر دەرگایەک',
        'قوفڵی فرە-خاڵ بە دەسکی تۆکمەی سەرنجڕاکێش'
      ]
    },
    'acc-handle-line': {
      name: 'هێڵی دەسکە تەلارسازییەکان',
      description: 'دەسکی دیزاینی ئەرگۆنۆمیک بۆ پەنجەرە و دەرگا لە ستیلی دژە-ژەنگ، ئەلۆمنیۆم و ڕەنگی ئانتراسیت.',
      subCategory: 'دەسکە تەلارسازییەکان',
      features: [
        'دەسکی پەنجەرەی Secustik® بە سیستەمی دژە-دەستکاریکردن',
        'دەسکی دەرگای سەرەکی درێژ تا ١٨٠٠ ملم لە ستیلی بەهێز',
        'ڕەنگە لوکسەکان: ڕەشی مات، زێڕی مات، ستیلی بریقەدار'
      ]
    }
  },
  ar: {
    'legend-80': {
      name: 'شبابيك ديكونينك ليجند 80',
      description: 'قمة العزل الحراري والصوتي. مصمم بعمق 80 ملم و 6 حجرات داخلية لتحمل حرارة صيف أربيل التي تتجاوز 50 درجة مئوية.',
      subCategory: 'عزل حراري فائق',
      features: [
        'تصميم هندسي بـ 6 حجرات لتوفير أقصى كفاءة طاقة بستاندارد باسيڤ هاوس',
        'مطاط EPDM ثلاثي لإحكام عزل الهواء والضوضاء والغبار',
        'يدعم زجاجاً ثلاثياً معزولاً بسماكة تصل إلى 52 ملم',
        'مفصلات أوروبية شديدة التحمل للأوزان والارتفاعات العالية',
        'مقاوم لأشعة الشمس فوق البنفسجية والعواصف الرملية'
      ]
    },
    'winsa-dorado-76': {
      name: 'شبابيك وينسا دورادو 76 عازلة للصوت',
      description: 'نظام 76 ملم شديد التحمل مخصص للشقق والأبراج والفلل الفاخرة لعزل الضوضاء وضغط الرياح.',
      subCategory: 'عزل صوتي فائق',
      features: [
        '5 حجرات عزل داخلية لقطع انتقال الحرارة',
        'دعائم فولاذية مجلفنة داخلية لمقاومة ضغط الرياح العاتية',
        'أقفال محيطية متعددة النقاط لأعلى درجات الأمان',
        'خيارات زجاج مزدوج وثلاثي حتى سماكة 44 ملم'
      ]
    },
    'hs76-sliding': {
      name: 'أبواب سحاب ثقيلة uPVC هيب شيب',
      description: 'هندسة متطورة للأبواب البانورامية المنزلقة تتحمل أوزاناً تصل إلى 300 كجم مع عتبة أرضية منبسطة وحركة انسيابية فائقة.',
      subCategory: 'سحب بانورامي ثقيل',
      features: [
        'عربات سحب هيدروليكية تتحمل حتى 300 كجم للضلفة الواحدة',
        'عتبة أرضية منبسطة تماماً بدون عوائق لحرية الحركة',
        'إغلاق محكم متعدد النقاط لمنع دخول الأتربة ومياه الأمطار',
        'أقصى شفافية زجاجية للاستمتاع بإطلالات بانورامية مفتوحة'
      ]
    },
    'upvc-everest-max-60': {
      name: 'شبابيك إيفرست ماكس 60 ملم',
      description: 'مصمم خصيصاً للتغيرات المناخية القاسية، يتميز بـ 4 حجرات داخلية ومطاط مزدوج مانع لتسرب الهواء.',
      subCategory: 'سكني كلاسيكي',
      features: [
        'هندسة 4 حجرات لتحقيق توازن مثالي في كفاءة العزل',
        'مطاط TPE أو EPDM مانع لتسرب الهواء والغبار',
        'دعامات فولاذية مجلفنة لصلابة هيكلية ممتازة',
        'إمكانية تركيب زجاج من 4 ملم مفرد حتى 32 ملم مزدوج معزول'
      ]
    },
    'upvc-legend-art-70': {
      name: 'شبابيك ليجند آرت 70 ملم',
      description: 'تصميم انسيابي أنيق بـ 5 حجرات يجمع بين الفخامة المعمارية وأعلى معايير العزل الحراري والصوتي.',
      subCategory: 'معماري فاخر',
      features: [
        'إطار نحيف وعصري بـ 5 حجرات عزل حراري',
        'نظام مطاط وسطي متطور لإحكام كامل ضد الماء والهواء',
        'عمق تجويف زجاجي يستوعب زجاجاً ثلاثياً حتى 44 ملم'
      ]
    },
    'lorenzo-70ls': {
      name: 'أبواب سحاب ألمنيوم لورنزو 70LS',
      description: 'نظام سحب معماري يتيح واجهات زجاجية ممتدة حتى ارتفاع 3 أمتار مع عزل حراري بجسور البولي أميد.',
      subCategory: 'سحب ألمنيوم معزول حرارياً',
      features: [
        'جسور عزل حراري بولي أميد 24 ملم لفصل درجات الحرارة الخارجية عن الداخل',
        'مسارات ستانلس ستيل فائقة التحمل تحمل حتى 400 كجم للضلفة',
        'نظام تصريف مياه مخفي يمنع تراكم مياه الأمطار الغزيرة',
        'أقفال محيطية متعددة النقاط للأمان التام ومنع تسريب الهواء'
      ]
    },
    'facade-50f': {
      name: 'واجهات زجاجية كيرتن وول 50F',
      description: 'نظام واجهات زجاجية هيكلية بعرض مرئي 50 ملم مصمم للأبراج والشركات والفنادق ومعارض السيارات.',
      subCategory: 'واجهات تجارية وأبراج',
      features: [
        'قطاعات نحيفة 50 ملم لزيادة دخول الضوء الطبيعي',
        'نظام تصريف داخلي متعدد المستويات لمعالجة مياه الأمطار',
        'فتحات تهوية مخفية مدمجة بالواجهة',
        'مقاومة عالية جداً لضغط الرياح والأحمال'
      ]
    },
    'curtain-50f': {
      name: 'واجهات زجاجية كيرتن وول 50F',
      description: 'نظام هندسي متكامل للواجهات يوفر العزل الحراري والتحكم الشمسي والأمان الإنشائي للمباني الحديثة.',
      subCategory: 'واجهات تجارية وأبراج',
      features: ['عرض مرئي 50 ملم', 'مقاومة فائقة للرياح', 'جسور عزل بولي أميد']
    },
    'pergolas': {
      name: 'برجولات دور هوم ألمنيوم ذكية بيوكليماتيك',
      description: 'برجولات ألمنيوم متحركة بمحركات ذكية للتحكم بأشعة الشمس والتهوية ومقاومة الأمطار للتراسات والحدائق الفاخرة.',
      subCategory: 'جلسات خارجية وحدائق',
      features: [
        'شفرات ألمنيوم دوارة بمحركات كهربائية وحساسات أمطار ورياح',
        'إضاءة LED محيطية مدمجة وقنوات تصريف مياه مخفية',
        'مقاومة معتمدة لأحمال الثلوج والرياح لجميع الفصول',
        'إمكانية إغلاق الجوانب بزجاج سحب أو ستائر زيب ذكية'
      ]
    },
    'fences': {
      name: 'أسوار وبوابات الألمنيوم المعمارية',
      description: 'أسوار وبوابات معمارية عصرية مقاومة للصدأ والعوامل الجوية مع طلاء عالي التحمل.',
      subCategory: 'أسوار وحماية محيطية',
      features: [
        'ضمان تام ضد الصدأ والتآكل والشمس الحارقة',
        'تصميمات معيارية توفر الخصوصية وتسمح بمرور الهواء',
        'متوافقة مع محركات الفتح الآلي المنزلقة والمفصلية',
        'طلاء بودرة إلكتروستاتيكي مقاوم للأشعة فوق البنفسجية'
      ]
    },
    'shutters': {
      name: 'شترات ألمنيوم معزولة وستائر حماية',
      description: 'شترات ألمنيوم محقونة بالفوم العازل بمحركات إيطالية وسومفي للتحكم في الضوء والحرارة والخصوصية.',
      subCategory: 'تظليل وحماية',
      features: [
        'محركات سومفي وكومونيللو أصلية مع ريموت كنترول لاسلكي',
        'فوم بولي يوريثان عالي الكثافة لعزل الحرارة والضوضاء',
        'ستائر بليسيه متحركة مانعة للحشرات للأبواب والنوافذ'
      ]
    },
    'railings': {
      name: 'درابزين وحواجز زجاجية إنشائية',
      description: 'أنظمة تثبيت سفلية للألواح الزجاجية المقواة 16-21.5 ملم بدون أعمدة رأسية لإطلالة بانورامية كاملة.',
      subCategory: 'بلكونات ودرابزين',
      features: [
        'رؤية بانورامية نقية بدون أي أعمدة رأسية',
        'مختبر لتحمل أحمال الدفع العالية من 1.5 إلى 3.0 كيلو نيوتن',
        'فتحات تصريف مياه مخفية في القاعدة السفلية',
        'هندريل ألمنيوم علوي نحيف بتصميم عصري'
      ]
    },
    'atriums': {
      name: 'قبب وأسقف زجاجية وسكاي لايت',
      description: 'أسقف وقبب زجاجية مفرغة حرارياً مع مسارات تصريف التكثيف الداخلي ومقاومة مياه الأمطار.',
      subCategory: 'أسقف زجاجية وإنارة طبيعية',
      features: [
        'قنوات هندسية لتصريف قطرات التكثيف الداخلي',
        'متوافق مع زجاج Low-E العاكس للحرارة وزجاج الأمان',
        'فتحات تهوية كهربائية مدمجة بحساسات للأمطار'
      ]
    },
    'al-folding-77bf': {
      name: 'أبواب ألمنيوم قابلة للطي فولدنج 77BF',
      description: 'نظام أبواب أكورديون منطوية بالكامل تفتح مساحات جدارية تصل إلى 12 متراً لربط الصالات بالحدائق.',
      subCategory: 'أبواب أكورديون قابلة للطي',
      features: [
        'عربات سفلية وعلوية ستانلس ستيل فائقة التحمل',
        'مرونة عالية في التشكيل من 2 إلى 10 ضلف',
        'مطاط EPDM مزدوج مستمر لمنع دخول الهواء والماء'
      ]
    },
    'acc-window-line': {
      name: 'إكسسوارات ومقابض النوافذ الأوروبية',
      description: 'مجموعات ميكانيكية متكاملة للنوافذ المفصلية والقلاب وأذرع الاحتكاك ومفاتيح الإغلاق المحيطية.',
      subCategory: 'ميكانيكا النوافذ',
      features: [
        'إكسسوارات أوروبية معتمدة من ماستر إيطاليا وفورني',
        'طلاء فضي ثلاثي الكروم مقاوم للتآكل والرطوبة',
        'مفصلات ثلاثية الأبعاد لضبط ضغط إحكام المطاط بدقة'
      ]
    },
    'acc-door-line': {
      name: 'إكسسوارات ومفصلات الأبواب الثقيلة',
      description: 'مفصلات 3D قابلة للضبط، أقفال محيطية أوتوماتيكية، وأسطوانات أمان أوروبية عالية التحمل.',
      subCategory: 'أنظمة الأبواب',
      features: [
        'مختبر لأكثر من 200,000 دورة فتح وإغلاق',
        'يتحمل أوزان أبواب تصل إلى 160 كجم للضلفة',
        'أسطوانات أمان أوروبية مضادة للحفر والكسر'
      ]
    },
    'acc-sliding-line': {
      name: 'إكسسوارات وعجلات أنظمة السحب',
      description: 'عجلات رولمان بلي ستانلس ستيل بحركة صامتة، أطقم آليات الرفع والسحب وأقفال الأمان.',
      subCategory: 'ميكانيكا السحب',
      features: [
        'محامل ستانلس ستيل مع غلاف نايلون لحركة صامتة وناعمة',
        'آليات هيبي شيبيه تتحمل حتى 400 كجم للضلفة',
        'أقفال محيطية بمقابض سحب فاخرة ومفاتيح أمان'
      ]
    },
    'acc-handle-line': {
      name: 'مقابض النوافذ والأبواب المعمارية',
      description: 'مقابض بتصميمات هندسية مريحة من الستانلس ستيل المقاوم للصدأ والألمنيوم المؤكسد بألوان فاخرة.',
      subCategory: 'مقابض معمارية',
      features: [
        'مقابض نوافذ Secustik® بنظام أمان ضد محاولات العبث من الخارج',
        'مقابض أبواب رئيسية طولية حتى 1800 ملم من الستانلس ستيل',
        'ألوان فاخرة: أسود مطفي، ذهبي ساتان، ستانلس ستيل لامع'
      ]
    }
  }
};

export function getLocalizedProduct(product: ProductItem, langCode: string): ProductItem {
  if (!product) return product;
  const baseLang = langCode.split('-')[0].toLowerCase();

  // 1. Direct translation stored on product object
  if (product.translations) {
    const directMatch = product.translations[langCode] || product.translations[baseLang];
    if (directMatch) {
      return {
        ...product,
        name: directMatch.name || product.name,
        description: directMatch.description || product.description,
        subCategory: directMatch.subCategory || product.subCategory,
        features: (directMatch.features && directMatch.features.length) ? directMatch.features : product.features
      };
    }
  }

  // 2. Arabic / Kurdish legacy properties on product
  if (baseLang === 'ar') {
    if (product.arabicName || product.arabicDescription) {
      return {
        ...product,
        name: product.arabicName || product.name,
        description: product.arabicDescription || product.description
      };
    }
  } else if (baseLang === 'ckb') {
    if (product.kurdishName || product.kurdishDescription) {
      return {
        ...product,
        name: product.kurdishName || product.name,
        description: product.kurdishDescription || product.description
      };
    }
  }

  // 3. Static localizations table lookup (direct match or baseLang)
  const langDict = PRODUCT_LOCALIZATIONS[langCode] || PRODUCT_LOCALIZATIONS[baseLang];
  if (langDict && langDict[product.id]) {
    const loc = langDict[product.id];
    return {
      ...product,
      name: loc.name || product.name,
      description: loc.description || product.description,
      subCategory: loc.subCategory || product.subCategory,
      features: loc.features || product.features,
      specs: loc.specs || product.specs
    };
  }

  // Missing translations retain the source; never substitute a different language.
  return product;
}
