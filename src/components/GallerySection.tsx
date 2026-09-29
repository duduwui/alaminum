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
      if (Array.isArray(cmsItems) && cmsItems.length > 0) {
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

  // Curated blend of top images AND videos for the 3D Carousel
  const featuredCarouselItems: FlexCarouselItem[] = useMemo(() => {
    const images = visibleItems.filter((it) => it.mediaType === 'image' || !it.mediaType);
    const videos = visibleItems.filter((it) => it.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(it.src));
    
    const blended: GalleryMediaItem[] = [];
    let imgIdx = 0;
    let vidIdx = 0;

    // Interleave images and videos: 2 images, 1 video, 2 images, 1 video...
    while (blended.length < 12 && (imgIdx < images.length || vidIdx < videos.length)) {
      if (imgIdx < images.length) blended.push(images[imgIdx++]);
      if (imgIdx < images.length) blended.push(images[imgIdx++]);
      if (vidIdx < videos.length) blended.push(videos[vidIdx++]);
    }

    // Fallback if blended is empty
    const sourceList = blended.length > 0 ? blended : visibleItems.slice(0, 10);

    return sourceList.map((item) => {
      let cleanSrc = item.src;
      if (cleanSrc.startsWith('./')) {
        cleanSrc = cleanSrc.replace('./', '/');
      }
      const isVideo = item.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(cleanSrc);
      const subtitleText = isVideo
        ? (currentLanguage.code === 'ar' ? 'فيديو معماري • اضغط لتشغيل الفيديو' : currentLanguage.code === 'ckb' ? 'ڤیدیۆی نژیاروانی • کلیک بکە بۆ لێدان' : 'Architectural Video • Click to Play')
        : (item.system || item.location || 'Doorhome Architectural System');

      return {
        id: item.id,
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
                        <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
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
              <div className="w-full h-[480px] sm:h-[560px] relative">
                <FlexCarousel
                  items={featuredCarouselItems}
                  preset="liquid"
                  intro="rise"
                  cardHeight={0.52}
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

      {/* Project Detail & Video Player Bottom-Up Slide Sheet (Mounted directly to body via portal) */}
      {selected && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4 drawer-backdrop-anim"
          onClick={closeItemModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            dir={['ckb', 'fa', 'ar'].includes(currentLanguage.code) ? 'rtl' : 'ltr'}
            className="relative flex max-h-[88vh] sm:max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[2rem] sm:rounded-[2rem] bg-white shadow-2xl border-t sm:border border-slate-200/80 bottom-sheet-slide-anim text-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Grab Drag Indicator Handle on top */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label={t('ui_close') || 'Close'}
              className="absolute right-4 top-4 z-20 rounded-full bg-slate-900/70 hover:bg-red-600 text-white p-2.5 backdrop-blur-md transition-colors cursor-pointer shadow-lg"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Media Display (Video or Image) */}
            <div className="relative flex max-h-[38vh] sm:max-h-[44vh] w-full items-center justify-center bg-slate-950 p-2 overflow-hidden shrink-0">
              {selected.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(selected.src) ? (
                <video
                  src={selected.src.startsWith('./') ? selected.src.replace('./', '/') : selected.src}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[34vh] sm:max-h-[40vh] w-full rounded-xl bg-black object-contain"
                />
              ) : (
                <img
                  src={selected.src.startsWith('./') ? selected.src.replace('./', '/') : selected.src}
                  alt={selected.title}
                  className="max-h-[34vh] sm:max-h-[40vh] w-full object-contain rounded-xl"
                />
              )}
            </div>

            {/* Content & Action Buttons with Generous Spacing */}
            <div className="flex flex-col justify-between space-y-5 overflow-y-auto p-6 sm:p-8 bg-white text-slate-900">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="inline-block px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-wider border border-red-100">
                    {selected.category ? selected.category.toUpperCase() : 'PROJECT CASE STUDY'}
                    {(selected.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(selected.src)) && ' • VIDEO REEL'}
                  </span>
                  {selected.system && (
                    <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
                      {selected.system}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {localize(items.find(item => item.id === selected.id) || selected).title}
                </h3>
                <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-slate-600">
                  {localize(items.find(item => item.id === selected.id) || selected).description}
                </p>
              </div>

              {/* Action Buttons: Large, Bold, and Spacious */}
              <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <a
                  href={`https://wa.me/9647507388748?text=${encodeURIComponent(`Hello Doorhome, I am inquiring about this project: ${selected.title}. System: ${selected.system || 'Standard'}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn2 btn2-emerald btn2-lg !text-sm sm:!text-base font-black flex-1 justify-center py-3 sm:py-3.5 px-6 shadow-sm"
                >
                  <span className="spn2 text-emerald-700 font-extrabold flex items-center justify-center gap-3 py-1">
                    <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{currentLanguage.code === 'ar' ? 'تواصل عبر واتساب' : currentLanguage.code === 'ckb' ? 'پەیوەندی بە واتسئەپ' : 'Inquire on WhatsApp'}</span>
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    if (onBack) onBack();
                    window.location.hash = '#products';
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="btn2 btn2-lg !text-sm sm:!text-base font-black flex-1 justify-center py-3 sm:py-3.5 px-6 shadow-sm"
                >
                  <span className="spn2 text-slate-900 font-extrabold flex items-center justify-center gap-3 py-1">
                    <LayoutGrid className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{currentLanguage.code === 'ar' ? 'تصفح جميع المنتجات' : currentLanguage.code === 'ckb' ? 'بینینی گشت بەرهەمەکان' : 'See All Products'}</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="btn2 !text-xs sm:!text-sm font-bold text-slate-500 justify-center py-2 sm:py-2.5 px-4"
                >
                  <span className="spn2 text-slate-500 py-1">
                    {t('ui_close') || 'Close'}
                  </span>
                </button>
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
