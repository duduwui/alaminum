import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ProductItem } from '../data/winhomeData';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';
import { loadLocalProducts, subscribeToLocalProducts } from '../services/productService';

interface ProductDetailPageProps {
  product: ProductItem;
  onBack: () => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack, onSelectProduct }) => {
  const { currentLanguage, t } = useLanguage();
  const [products, setProducts] = useState<ProductItem[]>(loadLocalProducts);
  const localizedProduct = getLocalizedProduct(product, currentLanguage.code);

  const suggestions = useMemo(() => products
    .filter((item) => item.id !== product.id)
    .sort((left, right) => {
      const leftMatches = left.category === product.category || Boolean(product.division && left.division === product.division);
      const rightMatches = right.category === product.category || Boolean(product.division && right.division === product.division);
      return Number(rightMatches) - Number(leftMatches);
    })
    .slice(0, 4), [products, product.id, product.category, product.division]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [product.id]);

  useEffect(() => subscribeToLocalProducts(setProducts), []);

  const waMessage = encodeURIComponent(
    `مرحبا Doorhome، أريد الاستفسار عن: ${localizedProduct.name}. ${typeof window !== 'undefined' ? window.location.href : ''}`
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_10%,#fff0f1_0%,#f8f9fc_34%,#eef2f7_100%)] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-x-1 hover:text-red-600 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> {t('back_to_catalog') || 'Back to products'}
        </button>

        <div className="relative grid gap-8 overflow-hidden rounded-[2rem] border border-white bg-white/95 p-5 shadow-[0_30px_80px_-35px_rgba(48,38,57,0.32)] sm:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 items-start">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-700 via-red-500 to-rose-200" />

          {/* Left: Product Image */}
          <div className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-[1.5rem] border border-rose-100/80 bg-gradient-to-br from-[#fff4f4] via-white to-[#eef3f8] p-6 sm:min-h-96 lg:min-h-[460px]">
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

          {/* Right: Product Title, Description & Right-Aligned WhatsApp Button */}
          <div className="flex flex-col justify-between gap-6 py-2 lg:pr-4 h-full">
            <div className="space-y-4">
              <div className="h-1 w-12 rounded-full bg-red-600 ms-auto" aria-hidden="true" />
              <h1 dir="auto" className="text-2xl font-black leading-snug tracking-tight sm:text-4xl text-slate-900">
                {localizedProduct.name}
              </h1>
              <p dir="auto" className="whitespace-pre-line text-sm sm:text-base leading-[1.8] text-slate-600">
                {localizedProduct.description}
              </p>
            </div>

            {/* Right-aligned Modern WhatsApp CTA Button */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100 w-full">
              <a
                href={`https://wa.me/9647507388748?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-cta-btn"
              >
                <span className="wa-icon-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.758.459 3.473 1.331 4.988L2 22l5.188-1.361c1.464.799 3.111 1.221 4.843 1.221h.004c5.515 0 9.965-4.453 9.965-9.969 0-2.664-1.037-5.168-2.92-7.051C17.197 3.037 14.693 2 12.031 2zm5.822 14.279c-.246.693-1.434 1.326-1.988 1.409-.508.076-1.15.109-1.856-.115-.428-.136-.979-.318-1.682-.622-2.961-1.278-4.895-4.26-5.043-4.458-.148-.197-1.205-1.603-1.205-3.058 0-1.455.763-2.171 1.034-2.467.271-.296.591-.37.788-.37.197 0 .394.002.566.01.182.009.426-.069.666.508.246.592.838 2.047.912 2.195.074.148.123.321.025.518-.099.198-.148.321-.296.494-.148.172-.311.385-.444.518-.148.148-.302.309-.13.605.173.296.766 1.264 1.645 2.048 1.13 1.008 2.083 1.32 2.379 1.468.296.148.468.123.641-.074.172-.197.739-.863.936-1.159.197-.296.394-.247.665-.148.271.099 1.725.814 2.021.962.296.148.493.222.567.345.074.123.074.715-.172 1.408z" />
                  </svg>
                </span>
                <span>
                  <bdi dir="auto">{t('chat_whatsapp_btn') || 'تواصل عبر واتساب'}</bdi>
                </span>
              </a>
            </div>
          </div>
        </div>

        {suggestions.length > 0 && (
          <section className="mt-10 rounded-[2rem] border border-rose-100/80 bg-gradient-to-br from-white via-[#fff7f7] to-[#f4f6fa] p-5 shadow-[0_20px_50px_-35px_rgba(159,18,57,0.3)] sm:p-8" aria-labelledby="product-suggestions-title">
            <h2 id="product-suggestions-title" className="mb-6 border-s-4 border-red-600 ps-4 text-2xl font-black text-slate-900">{t('suggestions_title')}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion) => {
                const localized = getLocalizedProduct(suggestion, currentLanguage.code);
                return (
                  <button key={suggestion.id} type="button" onClick={() => onSelectProduct(suggestion)} className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white text-start shadow-[0_10px_30px_-20px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:border-red-300 hover:shadow-lg cursor-pointer ${suggestions.length === 1 ? 'sm:col-span-2 lg:col-span-2 sm:flex' : ''}`}>
                    <div className={`h-56 overflow-hidden bg-slate-100 ${suggestions.length === 1 ? 'sm:h-64 sm:w-2/5' : ''}`}><img src={localized.image || localized.fallbackImage} alt={localized.name} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" /></div>
                    <div className="flex-1 space-y-2 p-4 sm:p-6">
                      <h3 className="line-clamp-2 text-base font-extrabold text-slate-900"><bdi dir="auto">{localized.name}</bdi></h3>
                      <p className="line-clamp-2 text-sm leading-relaxed text-slate-600"><bdi dir="auto">{localized.description}</bdi></p>
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
