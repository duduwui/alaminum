const fs = require('fs');
const path = require('path');

// ── Window Products – unique titles & descriptions ──────────────────────────

const updates = [
  {
    id: 'prod-black-zip-screen-shutter',
    en: {
      name: 'Motorized Exterior Screen for Facades and Open Spaces',
      description: `This motorized exterior screen provides a sleek and practical solution for controlling sunlight, heat, and privacy across wide facade openings. Whether installed on terraces, covered patios, or large window bays, it rolls down smoothly to create a comfortable shaded environment while maintaining an unobstructed view when fully retracted.\n\nDesigned to withstand harsh weather conditions, the screen offers excellent protection against intense sun, dust, and insects, making it ideal for homes, restaurants, hotels, and commercial buildings. Its clean, modern appearance integrates seamlessly with contemporary architecture, adding both function and visual appeal to any exterior.\n\nBuilt for quiet, effortless operation, the screen can be controlled with a remote or integrated into smart home systems for automated scheduling. It is a long-lasting, low-maintenance addition that enhances outdoor comfort and energy efficiency throughout the year.`
    },
    ar: {
      name: 'ستارة خارجية آلية للواجهات والمساحات المفتوحة',
      description: `توفر هذه الستارة الخارجية الآلية حلاً أنيقاً وعملياً للتحكم بأشعة الشمس والحرارة والخصوصية على فتحات الواجهات الواسعة. سواء تم تركيبها على التراسات أو الأفنية المغطاة أو فتحات النوافذ الكبيرة، فإنها تنزلق بسلاسة لتوفر بيئة مظللة مريحة مع الحفاظ على إطلالة مفتوحة بالكامل عند طيّها.\n\nصُممت لتتحمل الظروف المناخية القاسية، حيث توفر حماية ممتازة من أشعة الشمس الحارقة والغبار والحشرات، مما يجعلها خياراً مثالياً للمنازل والمطاعم والفنادق والمباني التجارية. يتناسق مظهرها العصري النظيف بانسجام تام مع الهندسة المعمارية الحديثة، مضيفةً وظيفة عملية وجمالاً بصرياً لأي واجهة خارجية.\n\nصُنعت للعمل بهدوء وسهولة تامة، ويمكن التحكم بها عن بُعد أو دمجها مع أنظمة المنزل الذكي للتشغيل التلقائي المُجدول. إنها إضافة متينة وقليلة الصيانة تعزز الراحة الخارجية وكفاءة الطاقة على مدار العام.`
    },
    ckb: {
      name: 'پەردەی دەرەوەی ئۆتۆماتیکی بۆ ڕووکارەکان و شوێنە کراوەکان',
      description: `ئەم پەردەیە دەرەوەیە ئۆتۆماتیکیە چارەسەرێکی شیک و کاریگەر دابین دەکات بۆ کۆنتڕۆڵکردنی تیشکی خۆر و گەرمی و تایبەتمەندی لەسەر کراوەییە فراوانەکانی ڕووکار. جا لەسەر تەڕاس یان حەوشەی سەرپۆشکراو یان کراوەییە گەورەکانی پەنجەرە دابنرێت، بە نەرمی دادەچێت بۆ دروستکردنی ژینگەیەکی سێبەری ئارام لەگەڵ پاراستنی دیمەنی کراوە بە تەواوی کاتێک هەڵدەپەچرێتەوە.\n\nدیزاین کراوە بۆ بەرگەگرتنی بارودۆخی کەشوهەوای سەخت، پاراستنی نایاب دەبەخشێت لە تیشکی خۆری توند و تۆز و مێروو، کە دەیکاتە هەڵبژاردەیەکی گونجاو بۆ ماڵەکان و چێشتخانەکان و هوتێلەکان و بیناکانی بازرگانی. ڕووکاری هاوچەرخی پاک بە یەکگرتوویی تەواو لەگەڵ تەلارسازیی مۆدێرن دەگونجێت و کارایی و جوانی بینایی بە هەر ڕووکارێکی دەرەوە زیاد دەکات.\n\nدروست کراوە بۆ کارکردنی بێدەنگ و ئاسان، دەکرێت بە دووری یان بە هاوکاری سیستەمە زیرەکەکانی ماڵ کۆنتڕۆڵ بکرێت بۆ کارپێکردنی ئۆتۆماتیکی بەرنامە ڕێژکراو. زیادکردنێکی بەردەوام و کەم چاککردنەوەیە کە ئاسایشی دەرەوە و کاریگەری وزە بەهێز دەکات بە درێژایی ساڵ.`
    }
  },
  {
    id: 'win-guillotine-panoramic',
    en: {
      name: 'Full-Height Panoramic Glass Wall for Terraces and Lounges',
      description: `This full-height panoramic glass wall system transforms any terrace or lounge into a seamless indoor-outdoor living space. The large glass panels slide vertically and stack neatly, opening up the entire wall to fresh air and natural scenery while maintaining an elegant, frameless appearance when closed.\n\nPerfect for restaurants, cafes, hotel lobbies, and luxury residences, this system creates a bright, airy atmosphere that attracts attention and enhances guest experience. It provides excellent protection from wind and weather when closed, yet opens fully to merge interior spaces with gardens, pool areas, or city views.\n\nThe smooth, quiet mechanism ensures reliable daily operation with minimal maintenance. Its modern, minimalist design suits a wide range of architectural styles, from contemporary commercial venues to upscale private homes, making it a versatile and impressive investment for any premium space.`
    },
    ar: {
      name: 'جدار زجاجي بانورامي بالكامل للتراسات والصالات',
      description: `يُحوّل هذا النظام الزجاجي البانورامي بالارتفاع الكامل أي تراس أو صالة إلى مساحة معيشة متصلة بين الداخل والخارج دون حدود. تنزلق الألواح الزجاجية الكبيرة عمودياً وتُطوى بترتيب، لتفتح الجدار بأكمله أمام الهواء النقي والمناظر الطبيعية مع الحفاظ على مظهر أنيق بدون إطارات عند الإغلاق.\n\nمثالي للمطاعم والمقاهي وبهو الفنادق والمساكن الفاخرة، يخلق هذا النظام أجواءً مشرقة ومنعشة تجذب الانتباه وتُعزّز تجربة الضيوف. يوفر حماية ممتازة من الرياح والطقس عند الإغلاق، ومع ذلك ينفتح بالكامل ليدمج المساحات الداخلية مع الحدائق ومناطق المسابح أو إطلالات المدينة.\n\nتضمن آلية التشغيل السلسة والهادئة أداءً يومياً موثوقاً مع حد أدنى من الصيانة. يتناسب تصميمه العصري البسيط مع مجموعة واسعة من الأنماط المعمارية، من الأماكن التجارية الحديثة إلى المنازل الخاصة الراقية، مما يجعله استثماراً متعدد الاستخدامات ومُبهراً لأي مساحة مميزة.`
    },
    ckb: {
      name: 'دیواری شووشەیی پانۆرامی بەرزی تەواو بۆ تەڕاس و هۆڵەکان',
      description: `ئەم سیستمە دیواری شووشەیی پانۆرامی بەرزی تەواو هەر تەڕاسێک یان هۆڵێک دەگۆڕێت بۆ شوێنی ژیانی کراوەی ناوەوە-دەرەوە بێ سنوور. تاختە شووشەییە گەورەکان بە ستوونی هەڵدەچن و بە ڕێکوپێکی دادەپەچرێنەوە، هەموو دیوارەکە دەکەنەوە بۆ هەوای پاک و دیمەنی سروشتی لەگەڵ پاراستنی ڕوالەتێکی شیک و بێ چوارچێوە کاتێک داخراوە.\n\nگونجاوە بۆ چێشتخانەکان و کافێکان و لۆبی هوتێلەکان و نیشتەجێگاکانی لوکس، ئەم سیستمە ئاوهەوایەکی ڕووناک و هەوادار دروست دەکات کە سەرنج ڕادەکێشێت و ئەزموونی میوانان باشتر دەکات. پاراستنی نایاب لە با و کەشوهەوا دابین دەکات کاتێک داخراوە، بەڵام بە تەواوی دەکرێتەوە بۆ تێکەڵکردنی شوێنی ناوەوە لەگەڵ باخچەکان و ناوچەکانی مەلەوانگە یان دیمەنی شار.\n\nمیکانیزمی نەرم و بێدەنگ کارکردنی ڕۆژانەی متمانەپێکراو لەگەڵ کەمترین چاککردنەوە دابین دەکات. دیزاینی مۆدێرن و سادەی لەگەڵ ڕیزبەندێکی فراوان لە شێوازی تەلارسازیدا دەگونجێت، لە شوێنە بازرگانییە هاوچەرخەکانەوە بۆ ماڵە تایبەتە شانازییەکان، کە دەیکاتە وەبەرهێنانێکی فراوان و سەرنجڕاکێش بۆ هەر شوێنێکی تایبەت.`
    }
  },
  {
    id: 'win-sliding-thermal-break',
    en: {
      name: 'Insulated Sliding Window with Slim Profile Design',
      description: `This insulated sliding window combines outstanding thermal performance with a remarkably slim frame, allowing maximum glass area and unobstructed views. The smooth sliding mechanism makes it effortless to open and close, providing excellent ventilation while maintaining a clean, modern aesthetic suitable for any architectural style.\n\nDesigned to keep interiors cool in summer and warm in winter, this window significantly reduces energy consumption and creates a quieter indoor environment by blocking outside noise. It is an excellent choice for bedrooms, living rooms, offices, and commercial spaces where comfort and efficiency matter most.\n\nThe durable construction ensures years of reliable performance with minimal maintenance. Available in a range of finishes, it blends naturally with residential facades, office buildings, and commercial storefronts alike, delivering both beauty and practicality in a single elegant solution.`
    },
    ar: {
      name: 'نافذة سحب عازلة بتصميم إطار نحيف',
      description: `تجمع هذه النافذة السحب العازلة بين أداء حراري متميز وإطار نحيف بشكل لافت، مما يسمح بأكبر مساحة زجاجية ممكنة وإطلالات خالية من العوائق. تعمل آلية السحب السلسة بسهولة تامة للفتح والإغلاق، وتوفر تهوية ممتازة مع الحفاظ على مظهر عصري نظيف يتناسب مع أي طراز معماري.\n\nصُممت لتحافظ على برودة المساحات الداخلية صيفاً ودفئها شتاءً، حيث تُقلّل بشكل ملحوظ من استهلاك الطاقة وتُوفّر بيئة داخلية أكثر هدوءاً من خلال عزل الضوضاء الخارجية. إنها خيار ممتاز لغرف النوم وغرف المعيشة والمكاتب والمساحات التجارية حيث تكون الراحة والكفاءة في المقام الأول.\n\nتضمن المتانة في التصنيع سنوات من الأداء الموثوق مع حد أدنى من الصيانة. تتوفر بمجموعة من التشطيبات التي تتناغم بشكل طبيعي مع واجهات المنازل والمباني المكتبية والمتاجر التجارية على حد سواء، لتُقدم الجمال والعملية في حلٍّ أنيق واحد.`
    },
    ckb: {
      name: 'پەنجەرەی سلایدی ئینسولاتەد بە دیزاینی چوارچێوەی تەنک',
      description: `ئەم پەنجەرەیە سلایدیە ئینسولاتەدە کاریگەری گەرمیی بەرزی نایاب لەگەڵ چوارچێوەیەکی تەنکی سەرنجڕاکێش تێکەڵ دەکات، کە ڕێگەدانی زۆرترین ڕووبەری شووشە و دیمەنی بێ کۆسپ دەکات. میکانیزمی سلایدی نەرم بە ئاسانی تەواو بۆ کردنەوە و داخستن دەکات، هەوادانی نایاب دابین دەکات لەگەڵ پاراستنی ڕوالەتێکی مۆدێرن و پاک کە بۆ هەر شێوازێکی تەلارسازی گونجاوە.\n\nدیزاین کراوە بۆ ساردکردنی ناوەوە لە هاویندا و گەرمکردنی لە زستاندا، ئەم پەنجەرەیە بە بەرچاوی تێچووی وزە کەم دەکاتەوە و ژینگەیەکی ناوخۆیی ئارامتر دروست دەکات بە ڕێگریکردن لە دەنگی دەرەوە. هەڵبژاردنێکی نایابە بۆ ژووری نووستن و ژووری نیشتەجێبوون و ئۆفیس و شوێنە بازرگانییەکان کە ئاسایش و کاریگەری لەوێ گرنگترینن.\n\nدروستکردنی بەردەوام ساڵانی زۆر لە کارکردنی متمانەپێکراو لەگەڵ کەمترین چاککردنەوە دابین دەکات. بە ڕیزبەندێک لە تەواوکارییەکانەوە بەردەستە کە بە سروشتی لەگەڵ ڕووکاری ماڵ و بینای ئۆفیس و دوکانە بازرگانییەکاندا دەگونجێت، جوانی و کاریگەری لە چارەسەرێکی شیکدا دابین دەکات.`
    }
  },
  {
    id: 'win-magnetic-blinds-double-glass',
    en: {
      name: 'Double Glass Window with Built-in Adjustable Blinds',
      description: `This innovative double glass window features integrated adjustable blinds sealed between two layers of glass, offering effortless light and privacy control without the dust and maintenance hassles of traditional curtains. A simple magnetic mechanism allows instant adjustment from fully open to completely private, making it a hygienic and modern alternative.\n\nIdeal for hospitals, clinics, offices, kitchens, and bathrooms, the sealed design keeps the blinds protected from moisture, grease, and allergens, ensuring a consistently clean appearance. In residential settings, it provides bedrooms and living spaces with elegant light control that requires zero cleaning.\n\nThe double glass construction delivers excellent thermal and sound insulation, keeping rooms quieter and more energy-efficient. Its sleek, contemporary profile complements any interior design, from minimalist modern homes to professional office environments, adding both style and lasting value.`
    },
    ar: {
      name: 'نافذة زجاج مزدوج مع ستائر مدمجة قابلة للتعديل',
      description: `تتميز هذه النافذة المبتكرة بزجاج مزدوج مع ستائر قابلة للتعديل مدمجة ومحكمة الإغلاق بين طبقتين من الزجاج، مما يوفر تحكماً سهلاً بالضوء والخصوصية دون عناء الغبار وصيانة الستائر التقليدية. تتيح آلية مغناطيسية بسيطة التعديل الفوري من الفتح الكامل إلى الخصوصية التامة، مما يجعلها بديلاً صحياً وعصرياً.\n\nمثالية للمستشفيات والعيادات والمكاتب والمطابخ والحمامات، حيث يحافظ التصميم المحكم على الستائر محمية من الرطوبة والدهون والمواد المسببة للحساسية، مما يضمن مظهراً نظيفاً باستمرار. في الاستخدام المنزلي، توفر لغرف النوم وغرف المعيشة تحكماً أنيقاً بالإضاءة لا يحتاج إلى أي تنظيف.\n\nيوفر الزجاج المزدوج عزلاً حرارياً وصوتياً ممتازاً، مما يجعل الغرف أكثر هدوءاً وكفاءة في استهلاك الطاقة. يتناغم تصميمها الأنيق والعصري مع أي ديكور داخلي، من المنازل الحديثة البسيطة إلى بيئات المكاتب المهنية، مضيفةً أسلوباً مميزاً وقيمة دائمة.`
    },
    ckb: {
      name: 'پەنجەرەی شووشەی دووجۆڕ بە پەردەی ناوەکی ڕێکخراو',
      description: `ئەم پەنجەرەیە نوێکارە شووشەی دووجۆڕی تایبەتمەند هەیە بە پەردەی ڕێکخراوی تێکەڵکراوی پەسندکراو لەنێوان دوو چینی شووشەدا، کە کۆنتڕۆڵکردنی ئاسانی ڕووناکی و تایبەتمەندی دابین دەکات بێ کێشەی تۆز و چاککردنەوەی پەردەی کلاسیکی. میکانیزمێکی مەقناتیسی ساکار ڕێکخستنی دەستبەجێ لە کردنەوەی تەواوەوە بۆ تایبەتمەندی تەواو دابین دەکات، کە دەیکاتە بەدیلێکی تەندروستانە و مۆدێرن.\n\nگونجاوە بۆ نەخۆشخانەکان و کلینیکەکان و ئۆفیسەکان و چێشتخانەکان و حەمامەکان، دیزاینی پەسندکراو پەردەکان لە شێداری و بۆن و مادە هەستیارەکان دەپارێزێت، کە بەردەوام ڕوالەتێکی پاک دابین دەکات. لە بەکارهێنانی ماڵەوە، بۆ ژووری نووستن و شوێنی نیشتەجێبوون کۆنتڕۆڵی شیکی ڕووناکی دابین دەکات کە هیچ پاککردنەوەیەک پێویست ناکات.\n\nدروستکردنی شووشەی دووجۆڕ ئینسولاسیۆنی گەرمی و دەنگی نایاب دابین دەکات، ژوورەکان ئارامتر و کاریگەرتر دەکات لە بەکارهێنانی وزەدا. پرۆفایلی شیک و هاوچەرخی لەگەڵ هەر دیزاینێکی ناوخۆیی دەگونجێت، لە ماڵە مۆدێرنە سادەکانەوە بۆ ژینگەی ئۆفیسی پیشەیی، شێواز و بەهای بەردەوام زیاد دەکات.`
    }
  },
  {
    id: 'win-motorized-remote-guillotine',
    en: {
      name: 'Motorized Window with Remote Control and Built-in Blinds',
      description: `This motorized window system combines the convenience of remote-controlled operation with integrated internal blinds, offering complete control over light, ventilation, and privacy at the touch of a button. The window opens and closes electrically, eliminating the need for manual effort and making it perfect for hard-to-reach installations or luxury living spaces.\n\nSuitable for homes, offices, showrooms, and hospitality venues, this window enhances everyday comfort by allowing precise adjustment of airflow and sunlight. The built-in blinds remain sealed and dust-free, providing a clean, polished look that requires no maintenance and suits both modern and classic interiors.\n\nEngineered for long-term reliability, the motorized mechanism operates quietly and efficiently, adding a touch of sophistication to any property. It is an excellent choice for those seeking a smart, elegant upgrade that improves convenience, energy efficiency, and overall living quality.`
    },
    ar: {
      name: 'نافذة آلية بتحكم عن بُعد وستائر مدمجة',
      description: `يجمع نظام النافذة الآلية هذا بين سهولة التشغيل بالتحكم عن بُعد والستائر الداخلية المدمجة، مما يوفر تحكماً كاملاً بالإضاءة والتهوية والخصوصية بلمسة زر واحدة. تُفتح النافذة وتُغلق كهربائياً مما يُلغي الحاجة إلى الجهد اليدوي ويجعلها مثالية للتركيبات في الأماكن صعبة الوصول أو مساحات المعيشة الفاخرة.\n\nمناسبة للمنازل والمكاتب وصالات العرض وأماكن الضيافة، تُعزّز هذه النافذة الراحة اليومية من خلال التعديل الدقيق لتدفق الهواء وأشعة الشمس. تبقى الستائر المدمجة محكمة الإغلاق وخالية من الغبار، مما يمنح مظهراً نظيفاً وأنيقاً لا يحتاج إلى أي صيانة ويتناسب مع الديكورات الحديثة والكلاسيكية على حد سواء.\n\nصُممت للاعتمادية على المدى الطويل، حيث تعمل الآلية الكهربائية بهدوء وكفاءة، مضيفةً لمسة من الرقي لأي عقار. إنها خيار ممتاز لمن يبحث عن ترقية ذكية وأنيقة تُحسّن الراحة وكفاءة الطاقة وجودة المعيشة بشكل عام.`
    },
    ckb: {
      name: 'پەنجەرەی ئۆتۆماتیکی بە کۆنتڕۆڵی دووری و پەردەی ناوەکی',
      description: `ئەم سیستمە پەنجەرەیە ئۆتۆماتیکیە ئاسانی کارکردن بە کۆنتڕۆڵی دووری لەگەڵ پەردەی ناوەکی تێکەڵکراو کۆدەکاتەوە، کۆنتڕۆڵی تەواو لەسەر ڕووناکی و هەوادان و تایبەتمەندی بە دەستکردنی دوگمەیەک دابین دەکات. پەنجەرەکە بە کارەبا دەکرێتەوە و دادەخرێت، کە پێویستی بە هەوڵی دەستی نامێنێت و گونجاوی دەکات بۆ دامەزراندنی شوێنە سەختەکان یان شوێنی ژیانی لوکس.\n\nگونجاوە بۆ ماڵ و ئۆفیس و نمایشگا و شوێنی پێشوازی، ئەم پەنجەرەیە ئاسایشی ڕۆژانە باشتر دەکات بە ڕێگەدانی ڕێکخستنی وردی هەوا و تیشکی خۆر. پەردەکانی ناوەکی پەسندکراو و بێ تۆز دەمێنن، ڕوالەتێکی پاک و شیک دەبەخشن کە هیچ چاککردنەوەیەک پێویست ناکات و لەگەڵ دیزاینی مۆدێرن و کلاسیکدا دەگونجێت.\n\nئەندازیاری کراوە بۆ متمانەپێکراوی درێژخایەن، میکانیزمی ئۆتۆماتیکی بە ئارامی و کاریگەری کار دەکات و تەمەکێکی سۆفیستیکەیت بە هەر موڵکێک زیاد دەکات. هەڵبژاردنێکی نایابە بۆ ئەوانەی بەدوای نوێکردنەوەیەکی زیرەک و شیکدا دەگەڕێن کە ئاسایش و کاریگەری وزە و کوالیتەی ژیان بە گشتی باشتر دەکات.`
    }
  },
  {
    id: 'win-tilt-turn-german-thermal',
    en: {
      name: 'Dual-Mode Tilt and Turn Insulated Casement Window',
      description: `This dual-mode casement window offers the versatility of both tilt and turn opening positions, providing maximum flexibility for ventilation and easy cleaning. In tilt mode, it opens at the top for secure, rain-safe airflow, while the full turn mode swings inward for complete access and effortless glass cleaning from inside.\n\nBuilt with advanced thermal insulation, this window creates a comfortable indoor climate year-round by keeping heat out in summer and cold out in winter. Its multi-point locking system ensures superior security, making it a trusted choice for ground-floor apartments, offices, and family homes where safety is a priority.\n\nThe robust construction and precision-engineered hardware guarantee smooth operation for many years with minimal upkeep. Its versatile design, available in multiple colors and finishes, integrates beautifully into residential buildings, office towers, and commercial complexes, delivering performance, safety, and elegance in equal measure.`
    },
    ar: {
      name: 'نافذة مفصلية عازلة بنظام فتح مزدوج',
      description: `توفر هذه النافذة المفصلية ذات الفتح المزدوج مرونة استثنائية من خلال وضعيتي فتح: وضعية الإمالة من الأعلى للتهوية الآمنة حتى أثناء المطر، ووضعية الفتح الكامل للداخل للوصول السهل وتنظيف الزجاج بكل يسر من الداخل.\n\nمُصنّعة بعزل حراري متقدم، تُوفّر هذه النافذة مناخاً داخلياً مريحاً على مدار العام بحجب الحرارة صيفاً والبرودة شتاءً. يضمن نظام القفل المتعدد النقاط أماناً فائقاً، مما يجعلها خياراً موثوقاً للشقق في الطوابق الأرضية والمكاتب والمنازل العائلية حيث تكون السلامة أولوية.\n\nيضمن البناء المتين والمعدات المصنّعة بدقة تشغيلاً سلساً لسنوات طويلة مع حد أدنى من الصيانة. يتوفر تصميمها المتعدد الاستخدامات بألوان وتشطيبات متنوعة، ويتكامل بجمال مع المباني السكنية وأبراج المكاتب والمجمعات التجارية، ليُقدّم الأداء والسلامة والأناقة بمقدار متساوٍ.`
    },
    ckb: {
      name: 'پەنجەرەی مەفسەلی ئینسولاتەد بە سیستەمی کردنەوەی دووجۆڕ',
      description: `ئەم پەنجەرەیە مەفسەلیە دووجۆڕە فراوانی تایبەت دابین دەکات بە دوو شێوازی کردنەوە: شێوازی لاکردن لە سەرەوە بۆ هەوادانی ئارام حەتا لە کاتی بارانیشدا، و شێوازی کردنەوەی تەواو بۆ ناوەوە بۆ دەستگەیشتنی ئاسان و پاککردنەوەی شووشە بە ئاسانی لە ناوەوە.\n\nدروست کراوە بە ئینسولاسیۆنی گەرمیی پێشکەوتوو، ئەم پەنجەرەیە کەشوهەوایەکی ناوخۆیی ئارام بە درێژایی ساڵ دروست دەکات بە دوورخستنەوەی گەرمی لە هاویندا و سارد لە زستاندا. سیستەمی قوفڵی فرە خاڵ ئەمنیەتی بەرز دابین دەکات، کە دەیکاتە هەڵبژاردنێکی متمانەپێکراو بۆ ئاپارتمانەکانی نهۆمی یەکەم و ئۆفیس و ماڵی خێزانی کە سەلامەتی لەوێ گرنگترینە.\n\nدروستکردنی بەهێز و کەرەستەی ئەندازیاری کراوی بە وردی کارکردنی نەرم بۆ ساڵانی زۆر لەگەڵ کەمترین چاککردنەوە دابین دەکات. دیزاینی فراوانی بە ڕەنگ و تەواوکارییەکانی جۆراوجۆر بەردەستە و بە جوانی لەگەڵ بینای نیشتەجێبوون و بروجی ئۆفیس و کۆمپلێکسی بازرگانیدا دەگونجێت، کارایی و سەلامەتی و شیکی بە یەکسانی دابین دەکات.`
    }
  },
  {
    id: 'win-automated-skylight-roof',
    en: {
      name: 'Automated Roof Window for Natural Light and Ventilation',
      description: `This automated roof window brings abundant natural light and fresh air into spaces that traditional windows cannot reach, such as top-floor rooms, stairwells, corridors, and covered atriums. It opens and closes at the touch of a button, providing controlled ventilation that helps regulate indoor temperature and air quality effortlessly.\n\nPerfect for luxury homes, office buildings, hotels, and commercial lobbies, this roof window transforms dark interior areas into bright, inviting spaces. The generous glass area floods rooms with daylight, reducing the need for artificial lighting and creating a healthier, more productive environment for occupants.\n\nEngineered to withstand rain, wind, and extreme temperatures, the sealed design ensures complete weather protection when closed. Its low-profile frame blends discreetly into the roofline, maintaining the building's clean exterior appearance while delivering outstanding functionality and lasting durability with minimal maintenance.`
    },
    ar: {
      name: 'نافذة سقفية آلية للإضاءة الطبيعية والتهوية',
      description: `تجلب هذه النافذة السقفية الآلية ضوءاً طبيعياً وافراً وهواءً نقياً إلى المساحات التي لا تستطيع النوافذ التقليدية الوصول إليها، مثل غرف الطوابق العلوية وبيوت الدرج والممرات والأفنية المغطاة. تُفتح وتُغلق بلمسة زر، وتوفر تهوية مُتحكّماً بها تساعد في تنظيم درجة الحرارة الداخلية وجودة الهواء دون عناء.\n\nمثالية للمنازل الفاخرة والمباني المكتبية والفنادق والبهو التجاري، تُحوّل هذه النافذة السقفية المناطق الداخلية المظلمة إلى مساحات مشرقة وجذابة. تغمر المساحة الزجاجية الواسعة الغرف بضوء النهار، مما يُقلّل الحاجة إلى الإنارة الاصطناعية ويخلق بيئة أكثر صحة وإنتاجية للمقيمين.\n\nصُممت لتتحمل المطر والرياح ودرجات الحرارة القصوى، حيث يضمن التصميم المحكم حماية كاملة من الطقس عند الإغلاق. يندمج إطارها المنخفض بسلاسة في خط السقف، محافظاً على المظهر الخارجي النظيف للمبنى مع تقديم أداء وظيفي متميز ومتانة طويلة الأمد بأقل صيانة ممكنة.`
    },
    ckb: {
      name: 'پەنجەرەی سەقفی ئۆتۆماتیکی بۆ ڕووناکی سروشتی و هەوادان',
      description: `ئەم پەنجەرەیە سەقفیە ئۆتۆماتیکیە ڕووناکیی سروشتیی فراوان و هەوای پاک بۆ ئەو شوێنانە دەهێنێت کە پەنجەرە ڕەسەنەکان ناتوانن بیگەنە پێیان، وەک ژوورەکانی نهۆمی سەرەوە و پلیکانەخانە و ڕێڕەوەکان و حەوشە سەرپۆشکراوەکان. بە دەستکردنی دوگمەیەک دەکرێتەوە و دادەخرێت، هەوادانی کۆنتڕۆڵکراو دابین دەکات کە یارمەتی ڕێکخستنی پلەی گەرمی ناوەوە و کوالیتەی هەوا بە ئاسانی دەکات.\n\nگونجاوە بۆ ماڵە لوکسەکان و بینای ئۆفیس و هوتێلەکان و لۆبی بازرگانی، ئەم پەنجەرەیە سەقفیە ناوچە ناوخۆییە تاریکەکان دەگۆڕێت بۆ شوێنە ڕووناک و ڕاکێشەکان. ڕووبەری شووشەی فراوان ژوورەکان بە تیشکی ڕۆژ دەخەنکێنێت، پێویستی بە ڕووناکی دەستکرد کەم دەکات و ژینگەیەکی تەندروستتر و بەرهەمدارتر بۆ دانیشتووان دروست دەکات.\n\nئەندازیاری کراوە بۆ بەرگەگرتنی باران و با و پلەی گەرمیی ئەفراتکار، دیزاینی پەسندکراو پاراستنی تەواو لە کەشوهەوا کاتێک داخراوە دابین دەکات. چوارچێوەی نزمی بە شارەوەیی لەگەڵ هێڵی سەقفدا دەگونجێت و ڕوالەتی دەرەوەی پاکی بینا دەپارێزێت لەگەڵ دابینکردنی کارایی و بەردەوامی درێژخایەن بە کەمترین چاککردنەوە.`
    }
  }
];

// ── Apply updates ──────────────────────────────────────────────────────────

const CMS_PATH = path.join(__dirname, 'cms_products_db.json');
const SEED_PATH = path.join(__dirname, 'src', 'data', 'productionProductsSeed.ts');

// 1) CMS JSON
let db = JSON.parse(fs.readFileSync(CMS_PATH, 'utf8'));

for (const u of updates) {
  const idx = db.findIndex(p => p.id === u.id);
  if (idx === -1) { console.error('NOT FOUND:', u.id); continue; }
  const p = db[idx];

  // English
  p.name = u.en.name;
  p.description = u.en.description;

  // Arabic
  p.arabicName = u.ar.name;
  p.arabicDescription = u.ar.description;

  // Kurdish
  p.kurdishName = u.ckb.name;
  p.kurdishDescription = u.ckb.description;

  // translations object
  if (!p.translations) p.translations = {};
  if (!p.translations.en) p.translations.en = {};
  if (!p.translations.ar) p.translations.ar = {};
  if (!p.translations.ckb) p.translations.ckb = {};

  p.translations.en.name = u.en.name;
  p.translations.en.description = u.en.description;
  p.translations.ar.name = u.ar.name;
  p.translations.ar.description = u.ar.description;
  p.translations.ckb.name = u.ckb.name;
  p.translations.ckb.description = u.ckb.description;

  db[idx] = p;
  console.log('✓ CMS updated:', u.id, '→', u.en.name);
}

fs.writeFileSync(CMS_PATH, JSON.stringify(db, null, 2), 'utf8');
console.log('CMS file saved.');

// 2) Seed TS
let seedSrc = fs.readFileSync(SEED_PATH, 'utf8');
const marker = 'export const PRODUCTION_PRODUCTS_SEED: ProductItem[] = ';
const markerIdx = seedSrc.indexOf(marker);
if (markerIdx === -1) { console.error('Seed marker not found!'); process.exit(1); }
const jsonStart = seedSrc.indexOf('[', markerIdx);
// find matching ]
let depth = 0, jsonEnd = -1;
for (let i = jsonStart; i < seedSrc.length; i++) {
  if (seedSrc[i] === '[') depth++;
  else if (seedSrc[i] === ']') { depth--; if (depth === 0) { jsonEnd = i + 1; break; } }
}
let seedArr = JSON.parse(seedSrc.substring(jsonStart, jsonEnd));

for (const u of updates) {
  const idx = seedArr.findIndex(p => p.id === u.id);
  if (idx === -1) { console.error('NOT FOUND in seed:', u.id); continue; }
  const p = seedArr[idx];

  p.name = u.en.name;
  p.description = u.en.description;
  p.arabicName = u.ar.name;
  p.arabicDescription = u.ar.description;
  p.kurdishName = u.ckb.name;
  p.kurdishDescription = u.ckb.description;

  if (!p.translations) p.translations = {};
  if (!p.translations.en) p.translations.en = {};
  if (!p.translations.ar) p.translations.ar = {};
  if (!p.translations.ckb) p.translations.ckb = {};

  p.translations.en.name = u.en.name;
  p.translations.en.description = u.en.description;
  p.translations.ar.name = u.ar.name;
  p.translations.ar.description = u.ar.description;
  p.translations.ckb.name = u.ckb.name;
  p.translations.ckb.description = u.ckb.description;

  seedArr[idx] = p;
  console.log('✓ Seed updated:', u.id);
}

const newSeedJson = JSON.stringify(seedArr, null, 2);
const newSeedSrc = seedSrc.substring(0, jsonStart) + newSeedJson + seedSrc.substring(jsonEnd);
fs.writeFileSync(SEED_PATH, newSeedSrc, 'utf8');
console.log('Seed file saved.');
console.log('\nDone! All 7 window products updated.');
