import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

const PARTNERS_TITLE_BY_LANG: Record<string, string> = {
  "en": "Authorized European Partners & Architectural Brands",
  "ar": "الشركاء الأوروبيون المعتمدون والعلامات المعمارية العالمية",
  "ckb": "هاوبەشە فەرمییە ئەوروپییەکان و براندە باوەڕپێکراوەکان",
  "kmr": "Hevkarên Fermî yên Ewropî û Marqeyên Mîmarî",
  "tr": "Yetkili Avrupalı Ortaklar ve Mimari Markalar",
};

export interface PartnerBrand {
  id: string;
  name: string;
  src: string;
  alt: string;
  country?: string;
  flag?: string;
}

const DEFAULT_PARTNER_LOGOS: PartnerBrand[] = [
  { id: 'alumass', name: 'ALUMASS', src: '/assets/doorhome/4-1.png', alt: 'ALUMASS Aluminum Systems', country: 'Italy', flag: '🇮🇹' },
  { id: 'diaco', name: 'diaco', src: '/assets/doorhome/5-2.png', alt: 'diaco Systems', country: 'Turkey', flag: '🇹🇷' },
  { id: 'master', name: 'MASTER', src: '/assets/doorhome/6-2.png', alt: 'Master Italy Hardware', country: 'Italy', flag: '🇮🇹' },
  { id: 'comunello', name: 'COMUNELLO', src: '/assets/doorhome/7-1.png', alt: 'Comunello Frame Automation', country: 'Italy', flag: '🇮🇹' },
  { id: 'deceuninck', name: 'deceuninck', src: '/assets/doorhome/8-1.png', alt: 'Deceuninck Belgium', country: 'Belgium', flag: '🇧🇪' },
  { id: 'siegenia', name: 'SIEGENIA', src: '/assets/doorhome/9-1.png', alt: 'Siegenia German Tech', country: 'Germany', flag: '🇩🇪' },
  { id: 'salamander', name: 'SALAMANDER', src: '/assets/doorhome/10.png', alt: 'Salamander Profile Systems', country: 'Germany', flag: '🇩🇪' },
  { id: 'stac', name: 'STAC', src: '/assets/doorhome/1-2.png', alt: 'STAC Spain Hardware', country: 'Spain', flag: '🇪🇸' },
  { id: 'lorenzoline', name: 'LORENZOLINE', src: '/assets/doorhome/2-1.png', alt: 'Lorenzoline Architectural', country: 'Italy', flag: '🇮🇹' },
  { id: 'maestro', name: 'MAESTRO', src: '/assets/doorhome/3-1.png', alt: 'Maestro Systems', country: 'Greece', flag: '🇬🇷' },
];

const STORAGE_KEY_PARTNER_LOGOS = 'winhome_cms_partner_logos';
let cachedLogos: PartnerBrand[] | null = null;
const subscribers = new Set<() => void>();

export function getPartnerLogos(): PartnerBrand[] {
  if (cachedLogos !== null) return cachedLogos;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PARTNER_LOGOS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        cachedLogos = parsed;
        return cachedLogos;
      }
    }
  } catch {}
  return DEFAULT_PARTNER_LOGOS;
}

export function updateCachedPartnerLogos(logos: PartnerBrand[]) {
  cachedLogos = logos;
  try {
    localStorage.setItem(STORAGE_KEY_PARTNER_LOGOS, JSON.stringify(logos));
  } catch {}
  subscribers.forEach((fn) => fn());
}

export async function loadPartnerLogosFromCms(): Promise<PartnerBrand[]> {
  try {
    const res = await fetch('/api/cms/partnerLogos?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error('not ok');
    const json = await res.json();
    if (Array.isArray(json.data)) {
      cachedLogos = json.data;
      try {
        localStorage.setItem(STORAGE_KEY_PARTNER_LOGOS, JSON.stringify(json.data));
      } catch {}
    } else {
      cachedLogos = getPartnerLogos();
    }
  } catch {
    cachedLogos = getPartnerLogos();
  }
  subscribers.forEach((fn) => fn());
  return cachedLogos!;
}

export function subscribeToPartnerLogos(fn: () => void) {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

export const PartnerLogos: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const baseLang = currentLanguage.code.split('-')[0];
  const title =
    PARTNERS_TITLE_BY_LANG[currentLanguage.code] ||
    PARTNERS_TITLE_BY_LANG[baseLang] ||
    PARTNERS_TITLE_BY_LANG.en;

  const [logos, setLogos] = useState<PartnerBrand[]>(getPartnerLogos);

  useEffect(() => {
    loadPartnerLogosFromCms().then(setLogos);
    const handleUpdate = () => {
      loadPartnerLogosFromCms().then(setLogos);
    };
    window.addEventListener('cms_partner_logos_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    const unsubscribe = subscribeToPartnerLogos(() => setLogos(getPartnerLogos()));
    return () => {
      window.removeEventListener('cms_partner_logos_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      unsubscribe();
    };
  }, []);

  if (logos.length === 0) return null;

  // 4 duplicate sets to guarantee endless seamless circular scrolling
  const REPEATED = [...logos, ...logos, ...logos, ...logos];

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef<number>(0);
  const isInteractingRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrameRef = useRef<number>(0);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartScrollRef = useRef<number>(0);

  const pauseTemporarily = useCallback((ms: number) => {
    isInteractingRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, ms);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const SPEED = 0.6;
    let lastTime = performance.now();

    const tick = (now: number) => {
      animFrameRef.current = requestAnimationFrame(tick);
      if (isInteractingRef.current || isHoveredRef.current) { lastTime = now; return; }
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;
      scrollPosRef.current += SPEED * dt / 16;
      el.scrollLeft = scrollPosRef.current;
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
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [logos]);

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

  const handleTouchEnd = () => { pauseTemporarily(1800); };

  return (
    <section className="py-10 sm:py-14 doorhome-textured-red text-white overflow-hidden relative border-y border-red-900/40 select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-28 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center relative z-10 dh-reveal">
        <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
          {title}
        </h3>
      </div>

      <div className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-8 dh-reveal dh-stagger-2">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={() => { isHoveredRef.current = false; handleMouseUpOrLeave(); }}
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`flex items-end gap-12 sm:gap-20 overflow-x-auto py-4 px-10 no-scrollbar ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {REPEATED.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="shrink-0 flex flex-col items-center justify-end gap-1 select-none"
            >
              <div className="flex items-center justify-center bg-white rounded-2xl px-5 py-2.5 shadow-sm hover:scale-105 transition-transform duration-200 min-w-[130px] sm:min-w-[150px] h-12 sm:h-14">
                <img
                  src={partner.src}
                  alt={partner.alt || partner.name}
                  title={partner.name}
                  loading="eager"
                  className="h-9 sm:h-11 max-w-[130px] sm:max-w-[160px] w-auto object-contain pointer-events-none select-none"
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
              {/* Country flag below logo */}
              {partner.flag && (
                <div
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/35 backdrop-blur-md border border-white/15 text-white shadow-xs mt-1"
                  title={partner.country || ''}
                >
                  <span className="text-sm leading-none">{partner.flag}</span>
                  {partner.country && (
                    <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-95">
                      {partner.country}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;
