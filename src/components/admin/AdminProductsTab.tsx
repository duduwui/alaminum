import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit, Play, Layers } from 'lucide-react';
import { ProductItem } from '../../data/winhomeData';
import { getLocalizedProduct } from '../../utils/localizedContent';

interface AdminProductsTabProps {
  productList: ProductItem[];
  allCategoryOptions: Array<{ key: string; label: string }>;
  getProductCategoryLabel: (prod: ProductItem) => string;
  onOpenAddProduct: () => void;
  onOpenEditProduct: (prod: ProductItem) => void;
  onOpenManageCategories?: () => void;
  onDeleteProduct: (id: string) => void;
  onClearCatalog: () => void;
  currentLanguage: { code: string; name: string };
  t: (key: string) => string;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  productList,
  allCategoryOptions,
  getProductCategoryLabel,
  onOpenAddProduct,
  onOpenEditProduct,
  onOpenManageCategories,
  onDeleteProduct,
  onClearCatalog,
  currentLanguage,
  t
}) => {
  const [productSearchQuery, setProductSearchQuery] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Compute total counts per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: productList.length };
    for (const opt of allCategoryOptions) {
      counts[opt.key] = 0;
    }
    for (const p of productList) {
      const key = (p.division || p.category || '').toLowerCase();
      if (key === 'balconies' || key.includes('1793119430295')) {
        counts['shorfa'] = (counts['shorfa'] || 0) + 1;
      } else if (key === 'stair' || key.includes('1793119387374')) {
        counts['stairs'] = (counts['stairs'] || 0) + 1;
      } else if (counts[key] !== undefined) {
        counts[key] += 1;
      } else {
        const matched = allCategoryOptions.find((o) => o.key === key);
        if (matched) counts[matched.key] = (counts[matched.key] || 0) + 1;
      }
    }
    return counts;
  }, [productList, allCategoryOptions]);

  const filteredProducts = productList.filter((prod) => {
    const q = productSearchQuery.trim().toLowerCase();
    const loc = getLocalizedProduct(prod, currentLanguage.code);
    const matchesSearch =
      !q ||
      loc.name.toLowerCase().includes(q) ||
      loc.description.toLowerCase().includes(q) ||
      (prod.name && prod.name.toLowerCase().includes(q)) ||
      (prod.description && prod.description.toLowerCase().includes(q));

    const matchesCategory =
      productCategoryFilter === 'all' ||
      prod.division === productCategoryFilter ||
      prod.category === productCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="p-3 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
      {/* Category Totals Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <button
          type="button"
          onClick={() => setProductCategoryFilter('all')}
          className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
            productCategoryFilter === 'all'
              ? 'bg-red-50/80 border-red-300 ring-2 ring-red-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 block truncate">
            {currentLanguage.code === 'ar' ? 'جميع المنتجات' : currentLanguage.code === 'ckb' ? 'هەموو بەرهەمەکان' : 'All Products'}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-slate-900 block">
              {productList.length}
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {currentLanguage.code === 'ar' ? 'إجمالي' : currentLanguage.code === 'ckb' ? 'کۆی گشتی' : 'total'}
            </span>
          </div>
        </button>

        {allCategoryOptions.map((opt) => {
          const count = categoryCounts[opt.key] || 0;
          const isSelected = productCategoryFilter === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setProductCategoryFilter(opt.key)}
              className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                isSelected
                  ? 'bg-red-50/80 border-red-300 ring-2 ring-red-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <span className="text-[11px] font-bold text-slate-500 block truncate" title={opt.label}>
                {opt.label}
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className={`text-xl font-black ${isSelected ? 'text-red-600' : 'text-slate-900'}`}>
                  {count}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {currentLanguage.code === 'ar' ? 'منتج' : currentLanguage.code === 'ckb' ? 'بەرهەم' : 'items'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Bar & Filters */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={productSearchQuery}
              onChange={(e) => setProductSearchQuery(e.target.value)}
              placeholder={t('admin_search_products_ph')}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs"
            />
          </div>

          <select
            value={productCategoryFilter}
            onChange={(e) => setProductCategoryFilter(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 font-semibold text-slate-700 cursor-pointer shadow-2xs"
          >
            <option value="all">
              {currentLanguage.code === 'ar'
                ? 'جميع أقسام الموقع'
                : currentLanguage.code === 'ckb'
                ? 'هەموو بەشەکانی ماڵپەڕ'
                : 'All Website Sections'} ({productList.length})
            </option>
            {allCategoryOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label} ({categoryCounts[opt.key] || 0})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onOpenManageCategories && (
            <button
              type="button"
              onClick={onOpenManageCategories}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>{currentLanguage.code === 'ar' ? 'إدارة الأقسام' : currentLanguage.code === 'ckb' ? 'بەڕێوەبردنی بەشەکان' : 'Manage Categories'}</span>
            </button>
          )}

          {productList.length > 0 && (
            <button
              type="button"
              onClick={onClearCatalog}
              className="px-3 py-2 rounded-lg bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-700 font-medium text-xs border border-slate-200 hover:border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('admin_btn_clear_catalog')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAddProduct}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('admin_btn_add_product')}</span>
          </button>
        </div>
      </div>

      {/* Product List Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm border-collapse text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 text-left">{t('admin_col_name')}</th>
                <th className="px-6 py-3.5 text-left">{t('admin_col_category')}</th>
                <th className="px-6 py-3.5 text-right">{t('admin_col_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => {
                const localized = getLocalizedProduct(prod, currentLanguage.code);
                const category = getProductCategoryLabel(prod);
                const isVid = /\.(mp4|webm|mov)(\?|#|$)/i.test(prod.videoUrl || '') || /\.(mp4|webm|mov)(\?|#|$)/i.test(prod.image || '') || /\.(mp4|webm|mov)(\?|#|$)/i.test(prod.fallbackImage || '');
                const videoSrc = (isVid && prod.videoUrl) ? prod.videoUrl : (prod.image || prod.fallbackImage);
                const posterUrl = isVid
                  ? (prod.fallbackImage && !/\.(mp4|webm|mov)(\?|#|$)/i.test(prod.fallbackImage)
                      ? prod.fallbackImage
                      : (prod.image && !/\.(mp4|webm|mov)(\?|#|$)/i.test(prod.image)
                          ? prod.image
                          : videoSrc?.replace(/\.(mp4|webm|mov)(\?|#|$)/i, '.poster.jpg$1')))
                  : (prod.image || prod.fallbackImage);

                return (
                  <tr key={prod.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <a
                          href={prod.image || prod.fallbackImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 group relative block h-20 w-28 rounded-xl overflow-hidden border border-slate-200/80 shadow-2xs group-hover:scale-102 transition-transform bg-slate-900"
                        >
                          {isVid ? (
                            <>
                              <img
                                src={posterUrl}
                                alt={localized.name}
                                loading="lazy"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const vid = e.currentTarget.parentElement?.querySelector('video');
                                  if (vid) vid.classList.remove('hidden');
                                }}
                              />
                              <video
                                src={videoSrc}
                                muted
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-cover hidden pointer-events-none"
                              />
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>{currentLanguage.code === 'ar' ? 'فيديو' : currentLanguage.code === 'ckb' ? 'ڤیدیۆ' : 'Video'}</span>
                              </span>
                            </>
                          ) : (
                            <img
                              src={prod.image || prod.fallbackImage}
                              alt={localized.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                if (prod.fallbackImage && e.currentTarget.src !== prod.fallbackImage) {
                                  e.currentTarget.src = prod.fallbackImage;
                                }
                              }}
                            />
                          )}
                        </a>
                        <button
                          type="button"
                          onClick={() => onOpenEditProduct(prod)}
                          className="text-left group cursor-pointer"
                        >
                          <span className="block text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                            {localized.name}
                          </span>
                          <span className="mt-1 block max-w-lg text-xs leading-relaxed text-slate-500 line-clamp-2">
                            {localized.description}
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                        {category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenEditProduct(prod)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t('admin_modal_edit_product')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(prod.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
