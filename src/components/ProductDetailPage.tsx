import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import { ProductItem } from '../data/winhomeData';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';
import { loadLocalProducts, subscribeToLocalProducts } from '../services/productService';
import {
  HomepageSectionConfig,
  loadHomepageSections,
  subscribeToHomepageSections,
  getLocalizedSectionHeader
} from '../services/homepageSectionsService';

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
  const [sections, setSections] = useState<HomepageSectionConfig[]>(loadHomepageSections);

  const langCode = currentLanguage.code;
  const isRtl = langCode === 'ar' || langCode === 'ckb';
  const localizedProduct = getLocalizedProduct(product, langCode);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [product.id]);

  useEffect(() => subscribeToLocalProducts(setProducts), []);
  useEffect(() => subscribeToHomepageSections(setSections), []);

  // Find section of this product
  const currentSection = useMemo(() => {
    const key = (product.division || product.category || '').toLowerCase();
    return sections.find((s) => s.key.toLowerCase() === key || s.id.toLowerCase() === key) || null;
  }, [sections, product.division, product.category]);

  const sectionHeader = useMemo(() => {
    if (!currentSection) return null;
    return getLocalizedSectionHeader(currentSection, langCode);
  }, [currentSection, langCode]);

  // Sibling products in the same category/section
  const sectionSiblings = useMemo(() => {
    const key = (product.division || product.category || '').toLowerCase();
    return products.filter(
      (item) =>
        (item.division || '').toLowerCase() === key ||
        (item.category || '').toLowerCase() === key
    );
  }, [products, product.division, product.category]);

  // Build list of gallery thumbnails (5 items)
  const galleryImages = useMemo(() => {
    const mainImg = localizedProduct.image || localizedProduct.fallbackImage || './assets/doorhome/03-2.jpg';
    const imgs: string[] = [mainImg];

    // Add sibling images to provide multiple angles/models
    sectionSiblings.forEach((sib) => {
      const sibImg = sib.image || sib.fallbackImage;
      if (sibImg && !imgs.includes(sibImg)) {
        imgs.push(sibImg);
      }
    });

    // Fallback fill to 5 thumbnails if needed
    const fallbacks = [
      './assets/doorhome/03-2.jpg',
      './assets/doorhome/02.jpg',
      './assets/doorhome/01.jpg',
      '/uploads/d450c202-44ba-4ab0-a3a5-616d06e3dd08.jpg',
      '/uploads/503a52b8-eba7-47a9-bc40-4829d9a4ba81.jpg'
    ];
    let fIdx = 0;
    while (imgs.length < 5 && fIdx < fallbacks.length) {
      if (!imgs.includes(fallbacks[fIdx])) {
        imgs.push(fallbacks[fIdx]);
      }
      fIdx++;
    }

    return imgs.slice(0, 5);
  }, [localizedProduct.image, localizedProduct.fallbackImage, sectionSiblings]);

  const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);

  // Reset active image when product changes
  useEffect(() => {
    setActiveImage(localizedProduct.image || localizedProduct.fallbackImage || './assets/doorhome/03-2.jpg');
  }, [product.id, localizedProduct.image, localizedProduct.fallbackImage]);

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

  // 3 Architectural Specs Pills (localized in 5 languages)
  const specBadges = useMemo(() => {
    if (langCode === 'ar') {
      return [
        { icon: Layers, label: 'هيكل معدني قوي' },
        { icon: Sparkles, label: 'مقبض خشبي طبيعي' },
        { icon: ShieldCheck, label: 'زجاج شفاف مقسى' }
      ];
    }
    if (langCode === 'ckb') {
      return [
        { icon: Layers, label: 'پەیکەری کانزایی بەهێز' },
        { icon: Sparkles, label: 'دەسکی داری سروشتی' },
        { icon: ShieldCheck, label: 'شووشەی ڕوونی بەهێزکراو' }
      ];
    }
    if (langCode === 'kmr') {
      return [
        { icon: Layers, label: 'Avahiya Metalî ya Xurt' },
        { icon: Sparkles, label: 'Destika Dara Xwezayî' },
        { icon: ShieldCheck, label: 'Cama Zelal a Qewîn' }
      ];
    }
    if (langCode === 'tr') {
      return [
        { icon: Layers, label: 'Güçlü Metal Gövde' },
        { icon: Sparkles, label: 'Doğal Ahşap Kulp' },
        { icon: ShieldCheck, label: 'Şeffaf Temperli Cam' }
      ];
    }
    return [
      { icon: Layers, label: 'Heavy-Duty Metal Frame' },
      { icon: Sparkles, label: 'Natural Wood Top Handrail' },
      { icon: ShieldCheck, label: 'Ultra-Clear Toughened Glass' }
    ];
  }, [langCode]);

  // WhatsApp Message
  const waMessage = encodeURIComponent(
    `مرحبا Doorhome، أريد الاستفسار عن: ${localizedProduct.name}. ${
      typeof window !== 'undefined' ? window.location.href : ''
    }`
  );

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-slate-900 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Top Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-red-600 hover:border-red-300 shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            <span>{t('back_to_catalog') || 'Back to products'}</span>
          </button>
        </div>

        {/* Central Master Card (Matching the exact design in the uploaded image) */}
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="relative overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.08)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Side: Large Photo + Vertical Thumbnail Strip */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-start">
              {/* Main Large Image */}
              <div className="relative flex-1 w-full aspect-[4/4.5] min-h-[340px] sm:min-h-[440px] md:min-h-[480px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
                <img
                  src={activeImage}
                  alt={localizedProduct.name}
                  className="w-full h-full object-cover transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = './assets/doorhome/03-2.jpg';
                  }}
                />
              </div>

              {/* Stacked Vertical Thumbnails Strip (Right next to main image, exactly like the image) */}
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible w-full sm:w-auto shrink-0 no-scrollbar">
                {galleryImages.map((thumbUrl, idx) => {
                  const isSelected = activeImage === thumbUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(thumbUrl)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 shadow-2xs ${
                        isSelected
                          ? 'border-red-600 ring-2 ring-red-100 scale-102'
                          : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={thumbUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = './assets/doorhome/03-2.jpg';
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Editorial Header, Paragraphs, Specs, Divider & Red WhatsApp CTA */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-5 text-start">
              <div>
                {/* Featured Badge */}
                <div className="flex items-center gap-2 text-red-600 font-black text-xs sm:text-sm mb-2">
                  <span className="w-4 h-0.5 bg-red-600 rounded-full" aria-hidden="true" />
                  <span>
                    {sectionHeader?.title ||
                      (langCode === 'ar'
                        ? 'منتج مميز'
                        : langCode === 'ckb'
                          ? 'بەرهەمی تایبەت'
                          : langCode === 'kmr'
                            ? 'Berhema Taybet'
                            : langCode === 'tr'
                              ? 'Öne Çıkan Ürün'
                              : 'Featured Product')}
                  </span>
                </div>

                {/* Product Title */}
                <h1
                  dir="auto"
                  className="text-2xl sm:text-3xl lg:text-[32px] font-black leading-tight tracking-tight text-slate-900 mb-4"
                >
                  {localizedProduct.name}
                </h1>

                {/* Paragraph 1: Intro */}
                {paragraphs[0] && (
                  <p
                    dir="auto"
                    className="text-slate-600 text-sm sm:text-[15px] leading-[1.85] font-normal mb-5"
                  >
                    {paragraphs[0]}
                  </p>
                )}

                {/* Horizontal Specs / Features Row (Exactly matching the icons & labels in the image) */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-2 border-y border-slate-100 my-4 text-xs sm:text-sm font-bold text-slate-800">
                  {specBadges.map((badge, bIdx) => {
                    const IconComponent = badge.icon;
                    return (
                      <div
                        key={bIdx}
                        className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-xl text-slate-700"
                      >
                        <IconComponent className="w-4 h-4 text-red-600 shrink-0" />
                        <span dir="auto">{badge.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Paragraph 2: Engineering Specs & Details */}
                {paragraphs[1] && (
                  <p
                    dir="auto"
                    className="text-slate-600 text-sm sm:text-[15px] leading-[1.85] font-normal my-4"
                  >
                    {paragraphs[1]}
                  </p>
                )}

                {/* Thin Divider Line */}
                <div className="h-px bg-slate-100 my-4" aria-hidden="true" />

                {/* Paragraph 3: Closing Value Statement */}
                {paragraphs[2] && (
                  <p
                    dir="auto"
                    className="text-slate-600 text-sm sm:text-[15px] leading-[1.85] font-normal mb-6"
                  >
                    {paragraphs[2]}
                  </p>
                )}
              </div>

              {/* Bottom WhatsApp CTA Button (In RED, without Chat button and without Price button) */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <a
                  href={`https://wa.me/9647507388748?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white px-8 py-3.5 text-sm sm:text-base font-extrabold shadow-md shadow-red-600/25 transition-all hover:scale-102 cursor-pointer"
                >
                  {/* WhatsApp SVG Icon */}
                  <span className="w-5 h-5 flex items-center justify-center shrink-0" aria-hidden="true">
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
