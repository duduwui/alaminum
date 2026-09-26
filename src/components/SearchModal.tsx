import React, { useState } from 'react';
import { ALL_PRODUCTS, ProductItem } from '../data/winhomeData';
import { loadLocalProducts } from '../services/productService';
import { Search, X, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const { currentLanguage, t } = useLanguage();
  const [query, setQuery] = useState('');

  const productsList = React.useMemo(() => {
    return loadLocalProducts().map(product => getLocalizedProduct(product, currentLanguage.code));
  }, [isOpen, currentLanguage.code]);

  if (!isOpen) return null;

  const results = query.trim()
    ? productsList.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(query.toLowerCase()))
      )
    : productsList.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 animate-in zoom-in-95 duration-200">
        
        {/* Search Input Header */}
        <div className="flex items-center px-5 py-4 border-b border-slate-100 bg-white">
          <Search className="w-5 h-5 text-red-600 shrink-0 mr-3.5" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search_shop_ph')}
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors ml-2"
            aria-label={t('ui_close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 divide-y divide-slate-100 scrollbar-thin scrollbar-thumb-slate-300">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2 pb-1 flex items-center justify-between">
            <span>{t('nav_products')} ({results.length})</span>
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              {t('ui_no_products')}
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(loadLocalProducts().find(source => source.id === product.id) || product);
                  onClose();
                }}
                className="pt-2.5 group flex items-center justify-between p-3 rounded-2xl hover:bg-red-50/70 cursor-pointer transition-all border border-transparent hover:border-red-200"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = product.fallbackImage;
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                        {product.category}
                      </span>
                      {product.subCategory && (
                        <span className="text-[10px] text-slate-400 font-bold truncate">
                          {product.subCategory}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-red-600 transition-colors mt-0.5 truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {product.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchModal;
