import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Wrench,
  X
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const langCode = currentLanguage.code;
  const isRtl = currentLanguage.dir === 'rtl' || langCode === 'ar' || langCode === 'ckb';

  const localizedProduct = getLocalizedProduct(product, langCode);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setIsLightboxOpen(false);
  }, [product.id]);

  useEffect(() => subscribeToLocalProducts(setProducts), []);
  useEffect(() => subscribeToHomepageSections(setSections), []);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLightboxOpen]);

  const currentSection = useMemo(() => {
    const key = (product.division || product.category || '').toLowerCase();
    return sections.find((s) => s.key.toLowerCase() === key || s.id.toLowerCase() === key) || null;
  }, [sections, product.division, product.category]);

  const sectionHeader = useMemo(() => {
    if (!currentSection) return null;
    return getLocalizedSectionHeader(currentSection, langCode);
  }, [currentSection, langCode]);

  const sectionSiblings = useMemo(() => {
    const key = (product.division || product.category || '').toLowerCase();
    return products.filter(
      (item) =>
        (item.division || '').toLowerCase() === key ||
        (item.category || '').toLowerCase() === key
    );
  }, [products, product.division, product.category]);

  const currentIndexInAll = useMemo(
    () => products.findIndex((item) => item.id === product.id),
    [products, product.id]
  );

  const handlePrevProduct = () => {
    if (products.length <= 1) return;
    const prevIdx = (currentIndexInAll - 1 + products.length) % products.length;
    onSelectProduct(products[prevIdx]);
  };

  const handleNextProduct = () => {
    if (products.length <= 1) return;
    const nextIdx = (currentIndexInAll + 1) % products.length;
    onSelectProduct(products[nextIdx]);
  };

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

  const descriptionParagraphs = useMemo(() => {
    const raw = (localizedProduct.description || '').trim();
    if (!raw) return [];
    return raw
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [localizedProduct.description]);

  const isHardwareOrAccessory = useMemo(() => {
    const key = (product.division || product.category || '').toLowerCase();
    return key === 'sec-1793119387374' || key.includes('access');
  }, [product.division, product.category]);

  const highlights = useMemo(() => {
    if (langCode === 'ar') {
      return [
        { icon: ShieldCheck, label: 'عزل حراري وصوتي بمعايير أوروبية' },
        { icon: Sparkles, label: 'تشطيبات هندسية فائقة الدقة والمتانة' },
        { icon: Wrench, label: 'تصنيع وتوريد وتركيب بإشراف متخصص' }
      ];
    }
    if (langCode === 'ckb') {
      return [
        { icon: ShieldCheck, label: 'دابڕانی گەرمی و دەنگی بە ستانداردی ئەورووپی' },
        { icon: Sparkles, label: 'دیزاین و کوالێتیی ئەندازیاریی باڵا' },
        { icon: Wrench, label: 'دروستکردن و دامەزراندن بە سەرپەرشتیی پسپۆڕان' }
      ];
    }
    if (langCode === 'kmr') {
      return [
        { icon: ShieldCheck, label: 'Îzolasyona germî û dengî bi standardên Ewropî' },
        { icon: Sparkles, label: 'Sêwirana endezyariyê ya bi kalîte û domdar' },
        { icon: Wrench, label: 'Hilberîn û montaj bi serpereştiya pisporan' }
      ];
    }
    if (langCode === 'tr') {
      return [
        { icon: ShieldCheck, label: 'Avrupa standartlarında ısı ve ses yalıtımı' },
        { icon: Sparkles, label: 'Yüksek hassasiyetli mimari yüzey ve dayanıklılık' },
        { icon: Wrench, label: 'Uzman mühendislik ve profesyonel montaj desteği' }
      ];
    }
    return [
      { icon: ShieldCheck, label: 'European-grade thermal & acoustic insulation' },
      { icon: Sparkles, label: 'Precision-engineered architectural finish & durability' },
      { icon: Wrench, label: 'Custom fabrication & professional installation' }
    ];
  }, [langCode]);

  const waMessage = encodeURIComponent(
    `مرحبا Doorhome، أريد الاستفسار عن: ${localizedProduct.name}. ${
      typeof window !== 'undefined' ? window.location.href : ''
    }`
  );

  const imageUrl = localizedProduct.image || localizedProduct.fallbackImage || './assets/doorhome/03-2.jpg';

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900 pb-16">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-20 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-red-200 px-3.5 py-2 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-red-600 transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t('back_to_catalog') || 'Back to products'}</span>
            </button>

            {sectionHeader && (
              <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 min-w-0">
                <span>/</span>
                <span dir="auto" className="text-slate-600 truncate">
                  {sectionHeader.title}
                </span>
              </div>
            )}
          </div>

          {/* Prev / Next Product Switcher */}
          {products.length > 1 && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-extrabold text-slate-400 tabular-nums px-1.5">
                {String(currentIndexInAll + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={handlePrevProduct}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous product"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextProduct}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next product"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Architectural Showcase Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: High-Impact Media Stage (7 cols on desktop) */}
            <div className="lg:col-span-7 bg-slate-950 relative flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80">
              {/* Main Image Viewport */}
              <div
                onClick={() => setIsLightboxOpen(true)}
                className={`relative w-full min-h-[320px] sm:min-h-[440px] lg:min-h-[540px] flex items-center justify-center overflow-hidden group cursor-zoom-in ${
                  isHardwareOrAccessory
                    ? 'bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,#f1f5f9_100%)] p-8 sm:p-12'
                    : 'bg-slate-900'
                }`}
              >
                <img
                  src={imageUrl}
                  alt={localizedProduct.name}
                  className={`transition-transform duration-700 group-hover:scale-[1.03] ${
                    isHardwareOrAccessory
                      ? 'max-h-[420px] w-full object-contain drop-shadow-[0_20px_30px_rgba(15,23,42,0.14)]'
                      : 'w-full h-full min-h-[320px] sm:min-h-[440px] lg:min-h-[540px] object-cover'
                  }`}
                  onError={(event) => {
                    if (
                      localizedProduct.fallbackImage &&
                      event.currentTarget.src !== localizedProduct.fallbackImage
                    ) {
                      event.currentTarget.src = localizedProduct.fallbackImage;
                    } else {
                      event.currentTarget.src = './assets/doorhome/03-2.jpg';
                    }
                  }}
                />

                {/* Subtle Gradient Overlay for Architectural Photos */}
                {!isHardwareOrAccessory && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/15" />
                )}

                {/* Fullscreen Zoom Trigger */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-xl bg-slate-900/75 hover:bg-red-600 text-white backdrop-blur-md px-3 py-2 text-xs font-bold transition-all shadow-lg cursor-pointer border border-white/15"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {langCode === 'ar'
                      ? 'تكبير الصورة'
                      : langCode === 'ckb'
                        ? 'گەورەکردنی وێنە'
                        : langCode === 'kmr'
                          ? 'Wêneyê Mezin Bike'
                          : langCode === 'tr'
                            ? 'Tam Ekran'
                            : 'Full View'}
                  </span>
                </button>
              </div>

              {/* Section Siblings Quick-Switcher Strip */}
              {sectionSiblings.length > 1 && (
                <div className="bg-slate-900/95 border-t border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0">
                    {langCode === 'ar'
                      ? 'موديلات القسم:'
                      : langCode === 'ckb'
                        ? 'مۆدێلەکانی ئەم بەشە:'
                        : langCode === 'kmr'
                          ? 'Modelên vê beşê:'
                          : langCode === 'tr'
                            ? 'Bu Bölümdeki Modeller:'
                            : 'In this section:'}
                  </span>
                  <div className="flex items-center gap-2">
                    {sectionSiblings.map((sibling) => {
                      const isCurrent = sibling.id === product.id;
                      const locSibling = getLocalizedProduct(sibling, langCode);
                      return (
                        <button
                          key={sibling.id}
                          type="button"
                          onClick={() => onSelectProduct(sibling)}
                          title={locSibling.name}
                          className={`relative w-14 h-11 sm:w-16 sm:h-12 rounded-xl overflow-hidden transition-all cursor-pointer shrink-0 ${
                            isCurrent
                              ? 'ring-2 ring-red-500 scale-105 opacity-100'
                              : 'opacity-55 hover:opacity-95 ring-1 ring-white/15'
                          }`}
                        >
                          <img
                            src={locSibling.image || locSibling.fallbackImage || './assets/doorhome/03-2.jpg'}
                            alt={locSibling.name}
                            className="w-full h-full object-cover bg-white"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Editorial Brief, Specifications & WhatsApp CTA (5 cols on desktop) */}
            <div
              dir={isRtl ? 'rtl' : 'ltr'}
              className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-8 bg-white"
            >
              <div className="space-y-6">
                {/* Category Pill */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {sectionHeader ? (
                    <span
                      dir="auto"
                      className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200/70 px-3.5 py-1 text-xs font-extrabold text-red-700"
                    >
                      <Layers className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{sectionHeader.title}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200/70 px-3.5 py-1 text-xs font-extrabold text-red-700">
                      <Layers className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>Doorhome Architectural Systems</span>
                    </span>
                  )}
                </div>

                {/* Product Title & Red Architectural Bar */}
                <div className="space-y-3">
                  <h1
                    dir="auto"
                    className="text-2xl sm:text-3xl lg:text-[32px] font-black leading-[1.25] tracking-tight text-slate-900"
                  >
                    {localizedProduct.name}
                  </h1>
                  <div className="h-1 w-14 rounded-full bg-red-600" aria-hidden="true" />
                </div>

                {/* Clean Editorial Multi-Paragraph Description */}
                <div className="space-y-4 pt-1">
                  {descriptionParagraphs.length > 0 ? (
                    descriptionParagraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        dir="auto"
                        className="text-[15px] sm:text-base leading-[1.85] text-slate-600 font-normal"
                      >
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p
                      dir="auto"
                      className="text-[15px] sm:text-base leading-[1.85] text-slate-600 font-normal"
                    >
                      {localizedProduct.description}
                    </p>
                  )}
                </div>

                {/* Architectural Quality & Service Highlights */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  {highlights.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-xl bg-slate-50/90 border border-slate-200/60 px-3.5 py-2.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span dir="auto" className="text-xs sm:text-[13px] font-bold text-slate-700 leading-snug">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right-Aligned WhatsApp Direct Inquiry CTA */}
              <div dir="ltr" className="pt-5 border-t border-slate-100 flex items-center justify-end w-full">
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
        </div>

        {/* Related Systems & Products Section */}
        {suggestions.length > 0 && (
          <section className="mt-12" aria-labelledby="product-suggestions-title">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-7 rounded-full bg-red-600" aria-hidden="true" />
                <h2
                  id="product-suggestions-title"
                  dir="auto"
                  className="text-xl sm:text-2xl font-black text-slate-900"
                >
                  {t('suggestions_title')}
                </h2>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion) => {
                const localized = getLocalizedProduct(suggestion, langCode);
                const sugSection = sections.find(
                  (s) =>
                    s.key.toLowerCase() === (suggestion.division || suggestion.category || '').toLowerCase()
                );
                const sugHeader = sugSection ? getLocalizedSectionHeader(sugSection, langCode) : null;

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
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center shadow-sm transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        {sugHeader && (
                          <span
                            dir="auto"
                            className="text-[11px] font-extrabold uppercase tracking-wider text-red-600 block truncate"
                          >
                            {sugHeader.title}
                          </span>
                        )}
                        <h3
                          dir="auto"
                          className="line-clamp-1 text-base sm:text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors"
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

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-150"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            aria-label="Close fullscreen view"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={imageUrl}
            alt={localizedProduct.name}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88dvh] max-w-[92vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
