import React, { useState } from 'react';
import { ALUMINUM_PRODUCTS, ProductItem } from '../data/winhomeData';
import { Search, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { GlowButton } from './GlowButton';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';

interface AluminumSectionProps {
  onSelectProduct: (product: ProductItem) => void;
  onOpenQuote: (productName: string) => void;
}

export const AluminumSection: React.FC<AluminumSectionProps> = ({ onSelectProduct, onOpenQuote }) => {
  const { currentLanguage, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: t('tab_all_systems') },
    { id: 'Casement Windows', label: t('tab_casement_openings') },
    { id: 'Thermally Broken Casement', label: t('tab_thermal_break') },
    { id: 'Monumental Panoramic Doors', label: t('tab_lift_slide') },
    { id: 'Commercial Façades', label: t('tab_curtain_wall') },
    { id: 'Glass Roofs & Atriums', label: t('tab_sky_light') },
    { id: 'Concertina Bi-Fold Doors', label: t('tab_folding') },
    { id: 'Interior Architecture', label: t('tab_office_part') }
  ];

  const localizedItems = ALUMINUM_PRODUCTS.map((p) => getLocalizedProduct(p, currentLanguage.code));

  const filteredItems = localizedItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.subCategory === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section id="aluminum" className="bg-white border-b border-slate-200">
      {/* Category Banner */}
      <div className="doorhome-textured-red text-white py-9 sm:py-12 px-4 sm:px-6 lg:px-8 shadow-sm border-b border-red-900/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-red-200 mb-1">
              {t('al_badge')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('al_title')}
            </h2>
            <p className="text-sm sm:text-base text-red-100 max-w-2xl mt-1.5 font-normal">
              {t('al_desc')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full font-semibold">
              {filteredItems.length} {t('al_available')}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <GlowButton
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                variant={selectedCategory === cat.id ? 'active' : 'secondary'}
                size="sm"
                className="whitespace-nowrap shrink-0"
              >
                {cat.label}
              </GlowButton>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('search_al')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-red-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Product Image Stage */}
                <div className="relative aspect-[16/10] bg-slate-50 p-6 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== product.fallbackImage) {
                        target.src = product.fallbackImage;
                      }
                    }}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.depth && (
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded bg-white/90 text-slate-800 text-[11px] font-bold shadow-xs border border-slate-200">
                      {product.depth}
                    </span>
                  )}
                  {product.subCategory && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-red-50 text-red-800 text-[10px] font-bold uppercase tracking-wider border border-red-100">
                      {product.subCategory.split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Key Specifications Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    {product.insulationValue && (
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="text-[10px] text-slate-500 block">{t('insulation_label')}</span>
                        <span className="font-semibold text-slate-800">{product.insulationValue}</span>
                      </div>
                    )}
                    {product.depth && (
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="text-[10px] text-slate-500 block">{t('depth_label')}</span>
                        <span className="font-semibold text-slate-800">{product.depth}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 pb-5 pt-2">
                <GlowButton
                  onClick={() => onSelectProduct(product)}
                  variant="primary"
                  size="sm"
                  className="w-full"
                >
                  <span>{t('specs_btn')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </GlowButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
