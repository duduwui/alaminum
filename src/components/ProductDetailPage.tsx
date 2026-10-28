import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { ProductItem } from '../data/winhomeData';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';
import { loadLocalProducts, subscribeToLocalProducts } from '../services/productService';

interface ProductDetailPageProps {
  product: ProductItem;
  onBack: () => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onSelectProduct
}) => {
  const { currentLanguage, t } = useLanguage();
  const [products, setProducts] = useState<ProductItem[]>(loadLocalProducts);

  const langCode = currentLanguage.code;
  const isRtl = langCode === 'ar' || langCode === 'ckb';
  const localizedProduct = getLocalizedProduct(product, langCode);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [product.id]);

  useEffect(() => subscribeToLocalProducts(setProducts), []);

  // Related suggestions
  const suggestions = useMemo(
    () =>
      products
        .filter((item) => item.id !== product.id)
        .sort((left, right) => {
          const leftMatches =
            left.category === product.category ||
            Boolean(product.division && left.division === product.division);
          const rightMatches =
            right.category === product.category ||
            Boolean(product.division && right.division === product.division);
          return Number(rightMatches) - Number(leftMatches);
        })
        .slice(0, 3),
    [products, product.id, product.category, product.division]
  );

  // Description paragraphs
  const paragraphs = useMemo(() => {
    const raw = (localizedProduct.description || '').trim();
    if (!raw) return [];
    return raw
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [localizedProduct.description]);

  // WhatsApp Message
  const waMessage = encodeURIComponent(
    `مرحبا Doorhome، أريد الاستفسار عن: ${localizedProduct.name}. ${
      typeof window !== 'undefined' ? window.location.href : ''
    }`
  );

  const productImage = localizedProduct.image || localizedProduct.fallbackImage || './assets/doorhome/03-2.jpg';

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-slate-900 px-4 py-4 sm:px-6 sm:py-6 lg:py-6 overflow-hidden">
      {/* Decorative Organic Studio Background Curves (Matching screenshot aesthetic) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* Top-Right Organic Arcs */}
        <svg
          className="absolute -top-16 -right-16 w-[450px] sm:w-[650px] lg:w-[850px] h-auto text-[#E6DACB] opacity-70"
          viewBox="0 0 700 700"
          fill="none"
        >
          <path
            d="M700 0C500 0 320 180 290 420C260 640 450 700 450 700"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M700 120C550 120 420 240 380 430C350 580 480 700 480 700"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <path
            d="M580 0C380 140 260 360 350 700"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>

        {/* Bottom-Left Organic Arcs */}
        <svg
          className="absolute -bottom-20 -left-20 w-[450px] sm:w-[650px] lg:w-[850px] h-auto text-[#E6DACB] opacity-70"
          viewBox="0 0 700 700"
          fill="none"
        >
          <path
            d="M0 700C200 700 380 520 410 280C440 60 250 0 250 0"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M0 580C150 580 280 460 320 270C350 120 220 0 220 0"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <path
            d="M120 700C320 560 440 340 350 0"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Top Back Navigation Button */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-[#E5DACD] bg-white/90 backdrop-blur-xs px-3.5 py-1.5 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-red-600 hover:border-red-300 shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            <span>{t('back_to_catalog') || 'Back to products'}</span>
          </button>
        </div>

        {/* Central Master Studio Card (Fits cleanly in viewport without scrolling on desktop) */}
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="relative overflow-hidden rounded-[2rem] lg:rounded-[2.5rem] border border-[#EBE3D7] bg-white p-5 sm:p-7 lg:p-8 xl:p-9 shadow-[0_20px_60px_-15px_rgba(40,25,15,0.06)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
            {/* Left Column (Image): Constrained within frame so it never forces scrolling */}
            <div className={`lg:col-span-5 xl:col-span-5 w-full flex justify-center ${isRtl ? 'order-1 lg:order-2' : 'order-1 lg:order-1'}`}>
              <div className="relative w-full max-w-[420px] lg:max-w-[440px] h-[300px] sm:h-[360px] lg:h-[400px] xl:h-[430px] max-h-[52vh] rounded-[1.75rem] lg:rounded-[2rem] overflow-hidden bg-slate-100 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.12)] border border-slate-200/60">
                <img
                  src={productImage}
                  alt={localizedProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = './assets/doorhome/03-2.jpg';
                  }}
                />
              </div>
            </div>

            {/* Right Column (Editorial): Directly visible without scrolling */}
            <div className={`lg:col-span-7 xl:col-span-7 flex flex-col justify-center text-start ${isRtl ? 'order-2 lg:order-1' : 'order-2 lg:order-2'}`}>
              {/* Product Title */}
              <h1
                dir="auto"
                className="text-xl sm:text-2xl lg:text-[27px] xl:text-[30px] font-black leading-snug tracking-tight text-slate-900 mb-3 lg:mb-3.5"
              >
                {localizedProduct.name}
              </h1>

              {/* 3 Clean Editorial Paragraphs */}
              <div className="space-y-2.5 lg:space-y-3 text-slate-600 text-xs sm:text-[13.5px] lg:text-[14.5px] font-normal leading-[1.75]">
                {paragraphs.length > 0 ? (
                  paragraphs.map((para, idx) => (
                    <p key={idx} dir="auto">
                      {para}
                    </p>
                  ))
                ) : (
                  <p dir="auto">{localizedProduct.description}</p>
                )}
              </div>

              {/* Red WhatsApp CTA Button (No price button, no chat button) */}
              <div className="pt-3.5 lg:pt-4 flex items-center justify-start">
                <a
                  href={`https://wa.me/9647507388748?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 sm:gap-3 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold shadow-lg shadow-red-600/25 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  {/* WhatsApp White Circular Badge */}
                  <span
                    className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white text-red-600 flex items-center justify-center shrink-0 shadow-xs"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
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
        </div>

        {/* Related Systems / Suggestions Section at Bottom */}
        {suggestions.length > 0 && (
          <section className="mt-12" aria-labelledby="product-suggestions-title">
            <div className="flex items-center gap-3 mb-6 text-start">
              <span className="w-1.5 h-6 rounded-full bg-red-600" aria-hidden="true" />
              <h2
                id="product-suggestions-title"
                dir="auto"
                className="text-xl sm:text-2xl font-black text-slate-900"
              >
                {t('suggestions_title')}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion) => {
                const localized = getLocalizedProduct(suggestion, langCode);
                return (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => onSelectProduct(suggestion)}
                    className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-start shadow-xs hover:shadow-xl hover:border-red-300 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="w-full">
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <img
                          src={localized.image || localized.fallbackImage || './assets/doorhome/03-2.jpg'}
                          alt={localized.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = './assets/doorhome/03-2.jpg';
                          }}
                        />
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center shadow-sm transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h3
                          dir="auto"
                          className="line-clamp-1 text-base font-black text-slate-900 group-hover:text-red-600 transition-colors"
                        >
                          {localized.name}
                        </h3>
                        <p dir="auto" className="line-clamp-2 text-xs sm:text-sm leading-relaxed text-slate-500">
                          {localized.description}
                        </p>
                      </div>
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
