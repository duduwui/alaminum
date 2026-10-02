import React, { useState } from 'react';
import { DOORHOME_CONTACT } from '../data/winhomeData';
import {
  MessageSquare,
  MapPin,
  ExternalLink,
  Clock,
  Phone,
  Building,
  Mail,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactSectionProps {
  onOpenQuoteModal?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenQuoteModal }) => {
  const [mapReady, setMapReady] = useState(false);
  const { currentLanguage, t } = useLanguage();
  const isRtl = ['ckb', 'kmr', 'ar'].includes(currentLanguage.code);

  const rawPhone = (DOORHOME_CONTACT.hotlineRaw || '+9647507388748').replace('+', '');
  const whatsappDirectUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    currentLanguage.code === 'ar'
      ? 'مرحباً شركة دور هوم، أود الاستفسار عن الأنظمة المعمارية وعروض الأسعار.'
      : currentLanguage.code === 'ckb'
      ? 'سڵاو کۆمپانیای دەرگای ماڵ، دەمەوێت پرسیار بکەم دەربارەی سیستەمەکان و نرخی پڕۆژە.'
      : 'Hello Doorhome, I would like to inquire about your architectural systems and quotation.'
  )}`;

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 border-t border-slate-200 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-red-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 dh-reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <MessageSquare className="w-3.5 h-3.5 text-white" />
            <span><bdi dir="auto">{t('contact_badge')}</bdi></span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#3E4346] tracking-tight">
            <bdi dir="auto">{t('contact_title')}</bdi>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed font-medium">
            <bdi dir="auto">{t('contact_desc')}</bdi>
          </p>
        </div>

        {/* Direct Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* 1. WhatsApp Instant Desk */}
          <div className="bg-white rounded-3xl border border-emerald-100 hover:border-emerald-300 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between dh-reveal dh-stagger-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <bdi dir="auto">{t('whatsapp_sub')}</bdi>
                </span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  <bdi dir="auto">{t('whatsapp_title')}</bdi>
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">
                  <bdi dir="auto">{t('whatsapp_desc')}</bdi>
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 space-y-2.5">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span><bdi dir="auto">{t('chat_whatsapp_btn')}</bdi></span>
              </a>
              <a
                href={`tel:${DOORHOME_CONTACT.hotlineRaw}`}
                className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-200"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span dir="ltr">{DOORHOME_CONTACT.hotline}</span>
              </a>
            </div>
          </div>

          {/* 2. Sales & Showroom Branch */}
          <div className="bg-white rounded-3xl border border-slate-200 hover:border-red-300 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between dh-reveal dh-stagger-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-2xs">
                  <Building className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                  <bdi dir="auto">{t('showroom_sub')}</bdi>
                </span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  <bdi dir="auto">{t('showroom_title')}</bdi>
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">
                  <bdi dir="auto">{t('showroom_desc')}</bdi>
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
              {DOORHOME_CONTACT.branches.sales.phones.map((phone, idx) => (
                <a
                  key={idx}
                  href={`tel:${DOORHOME_CONTACT.branches.sales.phonesRaw[idx]}`}
                  className="w-full py-2.5 px-3 bg-slate-50 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-between transition-all border border-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-red-600" />
                    <span>{idx === 0 ? (currentLanguage.code === 'ar' ? 'الخط المباشر' : currentLanguage.code === 'ckb' ? 'هێڵی ڕاستەوخۆ' : 'Direct Line') : (currentLanguage.code === 'ar' ? 'المبيعات' : currentLanguage.code === 'ckb' ? 'فرۆشتن' : 'Sales Desk')}</span>
                  </span>
                  <span dir="ltr" className="font-extrabold">{phone}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 3. Manufacturing & Fabrication Plant */}
          <div className="bg-white rounded-3xl border border-slate-200 hover:border-red-300 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between dh-reveal dh-stagger-3">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200 shadow-2xs">
                  <ShieldCheck className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  <bdi dir="auto">{t('plant_sub')}</bdi>
                </span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  <bdi dir="auto">{t('plant_title')}</bdi>
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">
                  <bdi dir="auto">{t('plant_desc')}</bdi>
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
              {DOORHOME_CONTACT.branches.manufacturing.phones.map((phone, idx) => (
                <a
                  key={idx}
                  href={`tel:${DOORHOME_CONTACT.branches.manufacturing.phonesRaw[idx]}`}
                  className="w-full py-2.5 px-3 bg-slate-50 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-between transition-all border border-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-red-600" />
                    <span>{idx === 0 ? (currentLanguage.code === 'ar' ? 'إدارة المصنع' : currentLanguage.code === 'ckb' ? 'بەڕێوەبەری کارگە' : 'Plant Desk') : (currentLanguage.code === 'ar' ? 'التصنيع والتسليم' : currentLanguage.code === 'ckb' ? 'دروستکردن و گەیاندن' : 'Fabrication')}</span>
                  </span>
                  <span dir="ltr" className="font-extrabold">{phone}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Showroom Location, Working Hours & Interactive Map */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dh-reveal">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left/Details: Working hours and Address */}
            <div className="lg:col-span-5 p-7 sm:p-9 flex flex-col justify-between space-y-6 border-b lg:border-b-0 lg:border-e border-slate-200">
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

                {/* Direct Email */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <Mail className="w-5 h-5 text-red-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('email_label')}</span>
                    <a href={`mailto:${DOORHOME_CONTACT.email}`} className="text-xs sm:text-sm font-black text-slate-800 hover:text-red-600 transition-colors truncate block">
                      {DOORHOME_CONTACT.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <a
                  href={DOORHOME_CONTACT.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span><bdi dir="auto">{t('open_maps_btn')}</bdi></span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {onOpenQuoteModal && (
                  <button
                    type="button"
                    onClick={onOpenQuoteModal}
                    className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span><bdi dir="auto">{t('nav_plan_project') || 'Request Project Quotation'}</bdi></span>
                    <ArrowRight className="w-3.5 h-3.5 text-red-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Right/Map Embed */}
            <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] bg-slate-100 overflow-hidden">
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
      </div>
    </section>
  );
};

export default ContactSection;
