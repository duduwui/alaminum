import React, { useState } from 'react';
import { BROCHURES_DATA, BrochureItem, DOORHOME_CONTACT } from '../data/winhomeData';
import { Download, FileText, CheckCircle2, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BrochuresSectionProps {
  onOpenQuote: (subject: string) => void;
}

export const BrochuresSection: React.FC<BrochuresSectionProps> = ({ onOpenQuote }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleDownload = (brochure: BrochureItem) => {
    setDownloadSuccess(brochure.id);
    setTimeout(() => setDownloadSuccess(null), 3500);

    const targetUrl = brochure.coverImage;
    window.open(targetUrl, '_blank');
  };

  return (
    <section id="brochures" className="py-16 sm:py-24 text-slate-900 border-b border-slate-200 relative overflow-hidden bg-slate-100">
      {/* Responsive Background Image (_ (4).jpeg) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
        style={{ backgroundImage: "url('./assets/doorhome/_ (4).jpeg')" }}
      />
      {/* Light translucent backdrop overlay for high image visibility and text readability */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] pointer-events-none z-0" />

      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-black text-white uppercase tracking-widest bg-red-600 px-3.5 py-1 rounded-full border border-red-500 shadow-xs inline-block mb-3">
            {t('brochures_badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#3E4346] leading-tight">
            {t('brochures_title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed font-semibold">
            {t('brochures_desc')}
          </p>
        </div>

        {/* Compact & Sleek Brochures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {BROCHURES_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-red-500 transition-all duration-300 flex flex-col justify-between overflow-hidden group p-5 sm:p-6"
            >
              <div>
                {/* Compact Cover Image Stage */}
                <div className="relative h-44 sm:h-52 w-full bg-slate-50/80 rounded-2xl p-4 flex items-center justify-center border border-slate-100 overflow-hidden mb-4">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== item.fallbackCover) {
                        target.src = item.fallbackCover;
                      }
                    }}
                    className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    {item.origin}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    {item.fileSize}
                  </div>
                </div>

                {/* Card Title & Brand */}
                <div className="space-y-1">
                  <span className="text-[11px] font-extrabold text-red-600 uppercase tracking-wider block">
                    {item.brand}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                {/* Short Description */}
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2 line-clamp-2">
                  {item.description}
                </p>

                {/* Included Specifications Pills */}
                <div className="mt-3.5 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    {t('key_specs_inc')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold text-slate-700 bg-slate-100/90 border border-slate-200/80 px-2.5 py-0.5 rounded-lg truncate max-w-full"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compact Action Buttons */}
              <div className="mt-5 space-y-2">
                <button
                  onClick={() => handleDownload(item)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98] ${
                    downloadSuccess === item.id
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
                  }`}
                >
                  {downloadSuccess === item.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('catalogue_opened')}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{t('download_pdf')} ({item.pages} Pages)</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/${(DOORHOME_CONTACT.hotlineRaw || '+9647504440402').replace('+', '')}?text=Hello%20Doorhome,%20please%20send%20me%20the%20technical%20CAD%20drawings%20for%20${encodeURIComponent(item.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 border border-slate-200/80 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-red-600" />
                  <span>{t('request_whatsapp_cad')}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
