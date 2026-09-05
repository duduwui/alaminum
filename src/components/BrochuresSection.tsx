import React, { useState } from 'react';
import { BROCHURES_DATA, BrochureItem, WINHOME_CONTACT } from '../data/winhomeData';
import { Download, FileText, CheckCircle2, MessageSquare } from 'lucide-react';

interface BrochuresSectionProps {
  onOpenQuote: (subject: string) => void;
}

export const BrochuresSection: React.FC<BrochuresSectionProps> = ({ onOpenQuote }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (brochure: BrochureItem) => {
    setDownloadSuccess(brochure.id);
    setTimeout(() => setDownloadSuccess(null), 3500);

    const targetUrl = brochure.coverImage;
    window.open(targetUrl, '_blank');
  };

  return (
    <section id="brochures" className="py-20 text-slate-900 border-b border-slate-200 relative overflow-hidden bg-slate-100">
      {/* Mobile background image */}
      <div
        className="block md:hidden absolute inset-0 bg-cover bg-center pointer-events-none z-0"
        style={{ backgroundImage: "url('/assets/winhome/mobileV.jpg')" }}
      />
      {/* Laptop / Desktop background image */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center pointer-events-none z-0"
        style={{ backgroundImage: "url('/assets/winhome/laptopv.jpg')" }}
      />
      {/* Soft overlay for crisp contrast */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] pointer-events-none z-0" />

      {/* Subtle Blueprint Mesh Glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            Official Technical Catalogues & Brochures
          </h2>
          <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed font-semibold">
            Download comprehensive profile CAD drawings, inertia tables, CE certificates, and European hardware installation guides for your architectural projects.
          </p>
        </div>

        {/* Brochures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BROCHURES_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-blue-500/60 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-[4/3] bg-slate-950 p-6 flex items-center justify-center border-b border-slate-800 overflow-hidden">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== item.fallbackCover) {
                        target.src = item.fallbackCover;
                      }
                    }}
                    className="max-h-full max-w-full object-contain rounded-md shadow-sm transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded shadow-xs">
                    {item.origin}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-slate-900/90 text-slate-300 text-[11px] font-semibold px-2.5 py-0.5 rounded border border-slate-700 shadow-xs">
                    {item.fileSize}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      {item.brand}
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1 leading-snug group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                      Included Specifications:
                    </span>
                    <ul className="space-y-1">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => handleDownload(item)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    downloadSuccess === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {downloadSuccess === item.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Catalogue Opened</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download PDF ({item.pages} Pages)</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/${WINHOME_CONTACT.hotlineRaw.replace('+', '')}?text=Hello%20Winhome,%20please%20send%20me%20the%20technical%20CAD%20drawings%20for%20${encodeURIComponent(item.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center gap-1.5 border border-slate-800 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>Request Full CAD Archive via WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
