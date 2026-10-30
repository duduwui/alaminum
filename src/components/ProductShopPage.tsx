import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';
import { ProductItem } from '../data/winhomeData';
import { loadLocalProducts, subscribeToLocalProducts } from '../services/productService';
import {
  HomepageSectionConfig,
  loadHomepageSections,
  subscribeToHomepageSections,
  getLocalizedSectionHeader
} from '../services/homepageSectionsService';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';

interface ProductShopPageProps {
  initialCategory?: string;
  onSelectProduct: (product: ProductItem) => void;
  onBackToHome: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const ProductShopPage: React.FC<ProductShopPageProps> = ({
  initialCategory = 'all',
  onSelectProduct,
  onBackToHome,
  cartCount = 0,
  onOpenCart
}) => {
  const { currentLanguage, t } = useLanguage();
  const [sections, setSections] = useState<HomepageSectionConfig[]>(loadHomepageSections);
  const [products, setProducts] = useState<ProductItem[]>(loadLocalProducts);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => subscribeToHomepageSections(setSections), []);
  useEffect(() => subscribeToLocalProducts(setProducts), []);

  const categories = useMemo(() => {
    const list: Array<{ id: string; label: string }> = [
      { id: 'all', label: t('all_categories') || 'All categories' }
    ];
    const seen = new Set<string>(['all']);

    // Standard architectural categories
    const standardCats = [
      {
        id: 'doors',
        label: currentLanguage.code === 'ar' ? 'أنظمة الأبواب والمداخل' : currentLanguage.code === 'ckb' ? 'دەرگاکان' : 'Doors & Entrances'
      },
      {
        id: 'windows',
        label: currentLanguage.code === 'ar' ? 'أنظمة النوافذ والشبابيك' : currentLanguage.code === 'ckb' ? 'پەنجەرەکان' : 'Windows Systems'
      },
      {
        id: 'balconies',
        label: currentLanguage.code === 'ar' ? 'حواجز البلكونات' : currentLanguage.code === 'ckb' ? 'باڵکۆنەکان' : 'Glass Balconies'
      },
      {
        id: 'shorfa',
        label: currentLanguage.code === 'ar' ? 'أنظمة الشرفات والتراسات' : currentLanguage.code === 'ckb' ? 'شرفە و تراسەکان' : 'Terraces & Shorfa'
      },
      {
        id: 'stairs',
        label: currentLanguage.code === 'ar' ? 'حواجز السلالم والدربزينات' : currentLanguage.code === 'ckb' ? 'قادرمە و دەربزینەکان' : 'Stairs & Railings'
      },
      {
        id: 'accessories',
        label: currentLanguage.code === 'ar' ? 'الملحقات والإكسسوارات' : currentLanguage.code === 'ckb' ? 'اکسسوارات و پێداویستییەکان' : 'Accessories & Hardware'
      }
    ];

    standardCats.forEach((c) => {
      seen.add(c.id);
      list.push(c);
    });

    // Also include dynamic homepage sections if any extra custom sections exist
    sections
      .filter((sec) => sec.isProductSection !== false)
      .forEach((sec) => {
        const k = sec.key || sec.id;
        if (!seen.has(k) && !seen.has(k.toLowerCase())) {
          seen.add(k);
          const header = getLocalizedSectionHeader(sec, currentLanguage.code);
          list.push({
            id: k,
            label: header.title || sec.title || k
          });
        }
      });

    return list;
  }, [sections, currentLanguage.code, t]);

  useEffect(() => {
    if (selectedCategory !== 'all' && !categories.some((c) => c.id === selectedCategory)) {
      setSelectedCategory('all');
    }
  }, [categories, selectedCategory]);

  const visibleProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products
      .map((product) => getLocalizedProduct(product, currentLanguage.code))
      .filter((product) => {
        if (selectedCategory !== 'all') {
          const sCat = selectedCategory.toLowerCase();
          const pCat = (product.category || '').toLowerCase();
          const pDiv = (product.division || '').toLowerCase();
          const pSub = (product.subCategory || '').toLowerCase();

          if (sCat === 'shorfa') {
            if (pCat !== 'shorfa' && pDiv !== 'shorfa' && !pSub.includes('shorfa')) return false;
          } else if (sCat === 'balconies') {
            if (pCat !== 'balconies' && pDiv !== 'balconies' && !pSub.includes('balcon')) return false;
          } else if (sCat === 'doors') {
            if (pCat !== 'doors' && pDiv !== 'doors' && !pSub.includes('door') && !pSub.includes('gate')) return false;
          } else if (sCat === 'windows') {
            if (pCat !== 'windows' && pDiv !== 'windows' && !pSub.includes('window')) return false;
          } else if (sCat === 'stairs') {
            if (pCat !== 'stairs' && pDiv !== 'stairs' && !pSub.includes('stair') && !pCat.includes('1793119387374')) return false;
          } else if (sCat === 'accessories') {
            if (pCat !== 'accessories' && pDiv !== 'accessories' && !pSub.includes('accessor')) return false;
          } else if (sCat.includes('1793119430295')) {
            // Homepage section for exterior glass railings & balconies
            if (!pCat.includes('balcon') && !pCat.includes('shorfa') && !pDiv.includes('balcon') && !pDiv.includes('shorfa')) return false;
          } else if (sCat.includes('1793119387374')) {
            if (!pCat.includes('stair') && !pDiv.includes('stair')) return false;
          } else {
            const matches = pCat === sCat || pDiv === sCat;
            if (!matches) return false;
          }
        }
        return !query || product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
      });
  }, [products, currentLanguage.code, selectedCategory, searchQuery]);

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
        </div>

        <div className="mb-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_minmax(200px,280px)]">
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
        </div>

        {visibleProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">{t('ui_no_products')}</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => {
              return (
                <button key={product.id} type="button" onClick={() => onSelectProduct(product)} className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-start shadow-sm transition hover:border-red-300 hover:shadow-lg cursor-pointer">
                  <div className="h-52 overflow-hidden bg-slate-50">
                    {/\.(mp4|webm|mov)(\?|#|$)/i.test(product.image || '') ? (
                      <video
                        src={product.image}
                        muted
                        playsInline
                        autoPlay
                        loop
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={product.image || product.fallbackImage}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          if (product.fallbackImage && event.currentTarget.src !== product.fallbackImage) event.currentTarget.src = product.fallbackImage;
                        }}
                      />
                    )}
                  </div>
                  <div className="space-y-2 p-4">
                    <h2 className="line-clamp-2 text-base font-black text-slate-900"><bdi dir="auto">{product.name}</bdi></h2>
                    <p className="line-clamp-2 text-sm leading-relaxed text-slate-600"><bdi dir="auto">{product.description}</bdi></p>
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
