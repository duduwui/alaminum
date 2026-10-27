export interface HomepageSectionConfig {
  id: string;
  key: string;
  title: string;
  description: string;
  translations?: Record<string, { name?: string; title?: string; description?: string }>;
}

const STORAGE_KEY = 'winhome_homepage_sections_v1';
export const HOMEPAGE_SECTIONS_UPDATED_EVENT = 'winhome_homepage_sections_updated';

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  {
    id: 'sec-windows',
    key: 'windows',
    title: 'أنظمة النوافذ المعمارية',
    description:
      'نوافذ عصرية تجمع بين الإطلالة البانورامية الواسعة والعزل المتكامل، مصممة لتمنح منزلك إضاءة طبيعية ساحرة وهدوءاً تاماً في جميع الفصول.',
    translations: {
      ar: {
        name: 'أنظمة النوافذ المعمارية',
        title: 'أنظمة النوافذ المعمارية',
        description:
          'نوافذ عصرية تجمع بين الإطلالة البانورامية الواسعة والعزل المتكامل، مصممة لتمنح منزلك إضاءة طبيعية ساحرة وهدوءاً تاماً في جميع الفصول.'
      },
      en: {
        name: 'Architectural Window Systems',
        title: 'Architectural Window Systems',
        description:
          'Modern windows combining wide panoramic views with complete insulation, designed to fill your home with natural light and peaceful indoor comfort across every season.'
      },
      ckb: {
        name: 'سیستەمی پەنجەرەی نژیاروانی',
        title: 'سیستەمی پەنجەرەی نژیاروانی',
        description:
          'پەنجەرەی مۆدێرن کە دیمەنی پانۆرامای فراوان و عەزلی تەواو تێکەڵ دەکات، دیزاین کراوە بۆ بەخشینی ڕووناکی سروشتی و ئارامی تەواو لە هەموو وەرزەکاندا.'
      },
      kmr: {
        name: 'Sîstemên Pace û Pencereyên Mîmarî',
        title: 'Sîstemên Pace û Pencereyên Mîmarî',
        description:
          'Pencereyên nûjen ên ku dîmena panoramîk a fireh û îzolasyona bêkêmasî digihînin hev, ji bo ronahiya xwezayî û aramiya tam di her demsalê de hatine sêwirandin.'
      },
      tr: {
        name: 'Mimari Pencere Sistemleri',
        title: 'Mimari Pencere Sistemleri',
        description:
          'Geniş panoramik manzarayı tam yalıtımla birleştiren, evinize her mevsim doğal ışık ve huzurlu bir konfor sunmak için tasarlanmış modern pencereler.'
      }
    }
  },
  {
    id: 'sec-doors',
    key: 'doors',
    title: 'أنظمة الأبواب والمداخل العصرية',
    description:
      'تشكيلة مختارة من الأبواب والبوابات العصرية التي تجمع بين الفخامة والصلابة، لتمنح مدخل منزلك حضوراً مميزاً يعكس ذوقك الرفيع منذ اللحظة الأولى.',
    translations: {
      ar: {
        name: 'أنظمة الأبواب والمداخل العصرية',
        title: 'أنظمة الأبواب والمداخل العصرية',
        description:
          'تشكيلة مختارة من الأبواب والبوابات العصرية التي تجمع بين الفخامة والصلابة، لتمنح مدخل منزلك حضوراً مميزاً يعكس ذوقك الرفيع منذ اللحظة الأولى.'
      },
      en: {
        name: 'Modern Door & Entrance Systems',
        title: 'Modern Door & Entrance Systems',
        description:
          "A curated collection of modern doors and gates uniting luxury and strength to give your home's entrance a distinctive presence from the very first glance."
      },
      ckb: {
        name: 'سیستەمی دەرگا و دەروازەی مۆدێرن',
        title: 'سیستەمی دەرگا و دەروازەی مۆدێرن',
        description:
          'کۆمەڵەیەکی هەڵبژێردراو لە دەرگا و دەروازەی مۆدێرن کە فەخامەت و پتەوی تێکەڵ دەکات بۆ بەخشینی دیمەنێکی ناوازە بە دەروازەی ماڵەکەت.'
      },
      kmr: {
        name: 'Sîstemên Derî û Derwazeyên Nûjen',
        title: 'Sîstemên Derî û Derwazeyên Nûjen',
        description:
          'Koleksiyonek bijartî ya derî û derwazeyên nûjen ên ku luks û پتewiyê digihînin hev da ku ji kêliya yekem ve xuyangek bêhempa bidin ketina mala we.'
      },
      tr: {
        name: 'Modern Kapı ve Giriş Sistemleri',
        title: 'Modern Kapı ve Giriş Sistemleri',
        description:
          'İlk bakıştan itibaren evinizin girişine seçkin bir görünüm kazandırmak için lüks ve sağlamlığı bir araya getiren modern kapı ve giriş sistemleri.'
      }
    }
  },
  {
    id: 'sec-accessories',
    key: 'accessories',
    title: 'الإكسسوارات والمقابض المعمارية',
    description:
      'مقابض وأقفال وإكسسوارات هندسية دقيقة تضيف اللمسة النهائية الأنيقة لأبوابك ونوافذك وتجمع بين راحة الاستخدام اليومي والأمان العالي.',
    translations: {
      ar: {
        name: 'الإكسسوارات والمقابض المعمارية',
        title: 'الإكسسوارات والمقابض المعمارية',
        description:
          'مقابض وأقفال وإكسسوارات هندسية دقيقة تضيف اللمسة النهائية الأنيقة لأبوابك ونوافذك وتجمع بين راحة الاستخدام اليومي والأمان العالي.'
      },
      en: {
        name: 'Architectural Hardware & Accessories',
        title: 'Architectural Hardware & Accessories',
        description:
          'Precision-engineered handles, locks, and accessories that add the finishing touch of elegance to your doors and windows while combining daily comfort with lasting security.'
      },
      ckb: {
        name: 'ئێکسسوارات و دەسکی نژیاروانی',
        title: 'ئێکسسوارات و دەسکی نژیاروانی',
        description:
          'دەسک و قفڵ و ئێکسسواراتی ئەندازیاری ورد کە کۆتا دەستلێدانی جوانی دەبەخشنە دەرگا و پەنجەرەکانت لەگەڵ ئاسایش و ئاسوودەیی ڕۆژانە.'
      },
      kmr: {
        name: 'Aksesûar û Destikên Mîmarî',
        title: 'Aksesûar û Destikên Mîmarî',
        description:
          'Destik, kilît û aksesûarên endezyariya ورد ên ku bedewiya dawîn li derî û pencereyên we zêde dikin û rehetiya rojane bi ewlehiya bilind re digihînin hev.'
      },
      tr: {
        name: 'Mimari Aksesuar ve Kol Sistemleri',
        title: 'Mimari Aksesuar ve Kol Sistemleri',
        description:
          'Kapı ve pencerelerinize zarif bir son dokunuş katan, günlük kullanım konforunu yüksek güvenlikle birleştiren hassas mühendislik ürünü kollar, kilitler ve aksesuarlar.'
      }
    }
  }
];

export function loadHomepageSections(): HomepageSectionConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load homepage sections from localStorage:', err);
  }
  return DEFAULT_HOMEPAGE_SECTIONS;
}

export function saveHomepageSections(sections: HomepageSectionConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
    window.dispatchEvent(
      new CustomEvent(HOMEPAGE_SECTIONS_UPDATED_EVENT, { detail: sections })
    );
  } catch (err) {
    console.error('Failed to save homepage sections:', err);
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
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(HOMEPAGE_SECTIONS_UPDATED_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function getLocalizedSectionHeader(
  section: HomepageSectionConfig,
  langCode: string
): { title: string; description: string } {
  const baseLang = langCode.split('-')[0];
  const exact = section.translations?.[langCode];
  const base = section.translations?.[baseLang];
  const title =
    exact?.title ||
    exact?.name ||
    base?.title ||
    base?.name ||
    section.title ||
    '';
  const description =
    exact?.description ||
    base?.description ||
    section.description ||
    '';
  return { title, description };
}
