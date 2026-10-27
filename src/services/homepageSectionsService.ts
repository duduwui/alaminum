export interface HomepageSectionConfig {
  id: string;
  key: string;
  title: string;
  description: string;
  translations?: Record<string, { name?: string; title?: string; description?: string }>;
}

const STORAGE_KEY = "winhome_homepage_sections_v1";
export const HOMEPAGE_SECTIONS_UPDATED_EVENT = "winhome_homepage_sections_updated";

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  {
    "id": "sec-windows",
    "key": "windows",
    "title": "أنظمة النوافذ المعمارية",
    "description": "نوافذ عصرية تجمع بين الإطلالة البانورامية الواسعة والعزل المتكامل، مصممة لتمنح منزلك إضاءة طبيعية ساحرة وهدوءاً تاماً في جميع الفصول.",
    "translations": {
      "ar": {
        "name": "أنظمة النوافذ المعمارية",
        "title": "أنظمة النوافذ المعمارية",
        "description": "نوافذ عصرية تجمع بين الإطلالة البانورامية الواسعة والعزل المتكامل، مصممة لتمنح منزلك إضاءة طبيعية ساحرة وهدوءاً تاماً في جميع الفصول."
      },
      "en": {
        "name": "Architectural Window Systems",
        "title": "Architectural Window Systems",
        "description": "Modern windows combining wide panoramic views with complete insulation, designed to fill your home with natural light and peaceful indoor comfort across every season."
      },
      "tr": {
        "name": "Mimari Pencere Sistemleri",
        "title": "Mimari Pencere Sistemleri",
        "description": "Geniş panoramik manzarayı tam yalıtımla birleştiren, evinize her mevsim doğal ışık ve huzurlu bir konfor sunmak için tasarlanmış modern pencereler."
      },
      "ckb": {
        "name": "سیستەمی پەنجەرەی نژیاروانی",
        "title": "سیستەمی پەنجەرەی نژیاروانی",
        "description": "پەنجەرەی مۆدێرن کە دیمەنی پانۆرامای فراوان و عەزلی تەواو تێکەڵ دەکات، دیزاین کراوە بۆ بەخشینی ڕووناکی سروشتی و ئارامی تەواو لە هەموو وەرزەکاندا."
      },
      "kmr": {
        "name": "Sîstemên Pace û Pencereyên Mîmarî",
        "title": "Sîstemên Pace û Pencereyên Mîmarî",
        "description": "Pencereyên nûjen ên ku dîmena panoramîk a fireh û îzolasyona bêkêmasî digihînin hev, ji bo ronahiya xwezayî û aramiya tam di her demsalê de hatine sêwirandin."
      },
      "en-GB": {
        "name": "Architectural Window Systems",
        "title": "Architectural Window Systems",
        "description": "Modern windows combining wide panoramic views with complete insulation, designed to fill your home with natural light and peaceful indoor comfort across every season."
      },
      "en-US": {
        "name": "Architectural Window Systems",
        "title": "Architectural Window Systems",
        "description": "Modern windows combining wide panoramic views with complete insulation, designed to fill your home with natural light and peaceful indoor comfort across every season."
      }
    }
  },
  {
    "id": "sec-doors",
    "key": "doors",
    "title": "أنظمة الأبواب والمداخل العصرية",
    "description": "تشكيلة مختارة من الأبواب والبوابات العصرية التي تجمع بين الفخامة والصلابة، لتمنح مدخل منزلك حضوراً مميزاً يعكس ذوقك الرفيع منذ اللحظة الأولى.",
    "translations": {
      "ar": {
        "name": "أنظمة الأبواب والمداخل العصرية",
        "title": "أنظمة الأبواب والمداخل العصرية",
        "description": "تشكيلة مختارة من الأبواب والبوابات العصرية التي تجمع بين الفخامة والصلابة، لتمنح مدخل منزلك حضوراً مميزاً يعكس ذوقك الرفيع منذ اللحظة الأولى."
      },
      "en": {
        "name": "Modern Door & Entrance Systems",
        "title": "Modern Door & Entrance Systems",
        "description": "A curated collection of modern doors and gates uniting luxury and strength to give your home's entrance a distinctive presence from the very first glance."
      },
      "tr": {
        "name": "Modern Kapı ve Giriş Sistemleri",
        "title": "Modern Kapı ve Giriş Sistemleri",
        "description": "İlk bakıştan itibaren evinizin girişine seçkin bir görünüm kazandırmak için lüks ve sağlamlığı bir araya getiren modern kapı ve giriş sistemleri."
      },
      "ckb": {
        "name": "سیستەمی دەرگا و دەروازەی مۆدێرن",
        "title": "سیستەمی دەرگا و دەروازەی مۆدێرن",
        "description": "کۆمەڵەیەکی هەڵبژێردراو لە دەرگا و دەروازەی مۆدێرن کە فەخامەت و پتەوی تێکەڵ دەکات بۆ بەخشینی دیمەنێکی ناوازە بە دەروازەی ماڵەکەت."
      },
      "kmr": {
        "name": "Sîstemên Derî û Derwazeyên Nûjen",
        "title": "Sîstemên Derî û Derwazeyên Nûjen",
        "description": "Koleksiyonek bijartî ya derî û derwazeyên nûjen ên ku luks û پتewiyê digihînin hev da ku ji kêliya yekem ve xuyangek bêhempa bidin ketina mala we."
      },
      "en-GB": {
        "name": "Modern Door & Entrance Systems",
        "title": "Modern Door & Entrance Systems",
        "description": "A curated collection of modern doors and gates uniting luxury and strength to give your home's entrance a distinctive presence from the very first glance."
      },
      "en-US": {
        "name": "Modern Door & Entrance Systems",
        "title": "Modern Door & Entrance Systems",
        "description": "A curated collection of modern doors and gates uniting luxury and strength to give your home's entrance a distinctive presence from the very first glance."
      }
    }
  },
  {
    "id": "sec-accessories",
    "key": "accessories",
    "title": "الإكسسوارات والمقابض المعمارية",
    "description": "مقابض وأقفال وإكسسوارات هندسية دقيقة تضيف اللمسة النهائية الأنيقة لأبوابك ونوافذك وتجمع بين راحة الاستخدام اليومي والأمان العالي.",
    "translations": {
      "ar": {
        "name": "الإكسسوارات والمقابض المعمارية",
        "title": "الإكسسوارات والمقابض المعمارية",
        "description": "مقابض وأقفال وإكسسوارات هندسية دقيقة تضيف اللمسة النهائية الأنيقة لأبوابك ونوافذك وتجمع بين راحة الاستخدام اليومي والأمان العالي."
      },
      "en": {
        "name": "Architectural Hardware & Accessories",
        "title": "Architectural Hardware & Accessories",
        "description": "Precision-engineered handles, locks, and accessories that add the finishing touch of elegance to your doors and windows while combining daily comfort with lasting security."
      },
      "tr": {
        "name": "Mimari Aksesuar ve Kol Sistemleri",
        "title": "Mimari Aksesuar ve Kol Sistemleri",
        "description": "Kapı ve pencerelerinize zarif bir son dokunuş katan, günlük kullanım konforunu yüksek güvenlikle birleştiren hassas mühendislik ürünü kollar, kilitler ve aksesuarlar."
      },
      "ckb": {
        "name": "ئێکسسوارات و دەسکی نژیاروانی",
        "title": "ئێکسسوارات و دەسکی نژیاروانی",
        "description": "دەسک و قفڵ و ئێکسسواراتی ئەندازیاری ورد کە کۆتا دەستلێدانی جوانی دەبەخشنە دەرگا و پەنجەرەکانت لەگەڵ ئاسایش و ئاسوودەیی ڕۆژانە."
      },
      "kmr": {
        "name": "Aksesûar û Destikên Mîmarî",
        "title": "Aksesûar û Destikên Mîmarî",
        "description": "Destik, kilît û aksesûarên endezyariya ورد ên ku bedewiya dawîn li derî û pencereyên we zêde dikin û rehetiya rojane bi ewlehiya bilind re digihînin hev."
      },
      "en-GB": {
        "name": "Architectural Hardware & Accessories",
        "title": "Architectural Hardware & Accessories",
        "description": "Precision-engineered handles, locks, and accessories that add the finishing touch of elegance to your doors and windows while combining daily comfort with lasting security."
      },
      "en-US": {
        "name": "Architectural Hardware & Accessories",
        "title": "Architectural Hardware & Accessories",
        "description": "Precision-engineered handles, locks, and accessories that add the finishing touch of elegance to your doors and windows while combining daily comfort with lasting security."
      }
    }
  },
  {
    "id": "sec-id-1793119395093",
    "key": "sec-1793119387374",
    "title": "حواجز السلالم الزجاجية",
    "description": "تجمع حواجز السلالم الزجاجية بين الأناقة العصرية والأمان، بتصاميم أنيقة تضفي إحساساً بالاتساع وتبرز جمال التفاصيل المعمارية. تتوفر بخيارات متنوعة تناسب مختلف أنماط الديكور، لتمنح منزلك أو مشروعك لمسة راقية تجمع بين الجمال والعملية.",
    "translations": {
      "ar": {
        "name": "حواجز السلالم الزجاجية",
        "title": "حواجز السلالم الزجاجية",
        "description": "تجمع حواجز السلالم الزجاجية بين الأناقة العصرية والأمان، بتصاميم أنيقة تضفي إحساساً بالاتساع وتبرز جمال التفاصيل المعمارية. تتوفر بخيارات متنوعة تناسب مختلف أنماط الديكور، لتمنح منزلك أو مشروعك لمسة راقية تجمع بين الجمال والعملية."
      },
      "en": {
        "name": "Glass Staircase Railings",
        "title": "Glass Staircase Railings",
        "description": "Glass staircase railings combine modern elegance with dependable safety, featuring refined designs that create a sense of openness and highlight architectural details. Available in versatile finishes to suit every interior style, bringing both beauty and practicality to your home or project."
      },
      "tr": {
        "name": "Cam Merdiven Korkulukları",
        "title": "Cam Merdiven Korkulukları",
        "description": "Cam merdiven korkulukları, ferahlık hissi veren ve mimari detayların güzelliğini ön plana çıkaran şık tasarımlarıyla modern zarafeti ve güvenliği bir araya getirir. Farklı dekorasyon stillerine uygun çeşitli seçeneklerle evinize veya projenize estetik ve işlevselliği buluşturan seçkin bir dokunuş katar."
      },
      "ckb": {
        "name": "مەحاجەرەی شووشەیی قادرمە",
        "title": "مەحاجەرەی شووشەیی قادرمە",
        "description": "مەحاجەرەی شووشەیی قادرمە کەشخەیی مۆدێرن و سەلامەتی پێکەوە کۆدەکاتەوە، بە دیزاینی ناوازە کە هەستی فراوانی دەبەخشێت و جوانی وردەکارییە نژیاروانییەکان دەردەخات. بە بژاردەی جۆراوجۆر بەردەستە کە لەگەڵ شێوازە جیاوازەکانی دیکۆر دەگونجێت، بۆ بەخشینی لمسەیەکی ڕاقی بە ماڵ یان پڕۆژەکەت."
      },
      "kmr": {
        "name": "Mihacerên Cam ên Dereceyan",
        "title": "Mihacerên Cam ên Dereceyan",
        "description": "Mihacerên cam ên dereceyan zerafeta nûjen û ewlehiyê digihînin hev, bi sêwiranên شîk ên ku hestek firehiyê didin û bedewiya hûrguliyên mîmarî derdixin pêş. Bi bijarteyên جûrbecûr ên ku li گۆrî şêwazên dekorê yên جûda tên peyda dibin da ku têkiliyek bilind bidin mala an projeya we."
      },
      "en-GB": {
        "name": "Glass Staircase Railings",
        "title": "Glass Staircase Railings",
        "description": "Glass staircase railings combine modern elegance with dependable safety, featuring refined designs that create a sense of openness and highlight architectural details. Available in versatile finishes to suit every interior style, bringing both beauty and practicality to your home or project."
      },
      "en-US": {
        "name": "Glass Staircase Railings",
        "title": "Glass Staircase Railings",
        "description": "Glass staircase railings combine modern elegance with dependable safety, featuring refined designs that create a sense of openness and highlight architectural details. Available in versatile finishes to suit every interior style, bringing both beauty and practicality to your home or project."
      }
    }
  },
  {
    "id": "sec-id-1793119438202",
    "key": "sec-1793119430295",
    "title": "حواجز الشرفات الزجاجية",
    "description": "تضفي حواجز الشرفات الزجاجية لمسة من الأناقة والحداثة على واجهات المباني، مع تصميم يمنحك إطلالة مفتوحة وإحساساً بالاتساع. تتوفر بتشطيبات وأطر متنوعة تتناسب مع مختلف التصاميم المعمارية، لتجمع بين المظهر الراقي والعملية، مع مراعاة متطلبات الأمان والجودة.",
    "translations": {
      "ar": {
        "name": "حواجز الشرفات الزجاجية",
        "title": "حواجز الشرفات الزجاجية",
        "description": "تضفي حواجز الشرفات الزجاجية لمسة من الأناقة والحداثة على واجهات المباني، مع تصميم يمنحك إطلالة مفتوحة وإحساساً بالاتساع. تتوفر بتشطيبات وأطر متنوعة تتناسب مع مختلف التصاميم المعمارية، لتجمع بين المظهر الراقي والعملية، مع مراعاة متطلبات الأمان والجودة."
      },
      "en": {
        "name": "Glass Balcony Railings",
        "title": "Glass Balcony Railings",
        "description": "Glass balcony railings add a touch of elegance and modernity to building facades, offering unobstructed views and a spacious feel. Available in a variety of finishes and framing options to complement diverse architectural styles while meeting the highest standards of safety and quality."
      },
      "tr": {
        "name": "Cam Balkon Korkulukları",
        "title": "Cam Balkon Korkulukları",
        "description": "Cam balkon korkulukları, açık bir manzara ve ferahlık hissi sunan tasarımlarıyla bina cephelerine zarafet ve modernlik katar. Farklı mimari tasarımlara uyum sağlayan çeşitli profil ve yüzey seçenekleriyle sunulur; güvenlik ve kalite standartlarını gözeterek şık görünüm ile işlevselliği birleştirir."
      },
      "ckb": {
        "name": "مەحاجەرەی شووشەیی باڵکۆن",
        "title": "مەحاجەرەی شووشەیی باڵکۆن",
        "description": "مەحاجەرەی شووشەیی باڵکۆن لمسەیەک لە کەشخەیی و نوێگەری دەبەخشێتە ڕووکاری باڵەخانەکان، لەگەڵ دیزاینێک کە دیمەنێکی کراوە و هەستی فراوانیت پێ دەبەخشێت. بە چوارچێوە و شێوازی جۆراوجۆر بەردەستە کە لەگەڵ دیزاینە نژیاروانییە جیاوازەکان دەگونجێت، بە ڕەچاوکردنی بەرزترین مەرجەکانی سەلامەتی و کوالێتی."
      },
      "kmr": {
        "name": "Mihacerên Cam ên Balkonan",
        "title": "Mihacerên Cam ên Balkonan",
        "description": "Mihacerên cam ên balkonan têkiliyek ji zerafet û nûjeniyê didin rûyên avahiyan, bi sêwiranek ku dîmenek vekirî û hestek firehiyê dide we. Bi çarçove û تشطîbatên جûrbecûr ên ku bi sêwiranên mîmarî yên جûda re li hev tên peyda dibin, û xuyanga bilind bi ewlehî û kalîteyê re digihînin hev."
      },
      "en-GB": {
        "name": "Glass Balcony Railings",
        "title": "Glass Balcony Railings",
        "description": "Glass balcony railings add a touch of elegance and modernity to building facades, offering unobstructed views and a spacious feel. Available in a variety of finishes and framing options to complement diverse architectural styles while meeting the highest standards of safety and quality."
      },
      "en-US": {
        "name": "Glass Balcony Railings",
        "title": "Glass Balcony Railings",
        "description": "Glass balcony railings add a touch of elegance and modernity to building facades, offering unobstructed views and a spacious feel. Available in a variety of finishes and framing options to complement diverse architectural styles while meeting the highest standards of safety and quality."
      }
    }
  }
];

export function loadHomepageSections(): HomepageSectionConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load homepage sections from localStorage:", err);
  }
  return DEFAULT_HOMEPAGE_SECTIONS;
}

export function saveHomepageSections(sections: HomepageSectionConfig[]): void {
  try {
    const nextJson = JSON.stringify(sections);
    const prevJson = localStorage.getItem(STORAGE_KEY);
    if (prevJson === nextJson) return;
    localStorage.setItem(STORAGE_KEY, nextJson);
    window.dispatchEvent(
      new CustomEvent(HOMEPAGE_SECTIONS_UPDATED_EVENT, { detail: sections })
    );
  } catch (err) {
    console.error("Failed to save homepage sections:", err);
  }
}

export function subscribeToHomepageSections(
  callback: (sections: HomepageSectionConfig[]) => void
): () => void {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<HomepageSectionConfig[]>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(loadHomepageSections());
    }
  };
  window.addEventListener(HOMEPAGE_SECTIONS_UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(HOMEPAGE_SECTIONS_UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getLocalizedSectionHeader(
  section: HomepageSectionConfig,
  langCode: string
): { title: string; description: string } {
  const baseLang = langCode.split("-")[0];
  const exact = section.translations?.[langCode];
  const base = section.translations?.[baseLang];
  const title =
    exact?.title ||
    exact?.name ||
    base?.title ||
    base?.name ||
    section.title ||
    "";
  const description =
    exact?.description ||
    base?.description ||
    section.description ||
    "";
  return { title, description };
}
