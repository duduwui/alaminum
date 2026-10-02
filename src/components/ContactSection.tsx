import React, { useState } from 'react';
import { DOORHOME_CONTACT } from '../data/winhomeData';
import {
  MapPin,
  ExternalLink,
  Clock,
  Phone
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactSectionProps {
  onOpenQuoteModal?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const [mapReady, setMapReady] = useState(false);
  const { currentLanguage, t } = useLanguage();
  const isRtl = ['ckb', 'kmr', 'ar'].includes(currentLanguage.code);

  return (
    <section id="contact" className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 border-t border-slate-200 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-red-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 dh-reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-white" />
            <span><bdi dir="auto">{t('contact_badge') || 'Location & Showroom'}</bdi></span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#3E4346] tracking-tight">
            <bdi dir="auto">{t('contact_title')}</bdi>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-medium">
            <bdi dir="auto">{t('contact_desc')}</bdi>
          </p>
        </div>

        {/* Showroom Location, Working Hours & Interactive Map Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dh-reveal mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left/Details: Working hours, Phone and Address */}
            <div className="lg:col-span-5 p-7 sm:p-9 flex flex-col justify-center space-y-6 border-b lg:border-b-0 lg:border-e border-slate-200">
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-black uppercase tracking-wider mb-2 border border-red-100">
                    <MapPin className="w-3.5 h-3.5" />
                    <span><bdi dir="auto">{t('location_card_title')}</bdi></span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    <bdi dir="auto">{t('location_card_title')}</bdi>
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                    <bdi dir="auto">{t('address_line')}</bdi>
                  </p>
                </div>

                {/* Direct Hotline Phone */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <Phone className="w-5 h-5 text-red-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('phone_label') || 'Phone / Hotline'}</span>
                    <a href={`tel:${DOORHOME_CONTACT.hotlineRaw}`} dir="ltr" className="text-xs sm:text-sm font-black text-slate-800 hover:text-red-600 transition-colors truncate block">
                      {DOORHOME_CONTACT.hotline}
                    </a>
                  </div>
                </div>

                {/* Working Hours Box */}
                <div className="flex items-start gap-3.5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 border border-slate-200/80" dir={isRtl ? 'rtl' : 'ltr'}>
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <div className="space-y-1.5">
                    <span className="block font-black text-slate-900 text-xs sm:text-sm"><bdi dir="auto">{t('working_hours_label')}</bdi></span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 m-0 leading-snug">
                      <bdi dir="auto">{t('footer_working_hours_time')}</bdi>
                    </p>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-black">
                      <bdi dir="auto">{t('footer_working_hours_days')}</bdi>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right/Map Embed */}
            <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[420px] bg-slate-100 overflow-hidden">
              <a
                href={DOORHOME_CONTACT.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[linear-gradient(30deg,transparent_45%,#cbd5db_46%,#cbd5db_49%,transparent_50%),linear-gradient(120deg,transparent_42%,#cbd5db_43%,#cbd5db_46%,transparent_47%)] bg-[length:70px_70px] text-slate-700"
                aria-hidden={mapReady}
                tabIndex={mapReady ? -1 : 0}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
                  <MapPin className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold shadow-sm">
                  <bdi dir="auto">{t('open_maps_btn')}</bdi>
                </span>
              </a>
              <iframe
                title={t('location_card_title')}
                src={DOORHOME_CONTACT.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={(event) => {
                  try {
                    setMapReady(event.currentTarget.contentDocument === null);
                  } catch {
                    setMapReady(true);
                  }
                }}
                className={`absolute inset-0 h-full w-full border-0 transition-opacity ${
                  mapReady ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Open in Google Maps Button Placed Directly Below Location Card */}
        <div className="max-w-md mx-auto text-center dh-reveal">
          <a
            href={DOORHOME_CONTACT.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-red-600/25 transition-all cursor-pointer"
          >
            <MapPin className="w-5 h-5" />
            <span><bdi dir="auto">{t('open_maps_btn') || 'Open in Google Maps'}</bdi></span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
