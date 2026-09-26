import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Search, ShoppingCart, X } from 'lucide-react';
import { ProductItem } from '../data/winhomeData';
import { ProductCategoryDivision } from '../data/productNavigationData';
import { loadLocalProducts, subscribeToLocalProducts } from '../services/productService';
import { loadProductDivisions, subscribeToDivisions } from '../services/productNavigationService';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';

interface ProductShopPageProps {
  initialCategory?: string;
  onSelectProduct: (product: ProductItem) => void;
  onBackToHome: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

const productPrice = (product: ProductItem) => product.pricePerSqm ?? product.basePrice ?? product.unitPrice;

export const ProductShopPage: React.FC<ProductShopPageProps> = ({
  initialCategory = 'all',
  onSelectProduct,
  onBackToHome,
  cartCount = 0,
  onOpenCart
}) => {
  const { currentLanguage, t } = useLanguage();
  const [divisions, setDivisions] = useState<ProductCategoryDivision[]>(loadProductDivisions);
  const [products, setProducts] = useState<ProductItem[]>(loadLocalProducts);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');

  useEffect(() => subscribeToDivisions(setDivisions), []);
  useEffect(() => subscribeToLocalProducts(setProducts), []);
  useEffect(() => {
    if (selectedCategory !== 'all' && !divisions.some((division) => division.key === selectedCategory)) {
      setSelectedCategory('all');
    }
  }, [divisions, selectedCategory]);

  const categories = useMemo(() => [
    { id: 'all', label: t('all_categories') || 'All categories' },
    ...divisions.map((division) => ({
      id: division.key,
      label: ((division as any).translations?.[currentLanguage.code] || (division as any).translations?.[currentLanguage.code.split('-')[0]])?.name || (currentLanguage.code === 'ckb'
        ? division.kurdishTitle || division.title
        : currentLanguage.code === 'ar'
          ? division.arabicTitle || division.title
          : division.title)
    }))
  ], [divisions, currentLanguage.code, t]);

  const visibleProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = products
      .map((product) => getLocalizedProduct(product, currentLanguage.code))
      .filter((product) => {
        if (selectedCategory !== 'all' && product.category !== selectedCategory && product.division !== selectedCategory) return false;
        return !query || product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
      });
    if (sortBy !== 'default') {
      result.sort((left, right) => {
        const difference = (productPrice(left) ?? 0) - (productPrice(right) ?? 0);
        return sortBy === 'price-low' ? difference : -difference;
      });
    }
    return result;
  }, [products, currentLanguage.code, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#F5F6F8] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <button type="button" onClick={onBackToHome} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-red-600">
          <ArrowLeft className="h-4 w-4" /> Doorhome
        </button>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">{t('shop_title') || 'Products'}</h1>
            <p className="mt-1 text-sm text-slate-500">{visibleProducts.length} · {t('nav_products')}</p>
          </div>
          {onOpenCart && (
            <button type="button" onClick={onOpenCart} className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:border-red-300">
              <ShoppingCart className="h-4 w-4" /> {t('cart_drawer_title')}{cartCount > 0 ? ` (${cartCount})` : ''}
            </button>
          )}
        </div>

        <div className="mb-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_minmax(180px,240px)_minmax(160px,190px)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('search_shop_ph') || 'Search products'}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm outline-none focus:border-red-500"
            />
            {searchQuery && <button type="button" onClick={() => setSearchQuery('')} aria-label={t('ui_clear_search')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"><X className="h-4 w-4" /></button>}
          </div>
          <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} aria-label={t('all_categories')} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800">
            {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} aria-label={t('featured_sort')} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800">
            <option value="default">{t('featured_sort') || 'Default order'}</option>
            <option value="price-low">{t('sort_price_low') || 'Price: low to high'}</option>
            <option value="price-high">{t('sort_price_high') || 'Price: high to low'}</option>
          </select>
        </div>

        {visibleProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">{t('ui_no_products')}</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => {
              const price = productPrice(product);
              return (
                <button key={product.id} type="button" onClick={() => onSelectProduct(product)} className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:border-red-300 hover:shadow-lg">
                  <div className="h-52 overflow-hidden bg-slate-50">
                    <img
                      src={product.image || product.fallbackImage}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        if (product.fallbackImage && event.currentTarget.src !== product.fallbackImage) event.currentTarget.src = product.fallbackImage;
                      }}
                    />
                  </div>
                  <div className="space-y-2 p-4">
                    <h2 className="line-clamp-2 text-base font-black text-slate-900">{product.name}</h2>
                    <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{product.description}</p>
                    {price != null && <p className="pt-1 text-lg font-black text-red-600">{product.currency === 'IQD' ? `${price.toLocaleString()} IQD` : `$${price.toLocaleString()}`}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
