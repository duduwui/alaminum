import React, { useState, useEffect } from 'react';
import { ProductItem } from '../data/winhomeData';
import { loadLocalProducts, subscribeToLocalProducts } from '../services/productService';
import { ChevronRight } from 'lucide-react';
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
    const win = all.filter((p) => p.division === 'windows' || p.category === 'windows');
    return win;
  });


  // Subscribe to real-time product updates from Admin Portal
  useEffect(() => {
    const unsubscribe = subscribeToLocalProducts((all) => {
      const win = all.filter((p) => p.division === 'windows' || p.category === 'windows');
      setProducts(win);
    });
    return unsubscribe;
  }, []);

  const localizedItems = products.map((p) => getLocalizedProduct(p, currentLanguage.code));

  const filteredItems = localizedItems.slice(0, 7);

  return (
    <section id="windows" className="bg-[linear-gradient(180deg,rgba(254,242,242,0.4),white_180px)] border-b border-slate-200 scroll-mt-20">
      {/* Category Banner */}
      <div className="doorhome-textured-red text-white py-9 sm:py-12 px-4 sm:px-6 lg:px-8 shadow-sm border-b border-red-900/30">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm">
            {t('win_title')}
          </h2>
          <p className="text-sm sm:text-base text-red-100 max-w-2xl mt-1.5 font-normal">
            {t('win_desc')}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-14 sm:pb-16">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-sm font-bold text-slate-600">{t('win_empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((product) => {
              const displayPrice = product.pricePerSqm ?? product.basePrice ?? product.unitPrice;
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Area (Clean - no badges on image) */}
                    <div
                      className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
                      onClick={() => onSelectProduct(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          if (product.fallbackImage && e.currentTarget.src !== product.fallbackImage) {
                            e.currentTarget.src = product.fallbackImage;
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Content Area (Clean Title & Description) */}
                    <div className="p-5">
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-base font-extrabold text-slate-900 group-hover:text-red-600 transition-colors cursor-pointer line-clamp-1"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-normal">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="p-5 pt-0">
                    {displayPrice != null && <div className="flex items-center justify-between py-3 border-t border-slate-100 mb-3">
                      <span className="text-xs font-medium text-slate-500">{t('starting_from')}</span>
                      <div className="text-right">
                        <span className="text-base font-black text-slate-900">${displayPrice}</span>
                      </div>
                    </div>}

                    <div>
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-red-400 bg-white hover:bg-red-50/60 text-slate-800 hover:text-red-600 font-extrabold text-xs transition-all shadow-2xs text-center cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>{t('specs_btn')}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {localizedItems.length > 0 && onExploreCategory && <div className="mt-8 text-center"><button type="button" onClick={() => onExploreCategory('windows')} className="rounded-xl border border-red-200 bg-white px-6 py-3 text-sm font-bold text-red-700 hover:bg-red-50">{t('view_all_windows')} <ChevronRight className="inline h-4 w-4" /></button></div>}
      </div>
    </section>
  );
};
