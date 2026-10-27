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
  const isVideoMedia =
    Boolean(activeProduct.videoUrl) || /\.(mp4|webm|mov)(\?|#|$)/i.test(activeProduct.image);
  const mediaSrc = activeProduct.videoUrl || activeProduct.image;
  const isAccessoryStyle = section.key === 'accessories';

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
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:h-[500px]">
            {/* Left: Media Display (Fixed aspect/height so portrait/landscape media never changes card size) */}
            <div
              className={`lg:col-span-6 relative ${
                isAccessoryStyle && !isVideoMedia ? 'bg-slate-50' : 'bg-slate-950'
              } overflow-hidden h-[300px] sm:h-[380px] lg:h-[500px] w-full shrink-0`}
            >
              {isVideoMedia ? (
                <video
                  key={mediaSrc}
                  src={mediaSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <img
                  key={activeProduct.image}
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  onError={(e) => {
                    if (
                      activeProduct.fallbackImage &&
                      e.currentTarget.src !== activeProduct.fallbackImage
                    ) {
                      e.currentTarget.src = activeProduct.fallbackImage;
                    }
                  }}
                  onClick={() => onSelectProduct(activeProduct)}
                  className={`absolute inset-0 w-full h-full ${
                    isAccessoryStyle
                      ? 'object-contain p-6 sm:p-10 drop-shadow-sm'
                      : 'object-cover'
                  } animate-in fade-in duration-500 cursor-pointer`}
                  loading="lazy"
                />
              )}

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

            {/* Right: Clean Title, Description & Action Buttons (Fixed height so card never resizes on swap) */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-[430px] sm:h-[420px] lg:h-[500px] overflow-hidden text-start">
              <div className="space-y-3 overflow-y-auto pr-1">
                {activeProduct.name && (
                  <h3
                    onClick={() => onSelectProduct(activeProduct)}
                    className="text-xl sm:text-2xl lg:text-[26px] font-black text-slate-900 hover:text-red-600 transition-colors cursor-pointer leading-snug"
                  >
                    <bdi dir="auto">{activeProduct.name}</bdi>
                  </h3>
                )}
                {activeProduct.description && (
                  <p className="text-sm sm:text-[15px] text-slate-600 mt-2 leading-relaxed font-normal whitespace-pre-line">
                    <bdi dir="auto">{activeProduct.description}</bdi>
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectProduct(activeProduct)}
                  className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    <bdi dir="auto">{t('specs_btn') || 'Inspect Specs'}</bdi>
                  </span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
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
