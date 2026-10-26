import React, { useState, useEffect, useRef, useCallback } from 'react';
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

export const isImageFlag = (val?: string): boolean => {
  if (!val) return false;
  const trimmed = val.trim();
  return (
    trimmed.startsWith('/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/') ||
    /\.(png|jpg|jpeg|webp|svg|gif|avif)(\?.*)?$/i.test(trimmed)
  );
};

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const isUserInteractingRef = useRef(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // 4 sets for continuous infinite bidirectional scrolling
  const REPEATED = [...logos, ...logos, ...logos, ...logos];

  const pauseAutoScroll = useCallback((durationMs = 2500) => {
    isUserInteractingRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      if (!isDraggingRef.current) {
        isUserInteractingRef.current = false;
      }
    }, durationMs);
  }, []);

  // Smooth continuous auto-scroll loop via requestAnimationFrame
  useEffect(() => {
    if (logos.length === 0) return;
    const container = scrollRef.current;
    if (!container) return;

    let animId: number;
    let singleSetWidth = container.scrollWidth / 4;

    // Start in the middle so user can scroll left or right immediately
    if (container.scrollLeft === 0 && singleSetWidth > 0) {
      container.scrollLeft = singleSetWidth;
    }

    const step = () => {
      if (container && singleSetWidth > 0) {
        if (!isUserInteractingRef.current && !isDraggingRef.current) {
          container.scrollLeft += 0.8;
        }

        // Seamless infinite loop check
        if (container.scrollLeft >= singleSetWidth * 2.5) {
          container.scrollLeft -= singleSetWidth;
        } else if (container.scrollLeft <= singleSetWidth * 0.5) {
          container.scrollLeft += singleSetWidth;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    const handleResize = () => {
      if (container) {
        singleSetWidth = container.scrollWidth / 4;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [logos]);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    isUserInteractingRef.current = true;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStartRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      pauseAutoScroll(2000);
    }
  };

  // Touch Handlers
  const handleTouchStart = () => {
    isUserInteractingRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleTouchEnd = () => {
    pauseAutoScroll(2500);
  };

  // Wheel Handler
  const handleWheel = () => {
    pauseAutoScroll(2000);
  };

  if (logos.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 doorhome-textured-red text-white overflow-hidden relative border-y border-red-900/40 select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-28 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center relative z-10 dh-reveal">
        <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
          {title}
        </h3>
      </div>

      {/* Interactive Horizontally Scrollable Carousel Stage */}
      <div className="relative max-w-[1400px] mx-auto px-2 sm:px-4">
        {/* Scrollable, Draggable Logo Track */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className="overflow-x-auto scrollbar-none flex items-center gap-6 sm:gap-10 py-3 px-8 cursor-grab active:cursor-grabbing select-none"
          dir="ltr"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
          }}
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
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/45 border border-white/20 text-white shadow-xs mt-1"
                  title={partner.country || ''}
                >
                  {isImageFlag(partner.flag) ? (
                    <img
                      src={partner.flag}
                      alt={partner.country || 'Flag'}
                      className="w-5 h-3.5 object-cover rounded-xs border border-white/40 shadow-xs inline-block"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-sm leading-none">{partner.flag}</span>
                  )}
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
