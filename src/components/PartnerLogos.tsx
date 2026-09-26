import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

const PARTNERS_TITLE_BY_LANG: Record<string, string> = {
  "en": "Authorized European Partners & Architectural Brands",
  "en-GB": "Authorized European Partners & Architectural Brands",
  "en-US": "Authorized European Partners & Architectural Brands",
  "ar": "الشركاء الأوروبيون المعتمدون والعلامات المعمارية العالمية",
  "ckb": "هاوبەشە فەرمییە ئەوروپییەکان و براندە باوەڕپێکراوەکان",
  "kmr": "Hevkarên Fermî yên Ewropî û Marqeyên Mîmarî",
  "tr": "Yetkili Avrupalı Ortaklar ve Mimari Markalar",
  "de": "Autorisierte europäische Partner & Architekturmarken",
  "fr": "Partenaires Européens Agréés et Marques Architecturales",
  "it": "Partner Europei Autorizzati e Marchi Architettonici Prestigiosi",
  "es": "Socios Europeos Autorizados y Marcas Arquitectónicas",
  "es-MX": "Socios Europeos Autorizados y Marcas Arquitectónicas",
  "pt": "Parceiros Europeus Autorizados e Marcas Arquitetónicas",
  "pt-BR": "Parceiros Europeus Autorizados e Marcas Arquitetônicas",
  "fa": "شرکای رسمی اروپایی و برندهای معماری معتبر",
  "ru": "Авторизованные европейские партнеры и архитектурные бренды",
  "zh-CN": "欧洲授权合作伙伴与建筑知名品牌",
  "nl": "Geautoriseerde Europese partners en architectonische merken",
  "pl": "Autoryzowani partnerzy europejscy i marki architektoniczne",
  "ro": "Parteneri Europeni Autorizați și Mărci Arhitecturale",
  "el": "Εξουσιοδοτημένοι Ευρωπαίοι Συνεργάτες & Αρχιτεκτονικά Brands",
  "sv": "Auktoriserade europeiska partners och arkitektoniska varumärken",
  "hi": "अधिकृत यूरोपीय साझेदार और वास्तुशिल्प ब्रांड",
  "ja": "認定ヨーロッパパートナーおよび建築ブランド",
  "ko": "공식 유럽 파트너 및 건축 프리미엄 브랜드",
  "kk": "Уәкілетті еуропалық серіктестер және сәулет брендтері",
  "sr": "Овлашћени европски партнери и архитектонски брендови",
  "hr": "Ovlašteni europski partneri i arhitektonski brendovi",
  "bs": "Ovlašteni evropski partneri i arhitektonski brendovi",
  "sq": "Partnerë të Autorizuar Evropianë dhe Marka Arkitekturore",
  "bg": "Оторизирани европейски партньори и архитектурни марки"
};

interface PartnerBrand {
  id: string;
  name: string;
  src: string;
  alt: string;
}

const PARTNER_LOGOS_LIST: PartnerBrand[] = [
  { id: 'alumass', name: 'ALUMASS', src: '/assets/doorhome/4-1.png', alt: 'ALUMASS Aluminum Systems' },
  { id: 'diaco', name: 'diaco', src: '/assets/doorhome/5-2.png', alt: 'diaco Systems' },
  { id: 'master', name: 'MASTER', src: '/assets/doorhome/6-2.png', alt: 'Master Italy Hardware' },
  { id: 'comunello', name: 'COMUNELLO', src: '/assets/doorhome/7-1.png', alt: 'Comunello Frame Automation' },
  { id: 'deceuninck', name: 'deceuninck', src: '/assets/doorhome/8-1.png', alt: 'Deceuninck Belgium' },
  { id: 'siegenia', name: 'SIEGENIA', src: '/assets/doorhome/9-1.png', alt: 'Siegenia German Tech' },
  { id: 'salamander', name: 'SALAMANDER', src: '/assets/doorhome/10.png', alt: 'Salamander Profile Systems' },
  { id: 'stac', name: 'STAC', src: '/assets/doorhome/1-2.png', alt: 'STAC Spain Hardware' },
  { id: 'lorenzoline', name: 'LORENZOLINE', src: '/assets/doorhome/2-1.png', alt: 'Lorenzoline Architectural' },
  { id: 'maestro', name: 'MAESTRO', src: '/assets/doorhome/3-1.png', alt: 'Maestro Systems' },
];

// 4 duplicate sets to guarantee endless seamless circular scrolling
const REPEATED_PARTNERS = [
  ...PARTNER_LOGOS_LIST,
  ...PARTNER_LOGOS_LIST,
  ...PARTNER_LOGOS_LIST,
  ...PARTNER_LOGOS_LIST
];

export const PartnerLogos: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const baseLang = currentLanguage.code.split('-')[0];
  const title =
    PARTNERS_TITLE_BY_LANG[currentLanguage.code] ||
    PARTNERS_TITLE_BY_LANG[baseLang] ||
    PARTNERS_TITLE_BY_LANG.en;

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef<number>(0);
  const isInteractingRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartScrollRef = useRef<number>(0);

  // Helper to pause auto-spin and schedule smooth resume
  const pauseTemporarily = useCallback((durationMs = 2000) => {
    isInteractingRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      if (!isHoveredRef.current) {
        if (scrollRef.current) {
          scrollPosRef.current = scrollRef.current.scrollLeft;
        }
        isInteractingRef.current = false;
      }
    }, durationMs);
  }, []);

  // Initialize scroll position in the middle for seamless two-way scrolling
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const initialInit = () => {
      const singleSetWidth = el.scrollWidth / 4;
      if (singleSetWidth > 0 && el.scrollLeft === 0) {
        el.scrollLeft = singleSetWidth;
        scrollPosRef.current = singleSetWidth;
      }
    };
    initialInit();
    const timer = setTimeout(initialInit, 200);
    return () => clearTimeout(timer);
  }, []);

  // Continuous 60fps auto-spin animation loop
  useEffect(() => {
    let animId: number;
    const speed = 0.8; // Smooth reading pace

    const tick = () => {
      const el = scrollRef.current;
      if (el && !isInteractingRef.current && !isHoveredRef.current) {
        const singleSetWidth = el.scrollWidth / 4;
        scrollPosRef.current += speed;

        // Seamless wrap around when reaching the boundary
        if (singleSetWidth > 0) {
          if (scrollPosRef.current >= singleSetWidth * 2.5) {
            scrollPosRef.current -= singleSetWidth;
          } else if (scrollPosRef.current <= singleSetWidth * 0.5) {
            scrollPosRef.current += singleSetWidth;
          }
        }
        el.scrollLeft = scrollPosRef.current;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // Handle native scroll updates (sync position & wrap)
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const singleSetWidth = el.scrollWidth / 4;
    if (singleSetWidth > 0) {
      if (el.scrollLeft >= singleSetWidth * 2.8) {
        el.scrollLeft -= singleSetWidth;
        scrollPosRef.current = el.scrollLeft;
      } else if (el.scrollLeft <= singleSetWidth * 0.2) {
        el.scrollLeft += singleSetWidth;
        scrollPosRef.current = el.scrollLeft;
      }
    }
  };

  // Mouse Drag to slide RTL & LTR
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    isInteractingRef.current = true;
    dragStartXRef.current = e.pageX;
    dragStartScrollRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!isDragging || !el) return;
    e.preventDefault();
    const walk = (e.pageX - dragStartXRef.current) * 1.5;
    el.scrollLeft = dragStartScrollRef.current - walk;
    scrollPosRef.current = el.scrollLeft;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      pauseTemporarily(1800);
    }
  };

  // Touch Swipe for mobile RTL & LTR
  const handleTouchStart = (e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isInteractingRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragStartScrollRef.current = el.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    const walk = (e.touches[0].clientX - dragStartXRef.current) * 1.5;
    el.scrollLeft = dragStartScrollRef.current - walk;
    scrollPosRef.current = el.scrollLeft;
  };

  const handleTouchEnd = () => {
    pauseTemporarily(1800);
  };

  return (
    <section className="py-10 sm:py-14 doorhome-textured-red text-white overflow-hidden relative border-y border-red-900/40 select-none">
      {/* Background glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-28 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center relative z-10">
        <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
          {title}
        </h3>
      </div>

      {/* Interactive & Auto-Spinning Carousel Container */}
      <div className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-8">

        {/* Auto-Spinning & User Draggable Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={() => {
            isHoveredRef.current = false;
            handleMouseUpOrLeave();
          }}
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`flex items-center gap-12 sm:gap-20 overflow-x-auto py-4 px-10 no-scrollbar ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {REPEATED_PARTNERS.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="shrink-0 flex items-center justify-center select-none hover:scale-110 transition-transform duration-200 bg-white/90 rounded-xl px-4 py-2 backdrop-blur-sm"
            >
              <img
                src={partner.src}
                alt={partner.alt || partner.name}
                title={partner.name}
                loading="eager"
                className="h-8 sm:h-10 max-w-[120px] sm:max-w-[150px] w-auto object-contain pointer-events-none select-none"
                onError={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.logo-fallback')) {
                    const fallback = document.createElement('span');
                    fallback.className = 'logo-fallback text-xs font-black tracking-wider text-slate-800 uppercase';
                    fallback.textContent = partner.name;
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>

  );
};

export default PartnerLogos;
