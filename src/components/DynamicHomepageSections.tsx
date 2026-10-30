import React, { useState, useEffect, useRef } from 'react';
import { ProductItem } from '../data/winhomeData';
import { HOMEPAGE_SECTION_ITEMS_SEED } from '../data/homepageSectionItemsSeed';
import {
  loadHomepageSectionItems,
  subscribeToHomepageSectionItems
} from '../services/homepageSectionItemsService';
import {
  HomepageSectionConfig,
  loadHomepageSections,
  subscribeToHomepageSections,
  getLocalizedSectionHeader
} from '../services/homepageSectionsService';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';
import { Parallax3DImageRing } from './Parallax3DImageRing';

interface SingleDynamicSectionProps {
  section: HomepageSectionConfig;
  sectionIndex: number;
  items: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
  onExploreCategory?: (category: string) => void;
}

const SingleDynamicSection: React.FC<SingleDynamicSectionProps> = ({
  section,
  sectionIndex,
  items,
  onSelectProduct
}) => {
  const { currentLanguage, t } = useLanguage();
  const [slideState, setSlideState] = useState<{ current: number; prev: number }>({
    current: 0,
    prev: 0
  });
  const [isPaused, setIsPaused] = useState(false);
  const autoSwapRef = useRef<NodeJS.Timeout | null>(null);

  const localizedItems = items.map((p) => getLocalizedProduct(p, currentLanguage.code));
  const { title: sectionTitle, description: sectionDesc } = getLocalizedSectionHeader(
    section,
    currentLanguage.code
  );

  const goToSlide = (nextIdx: number) => {
    if (localizedItems.length <= 1) return;
    setSlideState((prev) => {
      const safeCurrent = prev.current % localizedItems.length;
      const safeNext = ((nextIdx % localizedItems.length) + localizedItems.length) % localizedItems.length;
      if (safeNext === safeCurrent) return prev;
      return { current: safeNext, prev: safeCurrent };
    });
  };

  // Auto-swap every 8.5s with pause on hover
  useEffect(() => {
    if (isPaused || localizedItems.length <= 1) return;
    autoSwapRef.current = setInterval(() => {
      setSlideState((prev) => {
        const safeCurrent = prev.current % localizedItems.length;
        const safeNext = (safeCurrent + 1) % localizedItems.length;
        return { current: safeNext, prev: safeCurrent };
      });
    }, 8500);
    return () => {
      if (autoSwapRef.current) clearInterval(autoSwapRef.current);
    };
  }, [isPaused, localizedItems.length, slideState.current]);

  const safeIndex = localizedItems.length > 0 ? slideState.current % localizedItems.length : 0;
  const safePrevIndex = localizedItems.length > 0 ? slideState.prev % localizedItems.length : 0;
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idxStr, vidEl]) => {
      if (!vidEl) return;
      const idx = Number(idxStr);
      if (idx === safeIndex) {
        vidEl.play().catch(() => {});
      } else {
        vidEl.pause();
      }
    });
  }, [safeIndex]);

  if (localizedItems.length === 0) return null;

  const activeProduct = localizedItems[safeIndex] || localizedItems[0];
  const isAccessoryStyle = section.key === 'accessories';
  const isRtl = currentLanguage.code === 'ar' || currentLanguage.code === 'ckb';
  const isRailingSection = section.key === 'sec-1793119387374';

  const handlePrev = () => {
    goToSlide(safeIndex - 1);
  };

  const handleNext = () => {
    goToSlide(safeIndex + 1);
  };

  const bgClass =
    sectionIndex % 2 === 0
      ? 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
      : 'bg-white';

  const mediaBgClass = isAccessoryStyle ? 'bg-slate-50' : 'bg-slate-950';

  return (
    <section
      id={section.key}
      className={`${bgClass} border-b border-slate-200 scroll-mt-20 py-12 sm:py-16 relative overflow-hidden`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Full width start-aligned, strictly right-aligned in RTL and left-aligned in LTR */}
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="mb-8 w-full text-start"
        >
          {sectionTitle && (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {sectionTitle}
            </h2>
          )}
          {sectionDesc && (
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed mt-2.5 max-w-3xl whitespace-pre-line">
              {sectionDesc}
            </p>
          )}
        </div>

        {/* Dynamic Showcase: Draggable 3D Parallax Image Ring for Staircase Railings, or Card Swap for other sections */}
        {isRailingSection ? (
          <Parallax3DImageRing
            items={items}
            onSelectProduct={onSelectProduct}
          />
        ) : (
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Stacked Media Slides (Solid under-layer prevents any dark background flash during swap) */}
            <div
              className={`lg:col-span-6 relative ${mediaBgClass} overflow-hidden h-[320px] sm:h-[400px] lg:h-auto lg:min-h-[500px] w-full shrink-0`}
            >
              {localizedItems.map((slideItem, slideIdx) => {
                const isSlideActive = slideIdx === safeIndex;
                const isSlidePrev = slideIdx === safePrevIndex && safePrevIndex !== safeIndex;
                const slideIsVideo =
                  Boolean(slideItem.videoUrl) ||
                  /\.(mp4|webm|mov)(\?|#|$)/i.test(slideItem.image);
                const slideMediaSrc = slideItem.videoUrl || slideItem.image;

                return (
                  <div
                    key={slideItem.id || slideIdx}
                    aria-hidden={!isSlideActive}
                    className={`absolute inset-0 w-full h-full ${mediaBgClass} ${
                      isSlideActive
                        ? 'opacity-100 z-[3] pointer-events-auto transition-opacity duration-500 ease-out'
                        : isSlidePrev
                        ? 'opacity-100 z-[2] pointer-events-none transition-none'
                        : 'opacity-0 z-[1] pointer-events-none transition-none'
                    }`}
                  >
                    {slideIsVideo ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[slideIdx] = el;
                        }}
                        src={slideMediaSrc}
                        autoPlay={isSlideActive}
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={slideItem.image}
                        alt={slideItem.name}
                        onError={(e) => {
                          if (
                            slideItem.fallbackImage &&
                            e.currentTarget.src !== slideItem.fallbackImage
                          ) {
                            e.currentTarget.src = slideItem.fallbackImage;
                          }
                        }}
                        onClick={() => onSelectProduct(slideItem)}
                        className={`w-full h-full ${
                          isAccessoryStyle
                            ? 'object-contain p-6 sm:p-10 drop-shadow-sm'
                            : 'object-cover'
                        } cursor-pointer`}
                        loading="eager"
                        decoding="async"
                      />
                    )}
                  </div>
                );
              })}

              {/* Slide Counter, Dots & Prev/Next Pagination Controls */}
              <div className="absolute bottom-4 end-4 flex items-center gap-2 z-10">
                <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/10">
                  {localizedItems.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => goToSlide(dotIdx)}
                      aria-label={`Go to item ${dotIdx + 1}`}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        dotIdx === safeIndex
                          ? 'w-5 h-2 bg-red-500'
                          : 'w-2 h-2 bg-white/50 hover:bg-white'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-mono font-bold text-white/90 ms-1 px-1">
                    {safeIndex + 1} / {localizedItems.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous item"
                  className="w-8 h-8 rounded-full bg-slate-900/85 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next item"
                  className="w-8 h-8 rounded-full bg-slate-900/85 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>

            {/* Right: Pinned/Sticky Title, Full No-Scroll Text (Grid-stacked so card height never changes on swap) & Capsule CTA Button */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
              {/* Grid-stacked slides: locks height to the tallest slide in the section with zero scrollbar and zero text overlap */}
              <div className="grid grid-cols-1 grid-rows-1">
                {localizedItems.map((slideItem, slideIdx) => {
                  const isSlideActive = slideIdx === safeIndex;
                  return (
                    <div
                      key={slideItem.id || slideIdx}
                      aria-hidden={!isSlideActive}
                      className={`col-start-1 row-start-1 flex flex-col space-y-4 ${
                        isSlideActive
                          ? 'opacity-100 visible z-[2] pointer-events-auto transition-opacity duration-300 ease-out'
                          : 'opacity-0 invisible z-[1] pointer-events-none select-none transition-none'
                      }`}
                    >
                      {slideItem.name && (
                        <div className="sticky top-20 z-10 bg-white pb-3 border-b border-slate-100">
                          <h3
                            dir="auto"
                            onClick={() => onSelectProduct(slideItem)}
                            className="text-xl sm:text-2xl lg:text-[26px] font-black text-slate-900 hover:text-red-600 transition-colors cursor-pointer leading-snug"
                          >
                            {slideItem.name}
                          </h3>
                        </div>
                      )}
                      {slideItem.description && (
                        <p
                          dir="auto"
                          className="text-sm sm:text-[15.5px] text-slate-600 leading-[1.8] font-normal whitespace-pre-line"
                        >
                          {slideItem.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => onSelectProduct(activeProduct)}
                  className="learn-more"
                >
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow" />
                  </span>
                  <span className="button-text">
                    <bdi dir="auto">{t('specs_btn') || 'Inspect Specs'}</bdi>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

interface DynamicHomepageSectionsProps {
  onSelectProduct: (product: ProductItem) => void;
  onOpenQuote?: (productName: string) => void;
  onExploreCategory?: (category: string) => void;
}

export const DynamicHomepageSections: React.FC<DynamicHomepageSectionsProps> = ({
  onSelectProduct,
  onExploreCategory
}) => {
  const [sections, setSections] = useState<HomepageSectionConfig[]>(() =>
    loadHomepageSections()
  );
  const [sectionSlides, setSectionSlides] = useState<ProductItem[]>(() =>
    loadHomepageSectionItems()
  );

  useEffect(() => {
    const unsubSections = subscribeToHomepageSections(setSections);
    const unsubSlides = subscribeToHomepageSectionItems(setSectionSlides);
    return () => {
      unsubSections();
      unsubSlides();
    };
  }, []);

  return (
    <>
      {sections.map((section, idx) => {
        const sKey = (section.key || '').toLowerCase();
        const sId = (section.id || '').toLowerCase();
        let sectionItems = sectionSlides.filter((p) => {
          const pDiv = (p.division || '').toLowerCase();
          const pCat = (p.category || '').toLowerCase();
          const pSub = (p.subCategory || '').toLowerCase();
          if (pDiv === sKey || pCat === sKey || pDiv === sId || pCat === sId) return true;
          if ((sKey.includes('window') || sId.includes('window')) && (pDiv.includes('window') || pCat.includes('window'))) return true;
          if ((sKey.includes('door') || sId.includes('door')) && (pDiv.includes('door') || pCat.includes('door'))) return true;
          if ((sKey.includes('accessor') || sId.includes('accessor')) && (pDiv.includes('accessor') || pCat.includes('accessor'))) return true;
          if ((sKey.includes('1793119387374') || sKey.includes('stair') || sId.includes('stair')) && (pDiv.includes('stair') || pCat.includes('stair') || pSub.includes('stair') || pDiv.includes('1793119387374') || pCat.includes('1793119387374'))) return true;
          if ((sKey.includes('1793119430295') || sKey.includes('balcon') || sKey.includes('shorfa') || sKey.includes('railing') || sId.includes('balcon')) && (pDiv.includes('balcon') || pCat.includes('balcon') || pSub.includes('balcon') || pDiv.includes('shorfa') || pCat.includes('shorfa') || pSub.includes('shorfa') || pDiv.includes('railing') || pCat.includes('railing') || pDiv.includes('1793119430295') || pCat.includes('1793119430295'))) return true;
          const rawSecKey = sKey.replace(/^sec-/, '');
          const rawPDiv = pDiv.replace(/^sec-/, '');
          const rawPCat = pCat.replace(/^sec-/, '');
          return Boolean(rawSecKey && (rawPDiv === rawSecKey || rawPCat === rawSecKey));
        });

        // Fail-safe: if items for a section are empty, pull from HOMEPAGE_SECTION_ITEMS_SEED
        if (sectionItems.length === 0) {
          sectionItems = HOMEPAGE_SECTION_ITEMS_SEED.filter((p) => {
            const pDiv = (p.division || '').toLowerCase();
            const pCat = (p.category || '').toLowerCase();
            const pSub = (p.subCategory || '').toLowerCase();
            if (pDiv === sKey || pCat === sKey || pDiv === sId || pCat === sId) return true;
            if ((sKey.includes('window') || sId.includes('window')) && (pDiv.includes('window') || pCat.includes('window'))) return true;
            if ((sKey.includes('door') || sId.includes('door')) && (pDiv.includes('door') || pCat.includes('door'))) return true;
            if ((sKey.includes('accessor') || sId.includes('accessor')) && (pDiv.includes('accessor') || pCat.includes('accessor'))) return true;
            if ((sKey.includes('1793119387374') || sKey.includes('stair') || sId.includes('stair')) && (pDiv.includes('stair') || pCat.includes('stair') || pSub.includes('stair') || pDiv.includes('1793119387374') || pCat.includes('1793119387374'))) return true;
            if ((sKey.includes('1793119430295') || sKey.includes('balcon') || sKey.includes('shorfa') || sKey.includes('railing') || sId.includes('balcon')) && (pDiv.includes('balcon') || pCat.includes('balcon') || pSub.includes('balcon') || pDiv.includes('shorfa') || pCat.includes('shorfa') || pSub.includes('shorfa') || pDiv.includes('railing') || pCat.includes('railing') || pDiv.includes('1793119430295') || pCat.includes('1793119430295'))) return true;
            return false;
          });
        }
        return (
          <SingleDynamicSection
            key={section.id || section.key}
            section={section}
            sectionIndex={idx}
            items={sectionItems}
            onSelectProduct={onSelectProduct}
            onExploreCategory={onExploreCategory}
          />
        );
      })}
    </>
  );
};

export default DynamicHomepageSections;
