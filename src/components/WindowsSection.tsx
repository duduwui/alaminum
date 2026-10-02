import React, { useState, useEffect, useRef } from 'react';
import { ProductItem } from '../data/winhomeData';
import { loadLocalProducts, subscribeToLocalProducts } from '../services/productService';
import { ChevronRight, ChevronLeft, Play, Shield, Wind, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';

interface WindowsSectionProps {
  onSelectProduct: (product: ProductItem) => void;
  onOpenQuote: (productName: string) => void;
  onExploreCategory?: (category: string) => void;
}

export const WindowsSection: React.FC<WindowsSectionProps> = ({
  onSelectProduct,
  onOpenQuote,
  onExploreCategory
}) => {
  const { currentLanguage, t } = useLanguage();
  const [products, setProducts] = useState<ProductItem[]>(() => {
    const all = loadLocalProducts();
    return all.filter((p) => p.division === 'windows' || p.category === 'windows');
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoSwapRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to real-time product updates from Admin Portal
  useEffect(() => {
    const unsubscribe = subscribeToLocalProducts((all) => {
      const win = all.filter((p) => p.division === 'windows' || p.category === 'windows');
      setProducts(win);
    });
    return unsubscribe;
  }, []);

  const localizedItems = products.map((p) => getLocalizedProduct(p, currentLanguage.code));

  // Auto-swap to next product example every 4.5 seconds
  useEffect(() => {
    if (isPaused || localizedItems.length <= 1) return;
    autoSwapRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % localizedItems.length);
    }, 4500);
    return () => {
      if (autoSwapRef.current) clearInterval(autoSwapRef.current);
    };
  }, [isPaused, localizedItems.length, currentIndex]);

  if (localizedItems.length === 0) return null;

  const activeProduct = localizedItems[currentIndex % localizedItems.length] || localizedItems[0];
  const displayPrice = activeProduct.pricePerSqm ?? activeProduct.basePrice ?? activeProduct.unitPrice;
  const isVideoMedia = Boolean(activeProduct.videoUrl) || /\.(mp4|webm|mov)(\?|#|$)/i.test(activeProduct.image);
  const mediaSrc = activeProduct.videoUrl || activeProduct.image;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + localizedItems.length) % localizedItems.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % localizedItems.length);
  };

  return (
    <section id="windows" className="bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200 scroll-mt-20 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 dh-reveal">
          <div className="border-s-4 border-red-600 ps-4">
            <span className="text-xs font-black uppercase tracking-wider text-red-600 block mb-1">
              <bdi dir="auto">{t('win_badge') || 'ARCHITECTURAL WINDOWS'}</bdi>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              <bdi dir="auto">{t('win_title')}</bdi>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              <bdi dir="auto">{t('win_desc')}</bdi>
            </p>
          </div>

          {onExploreCategory && (
            <button
              type="button"
              onClick={() => onExploreCategory('windows')}
              className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-700 text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
            >
              <span><bdi dir="auto">{t('view_all_windows') || 'All Windows'}</bdi></span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Interactive Auto-Swapping Product Showcase Card */}
        <div
          className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden transition-all duration-500"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[420px] sm:min-h-[460px]">
            {/* Left: Media Display (Video or Photo with Auto-Swap) */}
            <div className="lg:col-span-6 relative bg-slate-950 flex items-center justify-center overflow-hidden min-h-[280px] sm:min-h-[360px] lg:min-h-full">
              {isVideoMedia ? (
                <video
                  key={mediaSrc}
                  src={mediaSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover max-h-[480px]"
                />
              ) : (
                <img
                  key={activeProduct.image}
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  onError={(e) => {
                    if (activeProduct.fallbackImage && e.currentTarget.src !== activeProduct.fallbackImage) {
                      e.currentTarget.src = activeProduct.fallbackImage;
                    }
                  }}
                  className="w-full h-full object-cover max-h-[480px] animate-in fade-in zoom-in-95 duration-500"
                  loading="lazy"
                />
              )}

              {/* Slide Counter & Prev/Next Overlay Controls */}
              <div className="absolute bottom-4 end-4 flex items-center gap-2">
                <span className="text-[11px] font-bold text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                  {currentIndex + 1} / {localizedItems.length}
                </span>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous window system"
                  className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next window system"
                  className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Clean Title & Description */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-start">
              <div className="space-y-3">
                {/* Title */}
                <h3
                  onClick={() => onSelectProduct(activeProduct)}
                  className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 hover:text-red-600 transition-colors cursor-pointer leading-tight"
                >
                  <bdi dir="auto">{activeProduct.name}</bdi>
                </h3>
                {/* Description */}
                <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-normal">
                  <bdi dir="auto">{activeProduct.description}</bdi>
                </p>
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">{t('starting_from')}</span>
                  {displayPrice != null && (
                    <span className="text-xl sm:text-2xl font-black text-slate-900">
                      {activeProduct.currency === 'IQD' ? `${displayPrice.toLocaleString()} IQD` : `$${displayPrice.toLocaleString()}`}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(activeProduct)}
                    className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span><bdi dir="auto">{t('specs_btn') || 'Inspect Specs'}</bdi></span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenQuote(activeProduct.name)}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:border-red-400 hover:bg-red-50 text-slate-800 hover:text-red-700 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span><bdi dir="auto">{t('quote_btn') || 'Get Quote'}</bdi></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Thumbnails Selector Strip */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 ps-2">
              {currentLanguage.code === 'ar' ? 'نماذج النوافذ:' : currentLanguage.code === 'ckb' ? 'نموونەی پەنجەرەکان:' : 'Window Systems:'}
            </span>
            {localizedItems.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  currentIndex === idx
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-70" />
                <span className="truncate max-w-[140px]"><bdi dir="auto">{item.name}</bdi></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WindowsSection;
