import React, { useState, useEffect, useRef } from 'react';
import { ProductItem } from '../data/winhomeData';
import { loadLocalProducts, subscribeToLocalProducts } from '../services/productService';
import {
  HomepageSectionConfig,
  loadHomepageSections,
  subscribeToHomepageSections,
  getLocalizedSectionHeader
} from '../services/homepageSectionsService';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoSwapRef = useRef<NodeJS.Timeout | null>(null);

  const localizedItems = items.map((p) => getLocalizedProduct(p, currentLanguage.code));
  const { title: sectionTitle, description: sectionDesc } = getLocalizedSectionHeader(
    section,
    currentLanguage.code
  );

  // Auto-swap every 8.5s with pause on hover
  useEffect(() => {
    if (isPaused || localizedItems.length <= 1) return;
    autoSwapRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % localizedItems.length);
    }, 8500);
    return () => {
      if (autoSwapRef.current) clearInterval(autoSwapRef.current);
    };
  }, [isPaused, localizedItems.length, currentIndex]);

  if (localizedItems.length === 0) return null;

  const safeIndex = currentIndex % localizedItems.length;
  const activeProduct = localizedItems[safeIndex] || localizedItems[0];
  const isAccessoryStyle = section.key === 'accessories';
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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + localizedItems.length) % localizedItems.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % localizedItems.length);
  };

  const bgClass =
    sectionIndex % 2 === 0
      ? 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
      : 'bg-white';

  return (
    <section
      id={section.key}
      className={`${bgClass} border-b border-slate-200 scroll-mt-20 py-12 sm:py-16 relative overflow-hidden`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 dh-reveal">
          <div>
            {sectionTitle && (
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                <bdi dir="auto">{sectionTitle}</bdi>
              </h2>
            )}
            {sectionDesc && (
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-1.5 max-w-2xl whitespace-pre-line">
                <bdi dir="auto">{sectionDesc}</bdi>
              </p>
            )}
          </div>
        </div>

        {/* Interactive Auto-Swapping Product Showcase Card */}
        <div
          className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Stacked Media Slides (Zero unmount/remount glitch & fixed ratio) */}
            <div
              className={`lg:col-span-6 relative ${
                isAccessoryStyle ? 'bg-slate-50' : 'bg-slate-950'
              } overflow-hidden h-[320px] sm:h-[400px] lg:h-auto lg:min-h-[500px] w-full shrink-0`}
            >
              {localizedItems.map((slideItem, slideIdx) => {
                const isSlideActive = slideIdx === safeIndex;
                const slideIsVideo =
                  Boolean(slideItem.videoUrl) ||
                  /\.(mp4|webm|mov)(\?|#|$)/i.test(slideItem.image);
                const slideMediaSrc = slideItem.videoUrl || slideItem.image;

                return (
                  <div
                    key={slideItem.id || slideIdx}
                    aria-hidden={!isSlideActive}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                      isSlideActive
                        ? 'opacity-100 z-[2] pointer-events-auto'
                        : 'opacity-0 z-[1] pointer-events-none'
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
                        preload="metadata"
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
                        loading={slideIdx === 0 ? 'eager' : 'lazy'}
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
                      onClick={() => setCurrentIndex(dotIdx)}
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

            {/* Right: Pinned/Sticky Title, Full No-Scroll Text (Grid-stacked so card height never changes on swap) & Uiverse Red Button */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-start bg-white">
              {/* Grid-stacked slides: locks height to the tallest slide in the section with zero scrollbar */}
              <div className="grid grid-cols-1 grid-rows-1">
                {localizedItems.map((slideItem, slideIdx) => {
                  const isSlideActive = slideIdx === safeIndex;
                  return (
                    <div
                      key={slideItem.id || slideIdx}
                      aria-hidden={!isSlideActive}
                      className={`col-start-1 row-start-1 flex flex-col space-y-4 transition-opacity duration-500 ease-in-out ${
                        isSlideActive
                          ? 'opacity-100 z-[2] pointer-events-auto'
                          : 'opacity-0 z-[1] pointer-events-none select-none'
                      }`}
                    >
                      {slideItem.name && (
                        <div className="sticky top-20 z-10 bg-white/95 backdrop-blur-xs pb-3 border-b border-slate-100">
                          <h3
                            onClick={() => onSelectProduct(slideItem)}
                            className="text-xl sm:text-2xl lg:text-[26px] font-black text-slate-900 hover:text-red-600 transition-colors cursor-pointer leading-snug"
                          >
                            <bdi dir="auto">{slideItem.name}</bdi>
                          </h3>
                        </div>
                      )}
                      {slideItem.description && (
                        <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                          <bdi dir="auto">{slideItem.description}</bdi>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Button (Uiverse Red Learn More Style) */}
              <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-start">
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
  const [products, setProducts] = useState<ProductItem[]>(() => loadLocalProducts());

  useEffect(() => {
    const unsubSections = subscribeToHomepageSections(setSections);
    const unsubProducts = subscribeToLocalProducts(setProducts);
    return () => {
      unsubSections();
      unsubProducts();
    };
  }, []);

  return (
    <>
      {sections.map((section, idx) => {
        const sectionItems = products.filter(
          (p) => p.division === section.key || p.category === section.key
        );
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
