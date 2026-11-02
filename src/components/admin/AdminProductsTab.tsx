import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit, Play, Layers, Package, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { ProductItem } from '../../data/winhomeData';
import { getLocalizedProduct } from '../../utils/localizedContent';
import { AdminCategoryItem, createCategoryFromArabic } from '../../services/adminCategoryService';

interface AdminProductsTabProps {
  productList: ProductItem[];
  allCategoryOptions: Array<{ key: string; label: string }>;
  categories: AdminCategoryItem[];
  onSaveCategories: (updated: AdminCategoryItem[]) => void;
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
  categories,
  onSaveCategories,
  getProductCategoryLabel,
  onOpenAddProduct,
  onOpenEditProduct,
  onDeleteProduct,
  onClearCatalog,
  currentLanguage,
  t
}) => {
  // Main view switch: 'products' table vs 'categories' inline management
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'categories'>('products');

  // Products filtering state
  const [productSearchQuery, setProductSearchQuery] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Category creation state: ONLY 1 INPUT (Arabic Name)
  const [newArabicName, setNewArabicName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryFeedback, setCategoryFeedback] = useState<string>('');
  const [categoryError, setCategoryError] = useState<string>('');

  // Category editing state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editNameAr, setEditNameAr] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [editNameCkb, setEditNameCkb] = useState('');

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

  // Handle single-input category creation
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAr = newArabicName.trim();
    if (!cleanAr) {
      setCategoryError(currentLanguage.code === 'ar' ? 'يرجى كتابة اسم القسم بالعربية' : 'Please enter the Arabic category name');
      return;
    }

    try {
      setIsCreatingCategory(true);
      setCategoryError('');
      const created = await createCategoryFromArabic(cleanAr);
      onSaveCategories([...categories.filter((c) => c.key !== created.key), created]);
      setNewArabicName('');
      setCategoryFeedback(
        currentLanguage.code === 'ar'
          ? `✓ تم إنشاء قسم "${created.nameAr}" وترجمته بنجاح!`
          : `✓ Category "${created.nameEn}" created and localized successfully!`
      );
      setTimeout(() => setCategoryFeedback(''), 4000);
    } catch (err: any) {
      setCategoryError(err?.message || 'Failed to create category');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Start editing a category row
  const startEditCategory = (cat: AdminCategoryItem) => {
    setEditingCatId(cat.id);
    setEditNameAr(cat.nameAr);
    setEditNameEn(cat.nameEn);
    setEditNameCkb(cat.nameCkb);
  };

  // Save edited category
  const saveEditedCategory = (catId: string) => {
    const updated = categories.map((c) => {
      if (c.id === catId) {
        return {
          ...c,
          nameAr: editNameAr.trim() || c.nameAr,
          nameEn: editNameEn.trim() || c.nameEn,
          nameCkb: editNameCkb.trim() || c.nameCkb
        };
      }
      return c;
    });
    onSaveCategories(updated);
    setEditingCatId(null);
    setCategoryFeedback(currentLanguage.code === 'ar' ? '✓ تم حفظ تعديل القسم' : '✓ Category updated successfully');
    setTimeout(() => setCategoryFeedback(''), 3000);
  };

  // Delete category
  const handleDeleteCategory = (cat: AdminCategoryItem) => {
    const count = categoryCounts[cat.key] || 0;
    const confirmPrompt =
      currentLanguage.code === 'ar'
        ? `هل أنت متأكد من حذف قسم "${cat.nameAr}"؟${count > 0 ? ` يحتوي هذا القسم على ${count} منتجات حالياً.` : ''}`
        : `Are you sure you want to delete category "${cat.nameEn}"?${count > 0 ? ` It currently contains ${count} items.` : ''}`;

    if (!window.confirm(confirmPrompt)) return;
    const updated = categories.filter((c) => c.id !== cat.id);
    onSaveCategories(updated);
  };

  return (
    <main className="p-3 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
      {/* Top Segmented Switch: Products vs Categories */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('products')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'products'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              {currentLanguage.code === 'ar' ? 'المنتجات' : currentLanguage.code === 'ckb' ? 'بەرهەمەکان' : 'Products'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
              {productList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('categories')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'categories'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              {currentLanguage.code === 'ar' ? 'الأقسام والتصنيفات' : currentLanguage.code === 'ckb' ? 'بەش و پۆلەکان' : 'Categories & Divisions'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
              {categories.length}
            </span>
          </button>
        </div>

        {/* Quick action button depending on subTab */}
        {activeSubTab === 'products' ? (
          <button
            type="button"
            onClick={onOpenAddProduct}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('admin_btn_add_product')}</span>
          </button>
        ) : (
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            {currentLanguage.code === 'ar' ? 'الأقسام مرتبطة تلقائياً بالمنتجات والمشاريع' : 'Categories sync automatically with products & projects'}
          </span>
        )}
      </div>

      {/* VIEW 1: PRODUCTS TAB */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
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
                    const isVid =
                      /\.(mp4|webm|mov)(\?|#|$)/i.test(prod.videoUrl || '') ||
                      /\.(mp4|webm|mov)(\?|#|$)/i.test(prod.image || '') ||
                      /\.(mp4|webm|mov)(\?|#|$)/i.test(prod.fallbackImage || '');
                    const videoSrc = (isVid && prod.videoUrl) ? prod.videoUrl : (prod.image || prod.fallbackImage);

                    return (
                      <tr key={prod.id} className="hover:bg-red-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <a
                              href={videoSrc || prod.image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 group relative block h-20 w-28 rounded-xl overflow-hidden border border-slate-200/80 shadow-2xs group-hover:scale-102 transition-transform bg-slate-900"
                            >
                              {isVid ? (
                                <>
                                  <video
                                    src={videoSrc}
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                    className="h-full w-full object-cover"
                                  />
                                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                    <Play className="w-2.5 h-2.5 fill-current" />
                                    <span>
                                      {currentLanguage.code === 'ar' ? 'فيديو' : currentLanguage.code === 'ckb' ? 'ڤیدیۆ' : 'Video'}
                                    </span>
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
        </div>
      )}

      {/* VIEW 2: CATEGORIES & DIVISIONS INLINE MANAGEMENT */}
      {activeSubTab === 'categories' && (
        <div className="space-y-5">
          {/* Create Category Banner with ONLY 1 ARABIC INPUT */}
          <div className="bg-white p-5 rounded-3xl border-2 border-red-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {currentLanguage.code === 'ar' ? 'إضافة قسم جديد (حقل واحد فقط)' : 'Create New Category (Single Arabic Input)'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {currentLanguage.code === 'ar'
                      ? 'اكتب اسم القسم بالعربية فقط وسيتم إنشاء المعرف وترجمته تلقائياً للإنجليزية والكردية وربطه بالمشاريع'
                      : 'Type Arabic category name only. Slug and English/Kurdish translations are generated automatically.'}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateCategory} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newArabicName}
                  onChange={(e) => {
                    setNewArabicName(e.target.value);
                    setCategoryError('');
                  }}
                  placeholder={currentLanguage.code === 'ar' ? 'اسم القسم بالعربية (مثال: الواجهات والكرتن وول، قواطع المكاتب الزجاجية...)' : 'Arabic Category Name (e.g. الواجهات والكرتن وول)'}
                  dir="rtl"
                  disabled={isCreatingCategory}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-bold text-slate-900 placeholder:text-slate-400 bg-slate-50/50 shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingCategory || !newArabicName.trim()}
                className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                {isCreatingCategory ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{currentLanguage.code === 'ar' ? 'جاري الإنشاء والترجمة...' : 'Creating & Translating...'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>{currentLanguage.code === 'ar' ? 'إضافة وتطبيق القسم' : 'Add & Apply Category'}</span>
                  </>
                )}
              </button>
            </form>

            {categoryError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{categoryError}</span>
              </div>
            )}

            {categoryFeedback && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{categoryFeedback}</span>
              </div>
            )}
          </div>

          {/* Existing Categories Table / Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  {currentLanguage.code === 'ar' ? 'أقسام وتصنيفات المنتجات المعمارية' : 'Architectural Product Categories'}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {currentLanguage.code === 'ar'
                    ? 'يمكنك ربط أي صورة أو فيديو في صفحة المشاريع بأحد هذه الأقسام لتظهر في الفلاتر'
                    : 'Assign any project image or video to these categories for dynamic filtering.'}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
                {categories.length} {currentLanguage.code === 'ar' ? 'أقسام نشطة' : 'Active Divisions'}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {categories.map((cat) => {
                const count = categoryCounts[cat.key] || 0;
                const isEditing = editingCatId === cat.id;

                return (
                  <div key={cat.id} className="p-5 hover:bg-slate-50/70 transition-colors">
                    {isEditing ? (
                      /* Inline Category Editor */
                      <div className="space-y-3 bg-red-50/40 p-4 rounded-2xl border border-red-200/80">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-700">
                            {currentLanguage.code === 'ar' ? `تعديل قسم: ${cat.nameAr}` : `Edit Category: ${cat.nameEn}`} ({cat.key})
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingCatId(null)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">الاسم بالعربية</label>
                            <input
                              type="text"
                              value={editNameAr}
                              onChange={(e) => setEditNameAr(e.target.value)}
                              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-900"
                              dir="rtl"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">English Name</label>
                            <input
                              type="text"
                              value={editNameEn}
                              onChange={(e) => setEditNameEn(e.target.value)}
                              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-900"
                              dir="ltr"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">ناوی کوردی (سۆرانی)</label>
                            <input
                              type="text"
                              value={editNameCkb}
                              onChange={(e) => setEditNameCkb(e.target.value)}
                              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-900"
                              dir="rtl"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingCatId(null)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
                          >
                            إلغاء
                          </button>
                          <button
                            type="button"
                            onClick={() => saveEditedCategory(cat.id)}
                            className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm"
                          >
                            حفظ التعديلات
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display Category Row */
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold shrink-0">
                            <Layers className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm sm:text-base font-extrabold text-slate-900">
                                {cat.nameAr}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[11px] font-bold">
                                {cat.key}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-black border border-red-200/60">
                                {count} {currentLanguage.code === 'ar' ? 'منتج' : 'products'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mt-1">
                              <span><strong>EN:</strong> {cat.nameEn}</span>
                              <span>•</span>
                              <span><strong>KU:</strong> {cat.nameCkb}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => startEditCategory(cat)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 text-slate-400" />
                            <span>{currentLanguage.code === 'ar' ? 'تعديل' : 'Edit'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
