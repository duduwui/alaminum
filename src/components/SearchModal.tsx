import React, { useState } from 'react';
import { ALL_PRODUCTS, ProductItem } from '../data/winhomeData';
import { Search, X, ChevronRight, Layers } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? ALL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(query.toLowerCase()))
      )
    : ALL_PRODUCTS.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-white">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search windows, doors, profiles, curtain walls, hardware..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors ml-2"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 divide-y divide-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Profile Series'}
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No products found matching &ldquo;{query}&rdquo;. Try searching for &ldquo;Deceuninck&rdquo;, &ldquo;Lorenzoline&rdquo;, or &ldquo;Sliding&rdquo;.
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="pt-2 group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 p-1 flex items-center justify-center shrink-0 border border-slate-200">
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        {product.category}
                      </span>
                      {product.subCategory && (
                        <span className="text-[10px] text-slate-400 truncate">
                          {product.subCategory}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors mt-0.5 truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {product.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
              </div>
            ))
          )}
        </div>

        {/* Search Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Click any product to view full technical specifications</span>
          <span className="text-slate-400 font-mono">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
