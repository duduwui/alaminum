import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, X, Play, MessageSquare, LayoutGrid } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GalleryMediaItem, loadGalleryItems, fetchGalleryItemsFromCms } from '../services/galleryContentService';
import FlexCarousel, { FlexCarouselItem } from './FlexCarousel';
import AnimatedContent from './AnimatedContent';

interface GallerySectionProps {
  fullPage?: boolean;
  onShowAll?: () => void;
  onBack?: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ fullPage = false, onShowAll, onBack }) => {
  const { currentLanguage, t } = useLanguage();
  const [items, setItems] = useState<GalleryMediaItem[]>(() => loadGalleryItems());
  const [selected, setSelected] = useState<GalleryMediaItem | null>(null);

  useEffect(() => {
    const refresh = () => setItems(loadGalleryItems());
    
    // Fetch live from CMS server to guarantee all uploaded images and videos are loaded
    fetchGalleryItemsFromCms().then((cmsItems) => {
      if (Array.isArray(cmsItems)) {
        setItems(cmsItems);
      }
    });

    window.addEventListener('cms_gallery_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('cms_gallery_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const localize = (item?: GalleryMediaItem | null): GalleryMediaItem => {
    if (!item) return { id: '', title: '', description: '', src: '', mediaType: 'image' } as GalleryMediaItem;
    const text = item.translations?.[currentLanguage.code] || item.translations?.[currentLanguage.code.split('-')[0]];
    return text ? { ...item, title: text.title || text.name || item.title, description: text.description || item.description } : item;
  };

  const visibleItems = items.map(localize);

  // Curated 12 items for the 3D Carousel in direct 1:1 order with Admin CMS slots
  const featuredCarouselItems: FlexCarouselItem[] = useMemo(() => {
    const sourceList = visibleItems.slice(0, 12);

    return sourceList.map((item, idx) => {
      let cleanSrc = item.src;
      if (cleanSrc.startsWith('./')) {
        cleanSrc = cleanSrc.replace('./', '/');
      }
      const isVideo = item.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(cleanSrc);
      const subtitleText = isVideo
        ? (currentLanguage.code === 'ar' ? 'فيديو معماري • اضغط لتشغيل الفيديو' : currentLanguage.code === 'ckb' ? 'ڤیدیۆی نژیاروانی • کلیک بکە بۆ لێدان' : 'Architectural Video • Click to Play')
        : (item.system || item.location || 'Doorhome Architectural System');

      return {
        id: item.id || `carousel-item-${idx}`,
        src: cleanSrc,
        mediaType: isVideo ? 'video' : 'image',
        alt: item.title,
        title: item.title,
        subtitle: subtitleText,
        original: item
      };
    });
  }, [visibleItems, currentLanguage.code]);

  const [modalOpenedAt, setModalOpenedAt] = useState<number>(0);

  const openItemModal = (item: GalleryMediaItem) => {
    setModalOpenedAt(Date.now());
    setSelected(item);
  };

  const closeItemModal = () => {
    // Prevent immediate close from the opening pointerup/click event
    if (Date.now() - modalOpenedAt < 400) return;
    setSelected(null);
  };

  const handleCarouselSelect = (index: number, cItem?: FlexCarouselItem) => {
    let original: GalleryMediaItem | null = null;
    if (cItem?.original) {
      original = cItem.original;
    } else if (cItem) {
      original = visibleItems.find((it) => it.id === cItem.id || it.src === cItem.src) || (cItem as any);
    }
    if (!original && index >= 0 && index < featuredCarouselItems.length) {
      original = featuredCarouselItems[index]?.original || visibleItems[index] || null;
    }
    if (!original) {
      original = visibleItems[0] || null;
    }
    if (original) {
      openItemModal(original);
    }
  };

  return (
    <section
      id={fullPage ? 'projects-page' : 'gallery'}
      className={`w-full bg-[radial-gradient(ellipse_at_0%_0%,rgba(220,38,38,0.045),transparent_32%),#fff] py-16 sm:py-24 ${
        fullPage ? 'min-h-screen' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {fullPage && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-red-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Doorhome
          </button>
        )}

        {/* Section Header */}
        <div className="mb-8 max-w-3xl dh-reveal">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t('gallery_title')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {t('gallery_desc')}
          </p>
        </div>

        {items.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600 dh-reveal">
            {t('gallery_empty')}
          </p>
        ) : fullPage ? (
          /* Full Page: 3-Column Responsive Grid View */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item, idx) => {
              let cleanSrc = item.src;
              if (cleanSrc.startsWith('./')) {
                cleanSrc = cleanSrc.replace('./', '/');
              }
              const isVid = item.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(cleanSrc);
              return (
                <AnimatedContent
                  key={item.id || idx}
                  distance={40}
                  direction="vertical"
                  duration={0.6}
                  delay={Math.min((idx % 6) * 0.08, 0.4)}
                  ease="power3.out"
                  className="h-full"
                >
                  <button
                    type="button"
                    onClick={() => openItemModal(item)}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:shadow-xl hover:border-red-500/40 hover:-translate-y-1 cursor-pointer flex flex-col h-full w-full"
                    aria-label={item.title}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                      {isVid ? (
                        <div className="relative w-full h-full">
                          <video
                            src={`${cleanSrc}#t=0.5`}
                            muted
                            playsInline
                            preload="auto"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent flex items-center justify-center group-hover:from-slate-950/30 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-white ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-red-600/90 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-wider shadow">
                            ▶ Video Reel
                          </span>
                        </div>
                      ) : (
                        <img
                          src={cleanSrc}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                            {item.category ? item.category.toUpperCase() : 'PROJECT'}
                          </span>
                          {item.year && <span className="text-[11px] font-bold text-slate-400">{item.year}</span>}
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 whitespace-pre-line">
                          {item.description}
                        </p>
                      </div>
                      {item.system && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                          <span className="truncate max-w-[200px]">{item.system}</span>
                          <span className="text-red-600 font-bold group-hover:underline">
                            {currentLanguage.code === 'ar' ? 'عرض التفاصيل ←' : currentLanguage.code === 'ckb' ? 'بینینی وردەکاری ←' : 'Inspect →'}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                </AnimatedContent>
              );
            })}
          </div>
        ) : (
          /* Homepage: 3D Liquid Lens FlexCarousel with Instant Click Detail & Video Pop-up */
          <div className="space-y-6">
            <div className="relative w-full rounded-3xl bg-slate-950/5 border border-slate-200/80 shadow-inner overflow-hidden py-4 my-2">
              <div className="w-full h-[520px] sm:h-[580px] relative">
                <FlexCarousel
                  items={featuredCarouselItems}
                  preset="liquid"
                  intro="rise"
                  cardHeight={0.36}
                  gap={14}
                  radius={20}
                  squeeze={0.2}
                  focusOnClick={false}
                  captions={true}
                  captureWheel={false}
                  onSelect={handleCarouselSelect}
                />
              </div>
              <div className="text-center py-2.5 px-4 text-xs font-bold text-slate-600 bg-slate-100/70 border-t border-slate-200/60 flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span>{currentLanguage.code === 'ar' ? 'اسحب للتنقل بين الصور والفيديوهات • اضغط على أي بطاقة لعرض الفيديو والتفاصيل' : currentLanguage.code === 'ckb' ? 'ڕابکێشە بۆ گەڕان لە وێنە و ڤیدیۆکان • کلیک لەسەر هەر کاردێک بکە بۆ لێدانی ڤیدیۆ و بینینی وردەکاری' : 'Drag to explore images & videos • Click any card or title to inspect full project & video'}</span>
              </div>
            </div>

            {items.length > 6 && onShowAll && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onShowAll}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <span>{t('gallery_show_all').replace('{count}', String(items.length))}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Detail & Video Player Bottom-to-Top Slide-Up Sheet */}
      {selected && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[999999] flex flex-col justify-end bg-slate-950/70 backdrop-blur-sm drawer-backdrop-anim"
          onClick={closeItemModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            dir="ltr"
            className="relative w-full max-w-6xl mx-auto flex flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-[0_-25px_80px_-15px_rgba(15,23,42,0.45)] border-t border-x border-slate-200/80 max-h-[90vh] sheet-slide-up-anim text-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Top Sheet Header Bar: Drag Handle Pill & Sleek Close Button */}
            <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-slate-100 bg-white shrink-0">
              <div className="w-9" aria-hidden="true" />
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label={t('ui_close') || 'Close'}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-600 text-slate-700 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* Sheet Body: 2-Column Architectural Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 p-5 sm:p-8 overflow-y-auto items-center">
              {/* Left Column: Generous Media Showcase (Photo or Video) */}
              <div className="lg:col-span-7 relative w-full h-[300px] sm:h-[420px] lg:h-[480px] rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center shadow-inner border border-slate-200/20 shrink-0">
                <img
                  src={selected.src.startsWith('./') ? selected.src.replace('./', '/') : selected.src}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                />

                {selected.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(selected.src) ? (
                  <video
                    src={selected.src.startsWith('./') ? selected.src.replace('./', '/') : selected.src}
                    controls
                    autoPlay
                    playsInline
                    className="relative z-10 max-h-full max-w-full object-contain"
                  />
                ) : (
                  <img
                    src={selected.src.startsWith('./') ? selected.src.replace('./', '/') : selected.src}
                    alt={selected.title}
                    className="relative z-10 max-h-full max-w-full object-contain"
                  />
                )}
              </div>

              {/* Right Column: Editorial Project Info & Right-Aligned WhatsApp Button */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6 text-start">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-[11px] font-extrabold uppercase tracking-wider">
                      <bdi dir="auto">{selected.category || 'Architectural Project'}</bdi>
                    </span>
                    {selected.year && (
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                        {selected.year}
                      </span>
                    )}
                  </div>

                  <h3 dir="auto" className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug">
                    {localize(items.find(item => item.id === selected.id) || selected).title}
                  </h3>

                  <p dir="auto" className="text-sm sm:text-base leading-[1.8] text-slate-600 font-normal whitespace-pre-line">
                    {localize(items.find(item => item.id === selected.id) || selected).description}
                  </p>
                </div>

                {/* Action Bar: All Products on Left, Modern WhatsApp Button on Right */}
                <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(null);
                      if (onBack) onBack();
                      window.location.hash = '#products';
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    className="py-2.5 px-5 rounded-full bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>
                      <bdi dir="auto">
                        {currentLanguage.code === 'ar'
                          ? 'جميع المنتجات'
                          : currentLanguage.code === 'ckb'
                          ? 'گشت بەرهەمەکان'
                          : currentLanguage.code === 'kmr'
                          ? 'Hemû Berhem'
                          : currentLanguage.code === 'tr'
                          ? 'Tüm Ürünler'
                          : 'All Products'}
                      </bdi>
                    </span>
                  </button>

                  <a
                    href={`https://wa.me/9647507388748?text=${encodeURIComponent(`Hello Doorhome, I am inquiring about this project: ${selected.title}. System: ${selected.system || 'Standard'}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-cta-btn ms-auto"
                  >
                    <span className="wa-icon-badge" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.758.459 3.473 1.331 4.988L2 22l5.188-1.361c1.464.799 3.111 1.221 4.843 1.221h.004c5.515 0 9.965-4.453 9.965-9.969 0-2.664-1.037-5.168-2.92-7.051C17.197 3.037 14.693 2 12.031 2zm5.822 14.279c-.246.693-1.434 1.326-1.988 1.409-.508.076-1.15.109-1.856-.115-.428-.136-.979-.318-1.682-.622-2.961-1.278-4.895-4.26-5.043-4.458-.148-.197-1.205-1.603-1.205-3.058 0-1.455.763-2.171 1.034-2.467.271-.296.591-.37.788-.37.197 0 .394.002.566.01.182.009.426-.069.666.508.246.592.838 2.047.912 2.195.074.148.123.321.025.518-.099.198-.148.321-.296.494-.148.172-.311.385-.444.518-.148.148-.302.309-.13.605.173.296.766 1.264 1.645 2.048 1.13 1.008 2.083 1.32 2.379 1.468.296.148.468.123.641-.074.172-.197.739-.863.936-1.159.197-.296.394-.247.665-.148.271.099 1.725.814 2.021.962.296.148.493.222.567.345.074.123.074.715-.172 1.408z" />
                      </svg>
                    </span>
                    <span>
                      <bdi dir="auto">
                        {currentLanguage.code === 'ar'
                          ? 'تواصل عبر واتساب'
                          : currentLanguage.code === 'ckb'
                          ? 'پەیوەندی لە واتسئەپ'
                          : currentLanguage.code === 'kmr'
                          ? 'Li ser WhatsAppê biaxive'
                          : currentLanguage.code === 'tr'
                          ? 'WhatsApp’tan Yazın'
                          : 'Chat on WhatsApp'}
                      </bdi>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default GallerySection;
