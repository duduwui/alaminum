import React, { useState } from 'react';
import { ACCESSORIES_LINES, ProductItem } from '../data/winhomeData';
import { ChevronRight, Search } from 'lucide-react';
import { GlowButton } from './GlowButton';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';

interface AccessoriesSectionProps {
  onSelectProduct: (product: ProductItem) => void;
  onOpenQuote: (productName: string) => void;
}

export const AccessoriesSection: React.FC<AccessoriesSectionProps> = ({ onSelectProduct, onOpenQuote }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentLanguage, t } = useLanguage();

  const localizedLines = ACCESSORIES_LINES.map(line => getLocalizedProduct(line, currentLanguage.code));
  const filteredLines = localizedLines.filter(
    (line) =>
      line.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      line.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="accessories" className="bg-white border-b border-slate-200">
      {/* Category Banner as shown in user's image reference */}
      <div className="doorhome-textured-red text-white py-9 sm:py-12 px-4 sm:px-6 lg:px-8 shadow-sm border-b border-red-900/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-red-200 mb-1">
              {t('acc_badge')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('acc_title')}
            </h2>
            <p className="text-sm sm:text-base text-red-100 max-w-2xl mt-1.5 font-normal">
              {t('acc_desc')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full font-semibold">
              {ACCESSORIES_LINES.length} {t('acc_count')}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="text-sm font-semibold text-slate-700">
            {t('acc_tested')}
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('search_acc')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-600 transition-all"
            />
          </div>
        </div>

        {/* Accessories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLines.map((line) => (
            <div
              key={line.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-red-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
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
                  <div className="absolute top-3 left-3 bg-white/95 text-slate-800 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {line.subCategory}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                    {line.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {line.description}
                  </p>

                  <ul className="space-y-1 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                    {line.features.slice(0, 2).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 pb-4 pt-1">
                <GlowButton
                  onClick={() => onSelectProduct(line)}
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
