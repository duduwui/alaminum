import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit } from 'lucide-react';
import { ProductItem } from '../../data/winhomeData';
import { getLocalizedProduct } from '../../utils/localizedContent';

interface AdminProductsTabProps {
  productList: ProductItem[];
  allCategoryOptions: Array<{ key: string; label: string }>;
  getProductCategoryLabel: (prod: ProductItem) => string;
  onOpenAddProduct: () => void;
  onOpenEditProduct: (prod: ProductItem) => void;
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
  onDeleteProduct,
  onClearCatalog,
  currentLanguage,
  t
}) => {
  const [productSearchQuery, setProductSearchQuery] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

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
    <main className="p-6 space-y-6 flex-1 overflow-y-auto">
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
                : 'All Website Sections'}
            </option>
            {allCategoryOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
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
                return (
                  <tr key={prod.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <a
                          href={prod.image || prod.fallbackImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 group"
                        >
                          <img
                            src={prod.image || prod.fallbackImage}
                            alt={localized.name}
                            loading="lazy"
                            className="h-20 w-28 rounded-xl object-cover border border-slate-200/80 shadow-2xs group-hover:scale-102 transition-transform"
                          />
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
