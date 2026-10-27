import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface AboutSectionProps {
  onExploreTypologies?: () => void;
  onOpenQuoteModal?: () => void;
}

interface AboutEditorialContent {
  title: string;
  paragraph: string;
}

const ABOUT_CONTENT_BY_LANG: Record<string, AboutEditorialContent> = {
  ar: {
    title: 'لماذا تختار أنظمة باب المنزل لمشروعك؟',
    paragraph:
      'تجمع شركة باب المنزل بين دقة الهندسة الأوروبية وإتقان التصنيع المحلي لتقديم أنظمة معمارية متكاملة تدوم لأجيال طويلة. صُممت نوافذنا وأبوابنا بعوازل حرارية متطورة تقاوم حرارة الصيف الشديدة وتحافظ على اعتدال ودفء الأجواء الداخلية في فصل الشتاء، إلى جانب نظام عزل صوتي متعدد الحجرات مع طبقات مطاطية محكمة تمنع ضوضاء الشوارع وتمنح منزلك هدوءاً تاماً. كما تتميز مقاطعنا المعمارية بصلابة عالية تقاوم الأمطار الغزيرة والعواصف الرملية والغبار دون أي تسريب، وتكتمل بآليات إغلاق وأقفال أوروبية متعددة النقاط تمنح عائلتك أعلى مستويات الأمان والراحة في الاستخدام اليومي.'
  },
  ckb: {
    title: 'بۆچی سیستەمەکانی دەرگای ماڵ بۆ پڕۆژەکەت هەڵبژێریت؟',
    paragraph:
      'کۆمپانیای دەرگای ماڵ ئەندازیاریی وردی ئەورووپی لەگەڵ کارامەیی بەرهەمهێنانی ناوخۆیی تێکەڵ دەکات بۆ پێشکەشکردنی سیستەمی نژیاروانیی وا کە نەوە لە دوای نەوە دەمێنێتەوە. پەنجەرە و دەرگاکانمان بە عەزلی گەرمیی پێشکەوتوو دروست کراون بۆ بەرگەگرتنی گەرمای هاوین و پاراستنی گەرمیی ناو ماڵ لە زستاندا، لەگەڵ پێکهاتەی ناوەکیی فرەخانە و لاستیکی توندوتۆڵ کە دەنگەدەنگی شەقام و ژاوەژاوی شار بە تەواوی دەگرێت و ئارامییەکی تەواو دەبەخشێت. هەروەها پرۆفایلە بەهێزکراوەکانمان بەرگەی بارانی بەخوڕ و ڕەشەبا و تۆزوخۆڵ دەگرن بەبێ هیچ دزەکردنێک، و بە سیستەمی قوفڵی فرەخاڵی ئەورووپی تەواو دەکرێن بۆ دابینکردنی بەرزترین ئاستی ئاسایش و دڵنیایی لە بەکارهێنانی ڕۆژانەدا.'
  },
  kmr: {
    title: 'Çima Pergalên Deriyê Malê ji bo Projeya Xwe Hilbijêrin?',
    paragraph:
      'Deriyê Malê endezyariya hûrgulî ya Ewropî bi hostatiya hilberîna herêmî re digihîne hev da ku pergalên mîmarî yên ku nifş bi nifş dimînin pêşkêş bike. Pencere û deriyên me bi îzolasyona germiyê ya pêşketî hatine sêwirandin da ku li hember germahiya dijwar a havînê li ber xwe bidin û di zivistanê de germahiya hundir biparêzin, digel avahiya pir-odeyî û lastîkên girtî yên ku dengê kolanan û qerebalixiya bajêr bi tevahî asteng dikin. Her wiha profîlên me yên bihêzkirî li hember barana gur, bager û tozê bi تەواوی berxwedêr in, û bi kilîtên ewlehiyê yên pir-xalî yên Ewropî tên temamkirin da ku ewlehî û rehetiya herî bilind bidin mala we.'
  },
  en: {
    title: 'Why Choose Doorhome Systems for Your Project?',
    paragraph:
      'Doorhome unites precision European engineering with master local craftsmanship to deliver architectural systems built to last for generations. Our windows and doors are designed with advanced thermal break barriers that repel extreme summer heat and preserve comfortable indoor warmth through winter, paired with multi-chamber acoustic sealing that shuts out city traffic noise for complete indoor serenity. Reinforced structural profiles stand firm against heavy rain, wind, and dust storms with zero leakage, while multipoint European locking mechanisms provide effortless daily operation and lasting family security.'
  },
  tr: {
    title: 'Projeniz İçin Neden Kapı Ev Sistemlerini Seçmelisiniz?',
    paragraph:
      'Kapı Ev, nesiller boyu dayanacak mimari sistemler sunmak için hassas Avrupa mühendisliğini yerel üretim ustalığıyla bir araya getirir. Pencere ve kapılarımız, kavurucu yaz sıcaklarını dışarıda tutan ve kış aylarında iç mekan sıcaklığını koruyan gelişmiş ısı yalıtım bariyerleriyle tasarlanmış olup, çok odacıklı ses yalıtım contaları sayesinde şehir gürültüsünü tamamen engelleyerek huzurlu bir yaşam alanı sağlar. Güçlendirilmiş profillerimiz şiddetli yağmur, rüzgar ve toz fırtınalarına karşı tam sızdırmazlık sunarken, çok noktalı Avrupa kilit mekanizmaları günlük kullanımda üstün konfor ve yüksek güvenlik sağlar.'
  }
};

export const AboutSection: React.FC<AboutSectionProps> = () => {
  const { currentLanguage } = useLanguage();
  const [factoryImage, setFactoryImage] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem('winhome_cms_homepage_media') || '{}')
          .aboutFactoryImage || '/products-assets/photo_63_2026-09-26_07-36-01.jpg'
      );
    } catch {
      return '/products-assets/photo_63_2026-09-26_07-36-01.jpg';
    }
  });

  useEffect(() => {
    const sync = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem('winhome_cms_homepage_media') || '{}'
        );
        setFactoryImage(
          saved.aboutFactoryImage || '/products-assets/photo_63_2026-09-26_07-36-01.jpg'
        );
      } catch {
        /* Keep the current image when saved content is invalid. */
      }
    };
    window.addEventListener('cms_homepage_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('cms_homepage_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const baseLang = currentLanguage.code.split('-')[0];
  const content =
    ABOUT_CONTENT_BY_LANG[currentLanguage.code] ||
    ABOUT_CONTENT_BY_LANG[baseLang] ||
    ABOUT_CONTENT_BY_LANG.ar;

  return (
    <section
      id="about"
      className="w-full py-14 sm:py-20 bg-[radial-gradient(ellipse_at_95%_0%,rgba(220,38,38,0.05),transparent_40%),#fff] relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        <div className="clearfix dh-reveal">
          {/* Floated Left Stacked-Frame Image (Always on the left, text wraps to the right and underneath) */}
          <div className="float-left mr-5 mb-3 sm:mr-9 sm:mb-5 relative select-none shrink-0 mt-1 ml-1">
            {/* Back Tilted Frame 1 */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-white border-[2.5px] sm:border-[3px] border-slate-900 -rotate-6 shadow-xs"
            />
            {/* Middle Tilted Frame 2 */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-white border-[2.5px] sm:border-[3px] border-slate-900 rotate-3 shadow-xs"
            />
            {/* Front Main Frame */}
            <div className="relative bg-white border-[2.5px] sm:border-[3px] border-slate-900 p-2.5 sm:p-4 shadow-md">
              <div className="border-[2px] border-slate-900 overflow-hidden w-28 h-32 sm:w-48 sm:h-52 md:w-56 md:h-60 bg-slate-100">
                <img
                  src={factoryImage}
                  alt="Doorhome Architectural Systems"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      '/products-assets/photo_63_2026-09-26_07-36-01.jpg';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Heading with dir="auto" so RTL wrapped words align cleanly on the right */}
          <h2
            dir="auto"
            className="text-2xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-snug mb-3 sm:mb-4"
          >
            {content.title}
          </h2>

          {/* Pure, single-language flowing paragraph with comfortable line height and dir="auto" */}
          <p
            dir="auto"
            className="text-base sm:text-lg lg:text-[18.5px] text-slate-600 leading-[1.85] font-normal"
          >
            {content.paragraph}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
