import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { ProductItem } from '../data/winhomeData';
import { RequestItem } from '../types/requests';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';
import { loadLocalProducts, subscribeToLocalProducts } from '../services/productService';

interface ProductDetailPageProps {
  product: ProductItem;
  onBack: () => void;
  onAddToCart: (item: RequestItem) => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack, onAddToCart, onSelectProduct }) => {
  const { currentLanguage, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState<ProductItem[]>(loadLocalProducts);
  const localizedProduct = getLocalizedProduct(product, currentLanguage.code);
  const price = product.pricePerSqm ?? product.basePrice ?? product.unitPrice;

  const suggestions = useMemo(() => products
    .filter((item) => item.id !== product.id)
    .sort((left, right) => {
      const leftMatches = left.category === product.category || Boolean(product.division && left.division === product.division);
      const rightMatches = right.category === product.category || Boolean(product.division && right.division === product.division);
      return Number(rightMatches) - Number(leftMatches);
    })
    .slice(0, 4), [products, product.id, product.category, product.division]);

  useEffect(() => {
    setQuantity(1);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [product.id]);

  useEffect(() => subscribeToLocalProducts(setProducts), []);

  const addToCart = () => {
    onAddToCart({
      id: `item-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      category: product.category,
      image: product.image || product.fallbackImage,
      quantity,
      unitPrice: price,
      totalPrice: price == null ? undefined : price * quantity,
      currency: product.currency || 'USD'
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_10%,#fff0f1_0%,#f8f9fc_34%,#eef2f7_100%)] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-x-1 hover:text-red-600">
          <ArrowLeft className="h-4 w-4" /> {t('back_to_catalog') || 'Back to products'}
        </button>
        <div className="relative grid gap-8 overflow-hidden rounded-[2rem] border border-white bg-white/95 p-5 shadow-[0_30px_80px_-35px_rgba(48,38,57,0.32)] sm:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-700 via-red-500 to-rose-200" />
          <div className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-[1.5rem] border border-rose-100/80 bg-gradient-to-br from-[#fff4f4] via-white to-[#eef3f8] p-6 sm:min-h-96 lg:min-h-[440px]">
            <div aria-hidden="true" className="absolute -right-16 -top-20 h-56 w-56 rounded-full border-[30px] border-red-100/50" />
            <div aria-hidden="true" className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-rose-100/50 blur-2xl" />
            <img
              src={localizedProduct.image || localizedProduct.fallbackImage}
              alt={localizedProduct.name}
              className="relative z-10 max-h-[440px] w-full object-contain drop-shadow-[0_20px_20px_rgba(15,23,42,0.12)]"
              onError={(event) => {
                if (localizedProduct.fallbackImage && event.currentTarget.src !== localizedProduct.fallbackImage) {
                  event.currentTarget.src = localizedProduct.fallbackImage;
                }
              }}
            />
          </div>
          <div className="flex flex-col justify-center gap-5 py-3 lg:pr-4">
            <div className="h-1 w-12 rounded-full bg-red-600" aria-hidden="true" />
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl"><bdi dir="auto">{localizedProduct.name}</bdi></h1>
            <p className="max-w-xl whitespace-pre-wrap text-base leading-relaxed text-slate-600 sm:text-lg"><bdi dir="auto">{localizedProduct.description}</bdi></p>
            {price != null && (
              <p className="border-t border-slate-100 pt-5 text-4xl font-black tracking-tight text-red-600">
                {product.currency === 'IQD' ? `${price.toLocaleString()} IQD` : `$${price.toLocaleString()}`}
              </p>
            )}
            <div className="flex flex-wrap items-end gap-4 pt-1">
              <div>
                <label htmlFor="product-quantity" className="mb-2 block text-sm font-bold text-slate-700">{t('qty_label')}</label>
                <div className="inline-flex h-12 items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1} aria-label={t('ui_quantity_less')} className="flex h-full w-11 items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40"><Minus className="h-4 w-4" /></button>
                  <input id="product-quantity" type="number" min={1} max={9999} value={quantity} onChange={(event) => setQuantity(Math.min(9999, Math.max(1, Number(event.target.value) || 1)))} className="h-full w-16 border-x border-slate-200 text-center text-base font-bold text-slate-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                  <button type="button" onClick={() => setQuantity((value) => Math.min(9999, value + 1))} disabled={quantity >= 9999} aria-label={t('ui_quantity_more')} className="flex h-full w-11 items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
              <button type="button" onClick={addToCart} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 text-sm font-extrabold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700 cursor-pointer"><ShoppingCart className="h-5 w-5" />{t('add_to_cart_btn')}</button>
              <a href={`https://wa.me/9647507388748?text=${encodeURIComponent(`Hello Doorhome, I would like information about ${localizedProduct.name}. Quantity: ${quantity}. ${window.location.href}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700">{t('chat_whatsapp_btn')}</a>
            </div>
          </div>
        </div>
        {suggestions.length > 0 && (
          <section className="mt-10 rounded-[2rem] border border-rose-100/80 bg-gradient-to-br from-white via-[#fff7f7] to-[#f4f6fa] p-5 shadow-[0_20px_50px_-35px_rgba(159,18,57,0.3)] sm:p-8" aria-labelledby="product-suggestions-title">
            <h2 id="product-suggestions-title" className="mb-6 border-s-4 border-red-600 ps-4 text-2xl font-black text-slate-900">{t('suggestions_title')}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion) => {
                const localized = getLocalizedProduct(suggestion, currentLanguage.code);
                const suggestedPrice = suggestion.pricePerSqm ?? suggestion.basePrice ?? suggestion.unitPrice;
                return (
                  <button key={suggestion.id} type="button" onClick={() => onSelectProduct(suggestion)} className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white text-start shadow-[0_10px_30px_-20px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:border-red-300 hover:shadow-lg cursor-pointer ${suggestions.length === 1 ? 'sm:col-span-2 lg:col-span-2 sm:flex' : ''}`}>
                    <div className={`h-56 overflow-hidden bg-slate-100 ${suggestions.length === 1 ? 'sm:h-64 sm:w-2/5' : ''}`}><img src={localized.image || localized.fallbackImage} alt={localized.name} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" /></div>
                    <div className="flex-1 space-y-2 p-4 sm:p-6">
                      <h3 className="line-clamp-2 text-base font-extrabold text-slate-900"><bdi dir="auto">{localized.name}</bdi></h3>
                      <p className="line-clamp-2 text-sm leading-relaxed text-slate-600"><bdi dir="auto">{localized.description}</bdi></p>
                      {suggestedPrice != null && <p className="text-lg font-black text-red-600">{suggestion.currency === 'IQD' ? `${suggestedPrice.toLocaleString()} IQD` : `$${suggestedPrice.toLocaleString()}`}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
