import React, { useEffect, useState } from 'react';
import { ArrowLeft, Play, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GalleryMediaItem, loadGalleryItems } from '../services/galleryContentService';

const PREVIEW_COUNT = 12;

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
    window.addEventListener('cms_gallery_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('cms_gallery_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const localize = (item: GalleryMediaItem) => {
    const text = item.translations?.[currentLanguage.code] || item.translations?.[currentLanguage.code.split('-')[0]];
    return text ? { ...item, title: text.title || text.name || item.title, description: text.description || item.description } : item;
  };
  const visibleItems = (fullPage ? items : items.slice(0, PREVIEW_COUNT)).map(localize);

  return (
    <section id={fullPage ? 'projects-page' : 'gallery'} className={`w-full bg-[radial-gradient(ellipse_at_0%_0%,rgba(220,38,38,0.045),transparent_32%),#fff] py-16 sm:py-24 ${fullPage ? 'min-h-screen' : ''}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {fullPage && onBack && (
          <button type="button" onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-red-600">
            <ArrowLeft className="h-4 w-4" /> Doorhome
          </button>
        )}
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">{t('gallery_title')}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{t('gallery_desc')}</p>
        </div>

        {items.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">{t('gallery_empty')}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-shadow hover:shadow-lg"
                aria-label={item.title}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  {item.mediaType === 'video' ? (
                    <video src={item.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                  ) : (
                    <img src={item.src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                  {item.mediaType === 'video' && <Play aria-hidden="true" className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg" />}
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {!fullPage && items.length > PREVIEW_COUNT && onShowAll && (
          <button
            type="button"
            onClick={onShowAll}
            className="mx-auto mt-8 block rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-800 hover:border-red-500 hover:text-red-600"
          >
            {t('gallery_show_all').replace('{count}', String(items.length))}
          </button>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-6" onClick={() => setSelected(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            dir={['ckb', 'fa', 'ar'].includes(currentLanguage.code) ? 'rtl' : 'ltr'}
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:flex-row"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" onClick={() => setSelected(null)} aria-label={t('ui_close')} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2.5 text-slate-700 shadow-md hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
            <div className="flex min-h-[260px] items-center justify-center bg-slate-900 md:w-1/2">
              {selected.mediaType === 'video' ? (
                <video src={selected.src} controls autoPlay playsInline className="max-h-[55vh] w-full" />
              ) : (
                <img src={selected.src} alt={selected.title} className="max-h-[55vh] w-full object-contain" />
              )}
            </div>
            <div className="space-y-4 overflow-y-auto p-6 sm:p-8 md:w-1/2">
              <h3 className="pr-8 text-xl font-black text-slate-900 sm:text-2xl">{localize(items.find(item => item.id === selected.id) || selected).title}</h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{localize(items.find(item => item.id === selected.id) || selected).description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
