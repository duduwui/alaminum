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

  // Auto-swap every 4.5s (state-only, zero window scroll)
  useEffect(() => {
    if (isPaused || localizedLines.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % localizedLines.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, localizedLines.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? localizedLines.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % localizedLines.length);
  };

  if (!activeProduct) return null;

  return (
    <section id="accessories" className="py-12 sm:py-16 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Header — NO Ugly Badges */}
        <div className="border-s-4 border-red-600 ps-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            <bdi dir="auto">{t('acc_title') || 'Architectural Hardware & Accessories'}</bdi>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-1 max-w-xl">
            <bdi dir="auto">{t('acc_desc')}</bdi>
          </p>
        </div>

        {/* Interactive Auto-Swapping Card (Mobile: Image on top with < > controls | Laptop: Side-by-Side) */}
        <div
          className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden transition-all duration-500"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Media Display: Image with slide counter and controls on the image */}
            <div className="lg:col-span-6 relative bg-slate-50 flex items-center justify-center overflow-hidden h-[280px] sm:h-[360px] lg:h-[420px] w-full p-6">
              <img
                key={activeProduct.image}
                src={activeProduct.image}
                alt={activeProduct.name}
                onError={(e) => {
                  if (activeProduct.fallbackImage && e.currentTarget.src !== activeProduct.fallbackImage) {
                    e.currentTarget.src = activeProduct.fallbackImage;
                  }
                }}
                className="max-h-full max-w-full object-contain animate-in fade-in zoom-in-95 duration-500"
                loading="lazy"
              />

              {/* Slide Counter & Prev/Next Controls on the corner of the image */}
              <div className="absolute bottom-4 end-4 flex items-center gap-2 z-10">
                <span className="text-[11px] font-bold text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                  {currentIndex + 1} / {localizedLines.length}
                </span>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous accessory"
                  className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next accessory"
                  className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>

            {/* Content: Title, Description & Action Buttons */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between h-auto lg:h-[420px] text-start">
              <div className="space-y-3 overflow-hidden">
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
                  className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
