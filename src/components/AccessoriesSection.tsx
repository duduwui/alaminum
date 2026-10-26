import React, { useState, useEffect, useRef } from 'react';
import { ACCESSORIES_LINES, ProductItem } from '../data/winhomeData';
import { loadLocalProducts, subscribeToLocalProducts } from '../services/productService';
import { ChevronRight, ChevronLeft, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';

interface AccessoriesSectionProps {
  onSelectProduct: (product: ProductItem) => void;
  onOpenQuote: (productName: string) => void;
}

export const AccessoriesSection: React.FC<AccessoriesSectionProps> = ({ onSelectProduct, onOpenQuote }) => {
  const { currentLanguage, t } = useLanguage();
  const sliderRef = useRef<HTMLDivElement | null>(null);
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

  const scrollToCard = (index: number) => {
    if (!sliderRef.current) return;
    const cards = sliderRef.current.querySelectorAll('.accessory-card-item');
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  };

  // Auto-swap every 3.5s
  useEffect(() => {
    if (isPaused || localizedLines.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % localizedLines.length;
        scrollToCard(next);
        return next;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, localizedLines.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const next = prev <= 0 ? localizedLines.length - 1 : prev - 1;
      scrollToCard(next);
      return next;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % localizedLines.length;
      scrollToCard(next);
      return next;
    });
  };

  return (
    <section id="accessories" className="py-12 sm:py-16 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sleek Header with Navigation Arrows (Red Banner Hidden) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 border-s-4 border-red-600 ps-3.5 sm:ps-4">
          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <bdi dir="auto">{t('acc_badge') || 'EUROPEAN HARDWARE & ACCESSORIES'}</bdi>
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              <bdi dir="auto">{t('acc_title') || 'Architectural Hardware & Accessories'}</bdi>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-1 max-w-xl">
              <bdi dir="auto">{t('acc_desc')}</bdi>
            </p>
          </div>

          {/* Navigation Controls: Arrows */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous accessory"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 hover:text-red-600 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next accessory"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 hover:text-red-600 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Auto-Swapping Card Carousel Track */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            ref={sliderRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-1"
          >
            {localizedLines.map((line) => (
              <div
                key={line.id}
                className="accessory-card-item snap-start shrink-0 w-[84vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] bg-white rounded-2xl border border-slate-200 hover:border-red-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
                onClick={() => onSelectProduct(line)}
              >
                <div>
                  {/* Photo Stage */}
                  <div className="relative aspect-[4/3] bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                    <img
                      src={line.image}
                      alt={line.name}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== line.fallbackImage) {
                          target.src = line.fallbackImage;
                        }
                      }}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 start-2.5 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      <bdi dir="auto">{line.subCategory}</bdi>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3.5 sm:p-4 space-y-1.5">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-1">
                      <bdi dir="auto">{line.name}</bdi>
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      <bdi dir="auto">{line.description}</bdi>
                    </p>

                    <ul className="space-y-1 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                      {line.features.slice(0, 2).map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="px-3.5 pb-3.5 pt-1">
                  <div className="w-full py-2 px-3 rounded-xl bg-slate-50 group-hover:bg-red-600 text-slate-800 group-hover:text-white font-bold text-xs flex items-center justify-between transition-colors">
                    <span>{t('specs_btn') || 'المواصفات والتفاصيل'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {localizedLines.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setCurrentIndex(i);
                scrollToCard(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIndex === i ? 'w-6 bg-red-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default AccessoriesSection;
