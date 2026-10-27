import React, { useState, useEffect } from 'react';
import { ACCESSORIES_LINES, ProductItem } from '../data/winhomeData';
import { loadLocalProducts, subscribeToLocalProducts } from '../services/productService';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';

interface AccessoriesSectionProps {
  onSelectProduct: (product: ProductItem) => void;
  onOpenQuote?: (productName: string) => void;
}

export const AccessoriesSection: React.FC<AccessoriesSectionProps> = ({ onSelectProduct, onOpenQuote }) => {
  const { currentLanguage, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [products, setProducts] = useState<ProductItem[]>(() => {
    const all = loadLocalProducts();
    const acc = all.filter((p) => p.category === 'accessories' || p.division === 'accessories');
    return acc.length > 0 ? acc : ACCESSORIES_LINES;
  });

  useEffect(() => {
    const unsubscribe = subscribeToLocalProducts((all) => {
      const acc = all.filter((p) => p.category === 'accessories' || p.division === 'accessories');
      if (acc.length > 0) {
        setProducts(acc);
      }
    });
    return unsubscribe;
  }, []);

  const localizedLines = products.map((line) => getLocalizedProduct(line, currentLanguage.code));
  const activeProduct = localizedLines[currentIndex] || localizedLines[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + localizedLines.length) % localizedLines.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % localizedLines.length);
  };

  // Auto-swap every 4.5s with pause on hover
  useEffect(() => {
    if (isPaused || localizedLines.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % localizedLines.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, localizedLines.length]);

  if (!activeProduct) return null;

  return (
    <section id="accessories" className="py-12 sm:py-16 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Header — NO Ugly Vertical Lines, NO Badges */}
        <div className="mb-6 sm:mb-8 dh-reveal">
          <div className="w-10 h-1 bg-gradient-to-r from-red-600 to-red-400 rounded-full mb-3" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            <bdi dir="auto">{t('acc_title') || 'Architectural Hardware & Accessories'}</bdi>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-1 max-w-xl">
            <bdi dir="auto">{t('acc_desc')}</bdi>
          </p>
        </div>

        {/* Interactive Auto-Swapping Card with Full Pagination */}
        <div
          className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden transition-all duration-500"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Media Display: Image with slide counter and prev/next pagination */}
            <div className="lg:col-span-6 relative bg-slate-50 flex items-center justify-center overflow-hidden h-[300px] sm:h-[380px] lg:h-[440px] w-full p-6 sm:p-10">
              <img
                key={activeProduct.image}
                src={activeProduct.image}
                alt={activeProduct.name}
                onError={(e) => {
                  if (activeProduct.fallbackImage && e.currentTarget.src !== activeProduct.fallbackImage) {
                    e.currentTarget.src = activeProduct.fallbackImage;
                  }
                }}
                className="max-h-full max-w-full object-contain animate-in fade-in zoom-in-95 duration-500 drop-shadow-sm cursor-pointer"
                onClick={() => onSelectProduct(activeProduct)}
                loading="lazy"
              />

              {/* Slide Counter, 5 Interactive Dots & Prev/Next Pagination Controls */}
              <div className="absolute bottom-4 end-4 flex items-center gap-2 z-10">
                <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/10">
                  {localizedLines.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentIndex(dotIdx)}
                      aria-label={`Go to item ${dotIdx + 1}`}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        dotIdx === currentIndex
                          ? 'w-5 h-2 bg-red-500'
                          : 'w-2 h-2 bg-white/50 hover:bg-white'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-mono font-bold text-white/90 ms-1 px-1">
                    {currentIndex + 1} / {localizedLines.length}
                  </span>
                </div>

                {/* Prev / Next Pagination Buttons */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous accessory"
                  className="w-8 h-8 rounded-full bg-slate-900/85 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next accessory"
                  className="w-8 h-8 rounded-full bg-slate-900/85 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>

            {/* Content: Title, Description, Item Switcher & Action Buttons */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-auto lg:h-[440px] text-start">
              <div className="space-y-4 overflow-hidden">
                <h3
                  onClick={() => onSelectProduct(activeProduct)}
                  className="text-2xl sm:text-3xl font-black text-slate-900 hover:text-red-600 transition-colors cursor-pointer leading-tight line-clamp-2"
                >
                  <bdi dir="auto">{activeProduct.name}</bdi>
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal line-clamp-3 sm:line-clamp-4">
                  <bdi dir="auto">{activeProduct.description}</bdi>
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 mt-4 lg:mt-0">
                <button
                  type="button"
                  onClick={() => onSelectProduct(activeProduct)}
                  className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg active:scale-98"
                >
                  <span><bdi dir="auto">{t('specs_btn') || 'Inspect Specs'}</bdi></span>
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

export default AccessoriesSection;
