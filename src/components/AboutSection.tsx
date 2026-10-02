import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AboutSectionProps {
  onExploreTypologies?: () => void;
  onOpenQuoteModal?: () => void;
}

interface PillarContent {
  title: string;
  description: string;
}

const PILLARS_BY_LANG: Record<string, PillarContent[]> = {
  "en": [
    {
      "title": "Extreme Climate Thermal Insulation",
      "description": "Engineered with advanced polyamide thermal break barriers to repel extreme summer heat and maintain cozy indoor temperatures during freezing winters."
    },
    {
      "title": "Acoustic Sound Insulation",
      "description": "6-chamber internal geometry combined with triple EPDM continuous gaskets effectively blocks busy city noise, traffic, and industrial sounds."
    },
    {
      "title": "Weatherproof & Storm Resistance",
      "description": "Reinforced aluminum structural sections and multi-chamber uPVC profiles withstand torrential downpours and heavy Middle Eastern dust storms."
    },
    {
      "title": "European Multipoint Security",
      "description": "Equipped with genuine Spanish STAC and Italian Comunello perimeter locking hardware with anti-lift security pins and heavy-duty hinges."
    }
  ],
  "en-GB": [
    {
      "title": "Extreme Climate Thermal Insulation",
      "description": "Engineered with advanced polyamide thermal break barriers to repel extreme summer heat and maintain cozy indoor temperatures during freezing winters."
    },
    {
      "title": "Acoustic Sound Insulation",
      "description": "6-chamber internal geometry combined with triple EPDM continuous gaskets effectively blocks busy city noise, traffic, and industrial sounds."
    },
    {
      "title": "Weatherproof & Storm Resistance",
      "description": "Reinforced aluminum structural sections and multi-chamber uPVC profiles withstand torrential downpours and heavy Middle Eastern dust storms."
    },
    {
      "title": "European Multipoint Security",
      "description": "Equipped with genuine Spanish STAC and Italian Comunello perimeter locking hardware with anti-lift security pins and heavy-duty hinges."
    }
  ],
  "en-US": [
    {
      "title": "Extreme Climate Thermal Insulation",
      "description": "Engineered with advanced polyamide thermal break barriers to repel extreme summer heat and maintain cozy indoor temperatures during freezing winters."
    },
    {
      "title": "Acoustic Sound Insulation",
      "description": "6-chamber internal geometry combined with triple EPDM continuous gaskets effectively blocks busy city noise, traffic, and industrial sounds."
    },
    {
      "title": "Weatherproof & Storm Resistance",
      "description": "Reinforced aluminum structural sections and multi-chamber uPVC profiles withstand torrential downpours and heavy Middle Eastern dust storms."
    },
    {
      "title": "European Multipoint Security",
      "description": "Equipped with genuine Spanish STAC and Italian Comunello perimeter locking hardware with anti-lift security pins and heavy-duty hinges."
    }
  ],
  "ar": [
    {
      "title": "عزل حراري فائق للمناخ القاسي",
      "description": "مصمم بحواجز بولي أميد متطورة لمقاومة حرارة الصيف التي تتجاوز 50 درجة مئوية والحفاظ على دفء واعتدال الجو الداخلي في الشتاء القارس."
    },
    {
      "title": "عزل صوتي فائق وهدوء تام",
      "description": "هندسة داخلية بـ 6 حجرات مع ثلاث طبقات من مطاط EPDM لعزل ضوضاء الشوارع وحركة المرور المزدحمة بفعالية عالية."
    },
    {
      "title": "مقاومة العواصف والأمطار والغبار",
      "description": "قطاعات ألمنيوم معززة ويو بي في سي متعدد الغرف لمنع تسرب مياه الأمطار الغزيرة ومقاومة العواصف الرملية الشديدة."
    },
    {
      "title": "أمان وقفل أوروبي متعدد النقاط",
      "description": "مزود بإكسسوارات إغلاق أصلية من STAC الإسبانية وComunello الإيطالية مع أقفال أمان متعددة النقاط ومفصلات فائقة التحمل."
    }
  ],
  "ckb": [
    {
      "title": "عەزلی گەرمی بۆ کەشوهەوای توند",
      "description": "بە بەربەستی پۆلیەمایدی ئەڵمانی دروستکراوە بۆ بەرگەگرتنی گەرمای سەروی ٥٠ پلەی هاوین و پاراستنی گەرمیی ناو ماڵ لە زستانی ساردی کوردستاندا."
    },
    {
      "title": "عەزلی دەنگی و بێدەنگی تەواو",
      "description": "پێکهاتەی ٦-خانەیی ناوەکی لەگەڵ لاستیکی سێقاتی EPDM دەنگەدەنگی شەقام، هاتوچۆی ئۆتۆمبێل و ژاوەژاوی شار بە تەواوی دەگرێت."
    },
    {
      "title": "بەرگری لە باران و ڕەشەبا و تۆزوخۆڵ",
      "description": "ئەلۆمنیۆمی بەهێزکراو و پرۆفایلی uPVC بەرگەی بارانی بەخوڕ، ڕەشەبای بەهێز و زریانی تۆزوخۆڵی ناوچەکە دەگرن بەبێ دزەکردنی ئاو و هەوا."
    },
    {
      "title": "سیستەمی قوفڵ و پاراستنی ئەوروپی",
      "description": "تەیارکراوە بە قوفڵی فرە-خاڵی بنەڕەتی ئیسپانی STAC و ئیتاڵی Comunello لەگەڵ پینی دژە-دزە و نەرمەی بەهێزی ئەوروپی بۆ پاراستنی تەواو."
    }
  ],
  "kmr": [
    {
      "title": "Îzolasyona Germiyê ya Bilind",
      "description": "Bi bendên polîamîd ên pêşketî hatiye çêkirin da ku li hember germahiya havînê ya 50°C+ û sermaya zivistanê germahiya hundir biparêze."
    },
    {
      "title": "Îzolasyona Deng û Bêdengî",
      "description": "Avahiya 6-odeyî tevî sê qat lastîkên EPDM rê li ber dengê qerebalixiya bajêr, trafîk û pîşesaziyê digire."
    },
    {
      "title": "Berxwedana li Hember Baran û Bahozan",
      "description": "Alumînyûma bihêzkirî û profilên uPVC li hember baranên gur, bahoz û toza herêmê bi tevahî berxwedêr in."
    },
    {
      "title": "Ewlehiya Pir-Xalî ya Ewropî",
      "description": "Bi pergalên qifilkirinê yên resen ên STAC a spanî û Comunello ya îtalî hatiye stendin ji bo parastina herî bilind."
    }
  ],
  "tr": [
    {
      "title": "Aşırı İklimler İçin Isı Yalıtımı",
      "description": "50°C üzerindeki yaz sıcaklarına karşı dayanıklı ve kışın iç mekan ısısını koruyan gelişmiş poliamid ısı bariyerleri ile tasarlanmıştır."
    },
    {
      "title": "Akustik Ses Yalıtımı ve Sessizlik",
      "description": "6 odacıklı iç geometri ve üçlü EPDM contalar, yoğun şehir trafiği ve dış gürültüyü tamamen engeller."
    },
    {
      "title": "Fırtına, Yağmur ve Toz Direnci",
      "description": "Güçlendirilmiş alüminyum ve uPVC profiller, şiddetli yağmur ve kum fırtınalarına karşı sıfır sızıntı garantisi sağlar."
    },
    {
      "title": "Avrupa Standartlarında Çok Noktalı Güvenlik",
      "description": "İspanyol STAC ve İtalyan Comunello kilit donanımları, hırsızlık önleyici pimler ve ağır hizmet tipi menteşelerle donatılmıştır."
    }
  ],
  "de": [
    {
      "title": "Wärmedämmung für Extremklima",
      "description": "Entwickelt mit fortschrittlichen Polyamid-Isolierstegen, um extremer Sommerhitze über 50°C standzuhalten und im Winter angenehme Innentemperaturen zu gewährleisten."
    },
    {
      "title": "Akustische Schalldämmung",
      "description": "6-Kammer-Innengeometrie kombiniert mit dreifachen EPDM-Dichtungen blockiert Verkehrslärm und Stadtgeräusche zuverlässig."
    },
    {
      "title": "Sturm- und Wetterbeständigkeit",
      "description": "Verstärkte Aluminiumprofile und Mehrkammer-uPVC trotzen starken Regenfällen und regionalen Sandstürmen ohne Wasser- oder Lufteintritt."
    },
    {
      "title": "Europäische Mehrfachverriegelung",
      "description": "Ausgestattet mit Originalbeschlägen von STAC (Spanien) und Comunello (Italien) inklusive Einbruchschutzbolzen und Schwerlastbändern."
    }
  ],
  "fr": [
    {
      "title": "Isolation Thermique pour Climats Extrêmes",
      "description": "Conçu avec des barrettes de rupture de pont thermique en polyamide pour repousser les chaleurs estivales supérieures à 50°C et préserver le confort hivernal."
    },
    {
      "title": "Isolation Acoustique Supérieure",
      "description": "Géométrie intérieure à 6 chambres et triple joint EPDM bloquant efficacement le bruit urbain et la circulation dense."
    },
    {
      "title": "Résistance aux Tempêtes et aux Intempéries",
      "description": "Profilés renforcés en aluminium et uPVC multicambre résistants aux pluies torrentielles et aux tempêtes de sable sans aucune infiltration."
    },
    {
      "title": "Sécurité Européenne Multipoints",
      "description": "Équipé de ferrures de verrouillage périmétrique STAC (Espagne) et Comunello (Italie) avec gâches anti-dégondage et paumelles renforcées."
    }
  ],
  "it": [
    {
      "title": "Isolamento Termico per Climi Estremi",
      "description": "Progettato con barriere a taglio termico in poliammide avanzata per respingere il calore estivo oltre i 50°C e mantenere la temperatura interna ideale anche negli inverni rigidi."
    },
    {
      "title": "Isolamento Acustico e Silenzio Assoluto",
      "description": "Geometria interna a 6 camere combinata con guarnizioni continue triple in EPDM che blocca efficacemente i rumori della città, il traffico e i suoni industriali."
    },
    {
      "title": "Resistenza a Tempeste e Intemperie",
      "description": "Profili strutturali in alluminio rinforzato e uPVC multicamera progettati per resistere a piogge torrenziali e tempeste di sabbia senza alcuna infiltrazione."
    },
    {
      "title": "Sicurezza Multipunto Europea",
      "description": "Dotato di meccanismi di chiusura perimetrale originali spagnoli STAC e italiani Comunello con perni antieffrazione e cerniere per carichi pesanti."
    }
  ],
  "es": [
    {
      "title": "Aislamiento Térmico para Climas Extremos",
      "description": "Diseñado con barreras de rotura de puente térmico de poliamida para repeler calores superiores a 50°C y mantener una temperatura interior óptima en invierno."
    },
    {
      "title": "Aislamiento Acústico y Confort Sonoro",
      "description": "Geometría interna de 6 cámaras y triple junta continua de EPDM que bloquean eficazmente el ruido del tráfico y la actividad urbana."
    },
    {
      "title": "Resistencia a Tormentas y Clima Adverso",
      "description": "Perfiles de aluminio estructural reforzado y uPVC multicámara resistentes a lluvias torrenciales y tormentas de arena sin filtraciones."
    },
    {
      "title": "Seguridad Multipunto Europea",
      "description": "Equipado con herrajes perimetrales originales de STAC (España) y Comunello (Italia) con bulones de seguridad antipalanca y bisagras reforzadas."
    }
  ],
  "es-MX": [
    {
      "title": "Aislamiento Térmico para Climas Extremos",
      "description": "Diseñado con barreras de poliamida para repeler calores extremos superiores a 50°C y conservar el confort interior en invierno."
    },
    {
      "title": "Aislamiento Acústico y Silencio Total",
      "description": "Geometría interna de 6 cámaras y triple sello continuo de EPDM que aíslan eficazmente el ruido del tráfico citadino."
    },
    {
      "title": "Resistencia a Tormentas y Huracanes",
      "description": "Perfiles de aluminio reforzado y uPVC multicámara para soportar tormentas severas y tolvaneras de polvo sin filtraciones de agua."
    },
    {
      "title": "Seguridad Multipunto Europea",
      "description": "Equipado con herrajes originales STAC y Comunello con pasadores de seguridad antipalanca y bisagras de uso rudo."
    }
  ],
  "pt": [
    {
      "title": "Isolamento Térmico para Climas Extremos",
      "description": "Projetado com barreiras de corte térmico em poliamida para repelir o calor superior a 50°C e manter o aconchego no inverno."
    },
    {
      "title": "Isolamento Acústico e Silêncio",
      "description": "Geometria interna de 6 câmaras combinada com juntas contínuas triplas em EPDM que bloqueiam eficazmente o ruído urbano."
    },
    {
      "title": "Resistência a Tempestades e Chuva",
      "description": "Alumínio estrutural reforçado e uPVC multicâmara que suportam temporais intensos e tempestades de areia sem infiltrações."
    },
    {
      "title": "Segurança Multiponto Europeia",
      "description": "Equipado com ferragens perimetrais originais STAC (Espanha) e Comunello (Itália) com pernos de segurança anti-elevação."
    }
  ],
  "pt-BR": [
    {
      "title": "Isolamento Térmico para Climas Extremos",
      "description": "Projetado com barreiras de corte térmico em poliamida para resistir a temperaturas acima de 50°C e manter o clima interno agradável."
    },
    {
      "title": "Isolamento Acústico e Silêncio Total",
      "description": "Geometria interna de 6 câmaras e três vedações contínuas de borracha EPDM para bloquear totalmente o ruído do trânsito."
    },
    {
      "title": "Resistência a Tempestades e Ventanias",
      "description": "Alumínio estrutural reforçado e PVC multicâmara com resistência comprovada contra chuvas torrenciais e ventos fortes."
    },
    {
      "title": "Segurança Multiponto Europeia",
      "description": "Equipado com ferragens perimetrais STAC e Comunello com pinos de travamento reforçados e dobradiças de alta durabilidade."
    }
  ],
  "fa": [
    {
      "title": "عایق حرارتی پیشرفته برای اقلیم گرم",
      "description": "طراحی‌شده با تیغه‌های پلی‌آمید آلمانی جهت دفع گرمای بالای ۵۰ درجه تابستان و حفظ دمای مطبوع داخلی در زمستان."
    },
    {
      "title": "عایق صوتی فوق‌العاده و آرامش کامل",
      "description": "ساختار داخلی ۶-کاناله به همراه ۳ ردیف لاستیک EPDM برای مسدود کردن کامل صدای ترافیک و هیاهوی شهری."
    },
    {
      "title": "مقاومت کامل در برابر باد، باران و گردوغبار",
      "description": "پروفیل‌های تقویت‌شده آلومینیوم و uPVC که در برابر طوفان‌های شدید شن و باران‌های سیل‌آسا بدون هیچ‌گونه نفوذی ایستادگی می‌کنند."
    },
    {
      "title": "سیستم قفل و امنیت چندنقطه‌ای اروپایی",
      "description": "مجهز به یراق‌آلات اورجینال اسپانیایی STAC و ایتالیایی Comunello با پین‌های ضدسرقت و لولاهای سنگین تحمل بار."
    }
  ],
  "ru": [
    {
      "title": "Теплоизоляция для экстремального климата",
      "description": "Разработано с терморазрывом из полиамида для защиты от 50-градусной жары летом и сохранения тепла в морозные зимы."
    },
    {
      "title": "Акустическая звукоизоляция и тишина",
      "description": "6-камерная геометрия профиля в сочетании с тройным контуром уплотнения EPDM надежно блокирует городской шум и звуки автострад."
    },
    {
      "title": "Устойчивость к штормам, ливням и пыли",
      "description": "Усиленные алюминиевые секции и многокамерный ПВХ выдерживают сильные шквалы и песчаные бури без малейших протечек."
    },
    {
      "title": "Европейская взломостойкость и мульти-замки",
      "description": "Оснащено оригинальной фурнитурой STAC (Испания) и Comunello (Италия) с противовзломными цапфами и усиленными петлями."
    }
  ],
  "zh-CN": [
    {
      "title": "抵御极端气候的高性能隔热断桥",
      "description": "采用高强度聚酰胺隔热条精心设计，有效阻隔50°C以上的严苛酷暑，并在严寒冬季锁住室内舒适温度。"
    },
    {
      "title": "超静音高标准声学降噪隔音",
      "description": "6腔体内部多腔构型配合三道优质EPDM连续密封胶条，完美过滤繁杂的城市车流及商业噪音。"
    },
    {
      "title": "无惧暴风雨与沙尘的超强耐候性",
      "description": "高强度加厚铝合金型材及多腔uPVC系统，从容应对倾盆暴雨与强沙尘暴，实现零渗水零漏风。"
    },
    {
      "title": "欧洲高等级多点防盗锁闭安全系统",
      "description": "标配原装西班牙STAC与意大利Comunello环形多点锁五金，搭载防撬安全锁点与重型承重铰链。"
    }
  ],
  "nl": [
    {
      "title": "Thermische isolatie voor extreme klimaten",
      "description": "Ontworpen met geavanceerde polyamide thermische onderbrekingen om extreme hitte tot 50°C buiten te houden en binnentemperaturen aangenaam te houden."
    },
    {
      "title": "Akoestische geluidsisolatie en rust",
      "description": "6-kamer binnengeometrie gecombineerd met driedubbele EPDM-dichtingen die verkeers- en stadslawaai doeltreffend tegenhouden."
    },
    {
      "title": "Weerbestendigheid en stormvastheid",
      "description": "Versterkte aluminium- en meerkamer-uPVC-profielen die zware stortbuien en stofstormen doorstaan zonder enige lekkage."
    },
    {
      "title": "Europese meerpuntsbeveiliging",
      "description": "Uitgerust met origineel Spaans STAC- en Italiaans Comunello-sluitwerk met inbraakwerende pennen en zware scharnieren."
    }
  ],
  "pl": [
    {
      "title": "Izolacja termiczna na ekstremalne klimaty",
      "description": "Zaprojektowane z zaawansowanymi przekładkami termicznymi z poliamidu, chroniącymi przed upałami powyżej 50°C i mrozem."
    },
    {
      "title": "Akustyczna izolacja dźwiękowa",
      "description": "6-komorowa geometria wewnętrzna w połączeniu z potrójnymi uszczelkami EPDM skutecznie tłumi hałas miejski i drogowy."
    },
    {
      "title": "Odporność na nawałnice i burze pyłowe",
      "description": "Wzmocnione sekcje aluminiowe i wielokomorowe uPVC wytrzymują ulewne deszcze i burze piaskowe bez żadnych nieszczelności."
    },
    {
      "title": "Europejskie bezpieczeństwo wielopunktowe",
      "description": "Wyposażone w oryginalne okucia hiszpańskie STAC i włoskie Comunello z ryglami antywłamaniowymi i wzmocnionymi zawiasami."
    }
  ],
  "ro": [
    {
      "title": "Izolație termică pentru climă extremă",
      "description": "Proiectat cu bariere de rupere termică din poliamidă avansată pentru a respinge căldura de peste 50°C și a păstra confortul iarna."
    },
    {
      "title": "Izolație fonică superioară și liniște",
      "description": "Geometrie internă cu 6 camere și garnituri continue triple din EPDM care blochează zgomotul traficului intens."
    },
    {
      "title": "Rezistență la furtuni și intemperii",
      "description": "Profile din aluminiu structural ranforsat și uPVC multicameral ce rezistă la ploi torențiale și furtuni de praf."
    },
    {
      "title": "Securitate multipunct europeană",
      "description": "Echipat cu feronerie originală spaniolă STAC și italiană Comunello, cu bolțuri de siguranță antiefracție."
    }
  ],
  "el": [
    {
      "title": "Θερμομόνωση για Ακραίες Κλιματικές Συνθήκες",
      "description": "Σχεδιασμένο με προηγμένες πολυαμιδικές θερμοδιακοπές για απόκρουση θερμοκρασιών άνω των 50°C και διατήρηση ιδανικού κλίματος τον χειμώνα."
    },
    {
      "title": "Ηχομόνωση και Απόλυτη Ησυχία",
      "description": "Εσωτερική γεωμετρία 6 θαλάμων σε συνδυασμό με τριπλά λάστιχα EPDM που μπλοκάρουν αποτελεσματικά τον θόρυβο της πόλης."
    },
    {
      "title": "Αντοχή σε Καταιγίδες και Καιρικά Φαινόμενα",
      "description": "Ενισχυμένα προφίλ αλουμινίου και uPVC που αντέχουν σε καταρρακτώδεις βροχές και αμμοθύελλες χωρίς διαρροές."
    },
    {
      "title": "Ευρωπαϊκή Ασφάλεια Πολλαπλών Σημείων",
      "description": "Εξοπλισμένο με γνήσια περιμετρικά εξαρτήματα STAC (Ισπανία) και Comunello (Ιταλία) με αντιδιαρρηκτικούς πείρους."
    }
  ],
  "sv": [
    {
      "title": "Termisk isolering för extremklimat",
      "description": "Konstruerad med avancerade polyamid-köldbryggsbrytare för att stå emot sommarhetta över 50°C och bevara behaglig inomhustemperatur på vintern."
    },
    {
      "title": "Akustisk ljudisolering och tystnad",
      "description": "6-kammargeometri kombinerad med tredubbla EPDM-tätningslister som effektivt stänger ute stadstrafik och buller."
    },
    {
      "title": "Storm- och väderbeständighet",
      "description": "Förstärkta aluminiumsektioner och flerkammar-uPVC som står emot skyfall och sandstormar utan något läckage."
    },
    {
      "title": "Europeisk flerpunktslåsning",
      "description": "Utrustad med spanska STAC- och italienska Comunello-beslag med inbrottssäkra tappar och kraftiga gångjärn."
    }
  ],
  "hi": [
    {
      "title": "अत्यधिक जलवायु के लिए थर्मल इन्सुलेशन",
      "description": "50 डिग्री सेल्सियस से अधिक गर्मी को रोकने और सर्दियों में इनडोर तापमान को बनाए रखने के लिए उन्नत पॉलियामाइड थर्मल ब्रेक के साथ निर्मित।"
    },
    {
      "title": "ध्वनिक ध्वनि इन्सुलेशन",
      "description": "6-कक्ष आंतरिक संरचना और ट्रिपल ईपीडिएम गास्केट व्यस्त शहर के शोर और यातायात को प्रभावी ढंग से रोकते हैं।"
    },
    {
      "title": "तूफान और मौसम प्रतिरोध",
      "description": "प्रबलित एल्यूमीनियम और मल्टी-चैंबर uPVC प्रोफाइल बिना किसी रिसाव के भारी बारिश और धूल भरी आंधी का सामना करते हैं।"
    },
    {
      "title": "यूरोपीय मल्टीपॉइंट सुरक्षा",
      "description": "एंटी-लिफ्ट सुरक्षा पिन और हेवी-ड्यूटी टिका के साथ असली स्पेनिश STAC और इतालवी Comunello हार्डवेयर से लैस।"
    }
  ],
  "ja": [
    {
      "title": "過酷な気候に対応する高度な断熱性能",
      "description": "50°Cを超える猛暑を遮断し、冬場も快適な室温を維持する最新のポリアミド製サーマルブレーク構造を採用。"
    },
    {
      "title": "優れた遮音性と静粛性",
      "description": "6つの断熱チャンバー構造とトリプルEPDMガスケットが、都市の喧騒や道路の騒音を効果的に遮断します。"
    },
    {
      "title": "暴風雨や砂嵐への強固な耐候性",
      "description": "補強アルミフレームと多層uPVCプロファイルにより、豪雨や砂塵嵐でも水密性・気密性を維持します。"
    },
    {
      "title": "欧州基準のマルチポイント防犯機構",
      "description": "スペインSTAC製およびイタリアComunello製の本社純正ロック金具、防犯ピン、強化ヒンジを標準装備。"
    }
  ],
  "ko": [
    {
      "title": "극한 기후 대응 최고급 단열 설계",
      "description": "50°C 이상의 극심한 여름 폭염을 차단하고 추운 겨울철 실내 온기를 온전히 보존하는 첨단 폴리아미드 단열 바 적용."
    },
    {
      "title": "완벽에 가까운 방음 및 차음성",
      "description": "6챔버 내부 구조와 3중 연속 EPDM 가스켓이 결합되어 번화한 도심 소음과 도로 교통음을 효과적으로 차단합니다."
    },
    {
      "title": "폭우 및 모래폭풍에 대한 뛰어난 내후성",
      "description": "보강 알루미늄 구조재와 다실형 uPVC 프로파일이 거센 폭우와 황사·모래폭풍에도 누수 없이 완벽한 기밀을 유지합니다."
    },
    {
      "title": "유럽 표준 다중 잠금 보안 하드웨어",
      "description": "스페인 STAC 및 이탈리아 Comunello 정품 하드웨어와 안티 리프트 방범 핀, 헤비듀티 힌지로 완벽한 방범을 실현합니다."
    }
  ],
  "kk": [
    {
      "title": "Төтенше климатқа арналған жылу оқшаулау",
      "description": "50°C-тан асатын жазғы аптаптан қорғап, қыста үйдің жылуын сақтайтын озық полиамидті термобөліктермен жасалған."
    },
    {
      "title": "Дыбыс оқшаулау және тыныштық",
      "description": "6 камералы ішкі құрылым мен 3 қабатты EPDM резеңке тығыздағыштары қала шуын толықтай блоктайды."
    },
    {
      "title": "Дауылға, жауынға және құмға төзімділік",
      "description": "Күшейтілген алюминий мен көп камералы uPVC нөсер жаңбыр мен қатты шаңды дауылдарға мінсіз төтеп береді."
    },
    {
      "title": "Еуропалық көпнүктелі қауіпсіздік жүйесі",
      "description": "Испаниялық STAC және италиялық Comunello фитингтерімен, бұзылуға қарсы пиндермен және күшейтілген топсалармен жабдықталған."
    }
  ],
  "sr": [
    {
      "title": "Термоизолација за екстремне климе",
      "description": "Конструисано са напредним полиамидним термичким прекидима за одбијање летњих врућина преко 50°C и очување унутрашње топлоте зими."
    },
    {
      "title": "Звучна изолација и потпуни мир",
      "description": "6-коморна унутрашња геометрија у комбинацији са троструким EPDM заптивкама ефикасно блокира саобраћајну буку."
    },
    {
      "title": "Отпорност на олује, кишу и прашину",
      "description": "Ојачани алуминијумски и вишекоморни uPVC профили издржавају обилне падавине и пешчане олује без цурења."
    },
    {
      "title": "Европска вишеструка сигурност",
      "description": "Опремљено оригиналним шпанским STAC и италијанским Comunello оковима са сигурносним клиновима против провала."
    }
  ],
  "hr": [
    {
      "title": "Toplinska izolacija za ekstremne klime",
      "description": "Konstruirano s naprednim poliamidnim prekidima toplinskog mosta za odbijanje ljetnih vrućina preko 50°C i očuvanje topline zimi."
    },
    {
      "title": "Zvučna izolacija i potpuni mir",
      "description": "6-komorna unutarnja geometrija u kombinaciji s trostrukim EPDM brtvama učinkovito blokira buku gradskog prometa."
    },
    {
      "title": "Otpornost na oluje, kišu i prašinu",
      "description": "Ojačani aluminijski i višekomorni uPVC profili podnose obilne pljuskove i pješčane oluje bez propuštanja vode i zraka."
    },
    {
      "title": "Europska višestruka sigurnost",
      "description": "Opremljeno originalnim španjolskim STAC i talijanskim Comunello okovima s protuprovalnim klinovima i teškim pantima."
    }
  ],
  "bs": [
    {
      "title": "Termoizolacija za ekstremne klime",
      "description": "Konstruisano sa naprednim poliamidnim termičkim prekidima za odbijanje ljetnih vrućina preko 50°C i očuvanje topline zimi."
    },
    {
      "title": "Zvučna izolacija i potpuni mir",
      "description": "6-komorna unutrašnja geometrija u kombinaciji s trostrukim EPDM dihtunzima efikasno blokira saobraćajnu i gradsku buku."
    },
    {
      "title": "Otpornost na oluje, kišu i prašinu",
      "description": "Ojačani aluminijski i višekomorni uPVC profili podnose jake pljuskove i pješčane oluje bez ikakvog propuštanja."
    },
    {
      "title": "Evropska višestruka sigurnost",
      "description": "Opremljeno originalnim španskim STAC i italijanskim Comunello okovima sa sigurnosnim klinovima i snažnim šarkama."
    }
  ],
  "sq": [
    {
      "title": "Izolim Termik për Klimë Ekstreme",
      "description": "Projektuar me barriera poliamidi me thyerje termike për t'i bërë ballë nxehtësisë mbi 50°C dhe ruajtur ngrohtësinë në dimër."
    },
    {
      "title": "Izolim Akustik dhe Heshtje e Plotë",
      "description": "Gjeometri e brendshme me 6 dhoma kombinuar me tri guarnicione EPDM që bllokojnë zhurmën e trafikut urban."
    },
    {
      "title": "Rezistencë ndaj Stuhive dhe Shiut të Fortë",
      "description": "Profile alumini të përforcuar dhe uPVC me shumë dhoma që përballojnë shirat e rrëmbyeshëm dhe stuhitë pa asnjë rrjedhje."
    },
    {
      "title": "Siguri Evropiane me Shumë Pika Mbylljeje",
      "description": "Pajisur me mekanizma origjinalë STAC (Spanjë) dhe Comunello (Itali) me kunja kundër vjedhjes dhe mentesha të forta."
    }
  ],
  "bg": [
    {
      "title": "Топлоизолация за екстремен климат",
      "description": "Проектиран с полиамидни термомостове за отблъскване на летните горещини над 50°C и запазване на уюта през зимата."
    },
    {
      "title": "Акустична звукоизолация и тишина",
      "description": "6-камерна геометрия и трислойни непрекъснати EPDM уплътнения, спиращи ефективно градския трафик и шум."
    },
    {
      "title": "Устойчивост на бури, дъжд и прах",
      "description": "Усилен алуминий и многокамерен uPVC, издържащи на проливни дъждове и пясъчни бури без протичане."
    },
    {
      "title": "Европейска многоточкова сигурност",
      "description": "Оборудван с оригинален обков от испански STAC и италиански Comunello с противовзломни шипове и здрави панти."
    }
  ]
};

const SECTION_HEADERS_BY_LANG: Record<string, { title: string; subtitle: string; plantBadge: string; plantDesc: string; exploreBtn: string }> = {
  "en": {
    "title": "Why Choose Doorhome Systems for Your Project?",
    "subtitle": "Operating under the Nafza Al-Manzl holding, Doorhome combines precision European extrusion engineering with local fabrication mastery to create buildings that last generations.",
    "plantBadge": "CNC Fabrication Plant",
    "plantDesc": "Automated double-miter cutting, robotic corner crimping & precision glass glazing.",
    "exploreBtn": "Explore Building Typologies"
  },
  "en-GB": {
    "title": "Why Choose Doorhome Systems for Your Project?",
    "subtitle": "Operating under the Nafza Al-Manzl holding, Doorhome combines precision European extrusion engineering with local fabrication mastery to create buildings that last generations.",
    "plantBadge": "CNC Fabrication Plant",
    "plantDesc": "Automated double-miter cutting, robotic corner crimping & precision glass glazing.",
    "exploreBtn": "Explore Building Typologies"
  },
  "en-US": {
    "title": "Why Choose Doorhome Systems for Your Project?",
    "subtitle": "Operating under the Nafza Al-Manzl holding, Doorhome combines precision European extrusion engineering with local fabrication mastery to create buildings that last generations.",
    "plantBadge": "CNC Fabrication Plant",
    "plantDesc": "Automated double-miter cutting, robotic corner crimping & precision glass glazing.",
    "exploreBtn": "Explore Building Typologies"
  },
  "ar": {
    "title": "لماذا تختار أنظمة دور هوم لمشروعك؟",
    "subtitle": "تحت مظلة مجموعة نفذة المنزل، تجمع دور هوم بين دقة الهندسة الأوروبية والإنتاج المحلي المتقن لتقديم أنظمة تدوم لأجيال.",
    "plantBadge": "مصنع الإنتاج الهندسي CNC",
    "plantDesc": "قص آلي مزدوج، كبس زوايا روبوتي وتركيب زجاج معزول بدقة هندسية متكاملة.",
    "exploreBtn": "استكشف نماذج المباني"
  },
  "ckb": {
    "title": "بۆچی سیستەمەکانی دۆرهۆم بۆ پڕۆژەکەت هەڵبژێریت؟",
    "subtitle": "لە ژێر چەتری گروپی نەفزە المنزڵ، دۆرهۆم ئەندازیاری وردی ئەوروپی لەگەڵ دروستکردنی ناوخۆیی تێکەڵ دەکات بۆ دروستکردنی پەنجەرە و دەرگایەک کە نەوە لە دوای نەوە دەمێنێتەوە.",
    "plantBadge": "کارگەی ئەندازیاری CNC",
    "plantDesc": "بڕینی ئەلیکترۆنی جووت-گۆشە، پەستانی ڕۆبۆتی گۆشەکان و جێگیرکردنی شوشەی عەزل بە تەواوی ستاندارد.",
    "exploreBtn": "بینینی جۆرەکانی باڵەخانە"
  },
  "kmr": {
    "title": "Çima Doorhome ji bo projeya xwe hilbijêrî?",
    "subtitle": "Li jêr sîwana koma Nafza Al-Manzl, Doorhome endezyariya rast a ewropî bi hilberîna herêmî re dike yek ji bo pergalên mayînde.",
    "plantBadge": "Fabrîqeya Hilberîna CNC",
    "plantDesc": "Birîna otomatîk a ducarî, pêçandina goşeyan a robotîk û sazkirina cama îzolekirî bi standarda bilind.",
    "exploreBtn": "Cureyên Avahiyan Bibîne"
  },
  "tr": {
    "title": "Projeniz İçin Neden Doorhome Sistemlerini Seçmelisiniz?",
    "subtitle": "Nafza Al-Manzl grubu bünyesinde faaliyet gösteren Doorhome, nesiller boyu dayanacak binalar yaratmak için hassas Avrupa ekstrüzyon mühendisliğini yerel üretim ustalığıyla birleştirir.",
    "plantBadge": "CNC Üretim Fabrikası",
    "plantDesc": "Otomatik çift açılı kesim, robotik köşe presleme ve hassas ısıcam montajı.",
    "exploreBtn": "Yapı Tipolojilerini Keşfedin"
  },
  "de": {
    "title": "Warum Doorhome-Systeme für Ihr Projekt wählen?",
    "subtitle": "Unter dem Dach der Holding Nafza Al-Manzl vereint Doorhome europäische Präzisionsextrusion mit meisterhafter Fertigung vor Ort für langlebige Bauwerke.",
    "plantBadge": "CNC-Fertigungswerk",
    "plantDesc": "Automatischer Doppelgehrungsschnitt, robotisches Eckverpressen & hochpräzise Verglasung.",
    "exploreBtn": "Gebäudetypologien entdecken"
  },
  "fr": {
    "title": "Pourquoi Choisir les Systèmes Doorhome pour Votre Projet ?",
    "subtitle": "Sous l'égide du groupe Nafza Al-Manzl, Doorhome allie la précision de l'ingénierie européenne à la maîtrise de la fabrication locale pour créer des bâtiments durables.",
    "plantBadge": "Usine de Fabrication CNC",
    "plantDesc": "Découpe automatique à double onglet, sertissage robotisé des angles et vitrage de précision.",
    "exploreBtn": "Explorer les Typologies"
  },
  "it": {
    "title": "Perché Scegliere i Sistemi Doorhome per il Tuo Progetto?",
    "subtitle": "Sotto la holding Nafza Al-Manzl, Doorhome combina la precisione dell'ingegneria europea dell'estrusione con la maestria produttiva locale per creare edifici destinati a durare per generazioni.",
    "plantBadge": "Impianto di Fabbricazione CNC",
    "plantDesc": "Taglio automatico a doppia inclinazione, crimpatura robotica degli angoli e vetratura di precisione.",
    "exploreBtn": "Esplora le Tipologie Edilizie"
  },
  "es": {
    "title": "¿Por Qué Elegir los Sistemas Doorhome para su Proyecto?",
    "subtitle": "Bajo el grupo Nafza Al-Manzl, Doorhome une la precisión de la ingeniería europea con la maestría de la fabricación local para crear edificios que perduran generaciones.",
    "plantBadge": "Planta de Fabricación CNC",
    "plantDesc": "Corte automático de doble inglete, crimpado robótico de esquinas y acristalamiento de precisión.",
    "exploreBtn": "Explorar Tipologías"
  },
  "es-MX": {
    "title": "¿Por Qué Elegir los Sistemas Doorhome para su Proyecto?",
    "subtitle": "Bajo el grupo Nafza Al-Manzl, Doorhome combina la precisión europea con la maestría de fabricación local para crear obras arquitectónicas duraderas.",
    "plantBadge": "Planta de Fabricación CNC",
    "plantDesc": "Corte automático doble inglete, remachado robótico de esquinas y acristalamiento de precisión.",
    "exploreBtn": "Explorar Tipologías"
  },
  "pt": {
    "title": "Por Que Escolher os Sistemas Doorhome para o Seu Projeto?",
    "subtitle": "Sob a holding Nafza Al-Manzl, a Doorhome combina a engenharia europeia de precisão com o domínio do fabrico local para criar edifícios que atravessam gerações.",
    "plantBadge": "Fábrica de Fabrico CNC",
    "plantDesc": "Corte automático de dupla esquadria, cravação robótica de cantos e envidraçamento de precisão.",
    "exploreBtn": "Explorar Tipologias"
  },
  "pt-BR": {
    "title": "Por Que Escolher os Sistemas Doorhome para o Seu Projeto?",
    "subtitle": "Sob a holding Nafza Al-Manzl, a Doorhome combina a engenharia europeia de precisão com a maestria da fabricação local para criar obras duradouras.",
    "plantBadge": "Fábrica de Produção CNC",
    "plantDesc": "Corte automático de esquadria dupla, prensagem robótica de cantos e instalação de vidros com alta precisão.",
    "exploreBtn": "Explorar Tipologias"
  },
  "fa": {
    "title": "چرا سیستم‌های دۆرهۆم را برای پروژه خود انتخاب کنید؟",
    "subtitle": "تحت نظارت هلدینگ نفذة المنزل، دۆرهۆم مهندسی دقیق اروپایی را با مهارت تولید محلی ترکیب می‌کند تا بناهایی بسازد که نسل‌ها پابرجا بمانند.",
    "plantBadge": "کارخانه تولید پیشرفته CNC",
    "plantDesc": "برش کامپیوتری دوگانه، پرس رباتیک گوشه‌ها و نصب فوق‌العاده شیشه‌های دوجداره عایق.",
    "exploreBtn": "مشاهده کاربری‌های ساختمانی"
  },
  "ru": {
    "title": "Почему выбирают системы Doorhome для своих проектов?",
    "subtitle": "Работая в составе холдинга Nafza Al-Manzl, Doorhome объединяет передовую европейскую инженерию с мастерством локального производства.",
    "plantBadge": "Завод с ЧПУ производством",
    "plantDesc": "Автоматическая резка под двойным углом, роботизированный обжим углов и точное остекление.",
    "exploreBtn": "Типологии зданий"
  },
  "zh-CN": {
    "title": "为什么选择 Doorhome 顶级系统作为您的项目之选？",
    "subtitle": "在 Nafza Al-Manzl 集团旗下，Doorhome 将欧洲严谨的型材工程标准与精益制造技术深度融合，筑造历经岁月沉淀的世纪建筑。",
    "plantBadge": "智能数控 CNC 智造工厂",
    "plantDesc": "全自动高精双头数控切割、工业机器人角码组角与微米级严苛打胶装配工艺。",
    "exploreBtn": "浏览建筑空间应用"
  },
  "nl": {
    "title": "Waarom kiezen voor Doorhome-systemen voor uw project?",
    "subtitle": "Onder de vleugels van Nafza Al-Manzl combineert Doorhome Europese precisie-extrusie met lokaal vakmanschap voor gebouwen die generaties meegaan.",
    "plantBadge": "CNC Productiefabriek",
    "plantDesc": "Geautomatiseerd dubbel verstekzagen, robotische hoekpersing en precisiebeglazing.",
    "exploreBtn": "Ontdek Gebouwtypologieën"
  },
  "pl": {
    "title": "Dlaczego warto wybrać systemy Doorhome do swojego projektu?",
    "subtitle": "Pod skrzydłami holdingu Nafza Al-Manzl, Doorhome łączy precyzję europejskiej inżynierii z mistrzostwem lokalnej produkcji, tworząc architekturę na pokolenia.",
    "plantBadge": "Zakład Produkcyjny CNC",
    "plantDesc": "Automatyczne cięcie dwugłowicowe, robotyczne zagniatanie naroży i precyzyjne szklenie.",
    "exploreBtn": "Odkryj Typologie Budynków"
  },
  "ro": {
    "title": "De ce să alegeți sistemele Doorhome pentru proiectul dumneavoastră?",
    "subtitle": "Sub holdingul Nafza Al-Manzl, Doorhome îmbină ingineria europeană de precizie cu măiestria producției locale pentru a crea clădiri durabile.",
    "plantBadge": "Fabrică de Producție CNC",
    "plantDesc": "Tăiere automată la dublu unghi, sertizare robotică a colțurilor și vitrare de precizie.",
    "exploreBtn": "Explorează Tipologiile"
  },
  "el": {
    "title": "Γιατί να Επιλέξετε τα Συστήματα Doorhome για το Έργο σας;",
    "subtitle": "Υπό τον όμιλο Nafza Al-Manzl, η Doorhome συνδυάζει την ευρωπαϊκή μηχανική ακριβείας με την τοπική κατασκευαστική υπεροχή για κτίρια που διαρκούν για γενιές.",
    "plantBadge": "Εργοστάσιο Παραγωγής CNC",
    "plantDesc": "Αυτόματη κοπή διπλής γωνίας, ρομποτική πτύχωση γωνιών και υάλωση ακριβείας.",
    "exploreBtn": "Εξερευνήστε Τυπολογίες"
  },
  "sv": {
    "title": "Varför välja Doorhome-system för ditt projekt?",
    "subtitle": "Under Nafza Al-Manzl-holdingföretaget kombinerar Doorhome europeisk precisionsextrudering med lokalt hantverk för byggnader som varar i generationer.",
    "plantBadge": "CNC-produktionsanläggning",
    "plantDesc": "Automatiserad dubbelgering, robotiserad hörnpresning och precisionsinglasning.",
    "exploreBtn": "Utforska Byggnadstypologier"
  },
  "hi": {
    "title": "अपनी परियोजना के लिए डोरहोम सिस्टम क्यों चुनें?",
    "subtitle": "Nafza Al-Manzl होल्डिंग के तहत, डोरहोम यूरोपीय परिशुद्धता इंजीनियरिंग को स्थानीय विनिर्माण महारत के साथ जोड़ता है।",
    "plantBadge": "सीएनसी निर्माण संयंत्र",
    "plantDesc": "स्वचालित कटिंग, रोबोटिक कॉर्नर क्रिम्पिंग और सटीक ग्लास ग्लेज़िंग।",
    "exploreBtn": "भवन प्रकार देखें"
  },
  "ja": {
    "title": "Doorhomeシステムが選ばれる理由",
    "subtitle": "Nafza Al-Manzlホールディングスのもと、Doorhomeは欧州の精密エンジニアリングと自社工場の高い加工技術を融合させ、何世代にもわたって価値を保ち続ける建築を創造します。",
    "plantBadge": "最新鋭CNC加工工場",
    "plantDesc": "自動ダブルマイター切断、ロボットによる高精度コーナー圧着、精密グレージング技術。",
    "exploreBtn": "建築用途別ソリューション"
  },
  "ko": {
    "title": "귀하의 프로젝트에 Doorhome 시스템을 선택해야 하는 이유",
    "subtitle": "Nafza Al-Manzl 지주회사 산하의 Doorhome은 정밀한 유럽식 압출 엔지니어링과 현지 정밀 가공 기술을 융합하여 세대를 이어갈 건축물을 완성합니다.",
    "plantBadge": "첨단 CNC 자동화 가공 공장",
    "plantDesc": "자동 양두 정밀 절단, 로봇 코너 크림핑 및 마이크로 정밀 유리 글레이징 기술.",
    "exploreBtn": "건축 유형별 솔루션 살펴보기"
  },
  "kk": {
    "title": "Жобаңыз үшін неге Doorhome жүйелерін таңдау керек?",
    "subtitle": "Nafza Al-Manzl холдингі аясында Doorhome дәл еуропалық инженерияны жергілікті өндіріс шеберлігімен ұштастырып, ұрпақтарға қызмет ететін ғимараттар жасайды.",
    "plantBadge": "CNC өндірістік зауыты",
    "plantDesc": "Автоматты қос бұрышты кесу, бұрыштарды роботты қысу және дәл шынылау.",
    "exploreBtn": "Ғимарат түрлерін көру"
  },
  "sr": {
    "title": "Зашто одабрати Doorhome системе за ваш пројекат?",
    "subtitle": "Под окриљем холдинга Nafza Al-Manzl, Doorhome спаја прецизност европског инжењеринга са мајсторством локалне производње за објекте који трају генерацијама.",
    "plantBadge": "CNC производни погон",
    "plantDesc": "Аутоматско двоструко резање, роботско спајање углова и прецизно застакљивање.",
    "exploreBtn": "Типологије објеката"
  },
  "hr": {
    "title": "Zašto odabrati Doorhome sustave za svoj projekt?",
    "subtitle": "Pod okriljem Nafza Al-Manzl holdinga, Doorhome spaja preciznost europskog inženjeringa s majstorstvom lokalne proizvodnje za zgrade koje traju generacijama.",
    "plantBadge": "CNC proizvodni pogon",
    "plantDesc": "Automatsko dvostruko rezanje, robotsko prešanje kutova i precizno ostakljivanje.",
    "exploreBtn": "Tipologije objekata"
  },
  "bs": {
    "title": "Zašto odabrati Doorhome sisteme za svoj projekt?",
    "subtitle": "Pod okriljem holdinga Nafza Al-Manzl, Doorhome spaja preciznost evropskog inženjeringa s majstorstvom lokalne proizvodnje za objekte koji traju generacijama.",
    "plantBadge": "CNC proizvodni pogon",
    "plantDesc": "Automatsko dvostruko rezanje, robotsko spajanje uglova i precizno ostakljivanje.",
    "exploreBtn": "Tipologije objekata"
  },
  "sq": {
    "title": "Pse të Zgjidhni Sistemet Doorhome për Projektin Tuaj?",
    "subtitle": "Nën kujdesin e holdingut Nafza Al-Manzl, Doorhome ndërthur inxhinierinë precize evropiane me mjeshtërinë e prodhimit lokal për ndërtesa që zgjasin ndër breza.",
    "plantBadge": "Fabrika e Prodhimit me CNC",
    "plantDesc": "Prerje automatike me dy kënde, ngjeshje robotike e qosheve dhe xhamëzim me precizion.",
    "exploreBtn": "Eksploroni Tipologjitë e Ndërtesave"
  },
  "bg": {
    "title": "Защо да изберете системите на Doorhome за вашия проект?",
    "subtitle": "Под шапката на холдинга Nafza Al-Manzl, Doorhome обединява европейското прецизно инженерство с местно производствено майсторство за сгради за поколения напред.",
    "plantBadge": "CNC Фабрика за производство",
    "plantDesc": "Автоматично рязане под двоен ъгъл, роботизирано кербоване на ъгли и прецизно остъкляване.",
    "exploreBtn": "Разгледайте сградните типологии"
  }
};

export const AboutSection: React.FC<AboutSectionProps> = ({
  onExploreTypologies,
  onOpenQuoteModal
}) => {
  const { currentLanguage } = useLanguage();
  const [factoryImage, setFactoryImage] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('winhome_cms_homepage_media') || '{}').aboutFactoryImage || '/products-assets/photo_63_2026-09-26_07-36-01.jpg';
    } catch {
      return '/products-assets/photo_63_2026-09-26_07-36-01.jpg';
    }
  });
  useEffect(() => {
    const sync = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('winhome_cms_homepage_media') || '{}');
        setFactoryImage(saved.aboutFactoryImage || '/products-assets/photo_63_2026-09-26_07-36-01.jpg');
      } catch { /* Keep the current image when saved content is invalid. */ }
    };
    window.addEventListener('cms_homepage_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('cms_homepage_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  const baseLang = currentLanguage.code.split('-')[0];

  const pillarItems =
    PILLARS_BY_LANG[currentLanguage.code] ||
    PILLARS_BY_LANG[baseLang] ||
    PILLARS_BY_LANG.en;

  const headerContent =
    SECTION_HEADERS_BY_LANG[currentLanguage.code] ||
    SECTION_HEADERS_BY_LANG[baseLang] ||
    SECTION_HEADERS_BY_LANG.en;

  return (
    <section id="about" className="w-full py-16 sm:py-24 bg-[radial-gradient(ellipse_at_95%_0%,rgba(220,38,38,0.07),transparent_40%),#fff] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 border-l-[3px] border-red-600 pl-5 sm:pl-7 dh-reveal">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {headerContent.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {headerContent.subtitle}
          </p>
        </div>

        {/* Alumil-Style 2-Column Split Feature Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: High-Impact Photography with Floating Badges */}
          <div className="lg:col-span-5 relative dh-reveal-left">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
              <img
                src={factoryImage}
                alt="Doorhome CNC Plant & Engineering"
                className="w-full h-[460px] object-cover object-center group-hover:scale-103 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/products-assets/photo_63_2026-09-26_07-36-01.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-black/20" />

              {/* Bottom Overlay Label */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-400 block">
                  {headerContent.plantBadge}
                </span>
                <p className="text-sm font-bold text-slate-100 mt-1">
                  {headerContent.plantDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Pillar Features Grid (Centered) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {pillarItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl bg-white border border-slate-200/90 border-t-2 border-t-red-200 hover:border-t-red-500 hover:shadow-lg transition-all duration-300 group text-center flex flex-col items-center justify-center dh-reveal dh-stagger-${idx + 1} dh-card-hover`}
                >
                  <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-red-600 transition-colors mb-2 leading-snug text-center">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed text-center">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Actions Centered */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 dh-reveal dh-stagger-5">
              <button
                onClick={onExploreTypologies}
                className="px-7 py-3.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>{headerContent.exploreBtn}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
