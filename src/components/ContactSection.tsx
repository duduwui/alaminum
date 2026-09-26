import React, { useState } from 'react';
import { DOORHOME_CONTACT } from '../data/winhomeData';
import {
  Send,
  CheckCircle2,
  MessageSquare,
  MapPin,
  ExternalLink,
  Clock,
  Phone
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactSectionProps {
  onOpenQuoteModal?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenQuoteModal }) => {
  // Inquiry Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: 'Iraq',
    city: '',
    phone: '',
    email: '',
    reason: '',
    subject: '',
    comments: '',
    acceptTerms: false
  });

  const [customCountry, setCustomCountry] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const { currentLanguage, t } = useLanguage();
  const isRtl = ['ckb', 'kmr', 'ar'].includes(currentLanguage.code);
  const workHours = currentLanguage.code === 'ar'
    ? DOORHOME_CONTACT.workHoursArabic
    : ['ckb', 'kmr'].includes(currentLanguage.code)
      ? DOORHOME_CONTACT.workHoursKurdish
      : DOORHOME_CONTACT.workHours;

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const resolvedCountry = formData.country === 'Other' ? (customCountry.trim() || 'Other') : formData.country;
    const resolvedReason = formData.reason === 'Other' ? (customReason.trim() || 'Other') : formData.reason;

    try {
      const response = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        id: `INQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        kind: 'contact', createdAt: new Date().toISOString(), status: 'new', items: [], totalQuantity: 0, totalAreaSqm: 0,
        customer: { fullName: `${formData.firstName} ${formData.lastName}`.trim(), firstName: formData.firstName, lastName: formData.lastName, phone: formData.phone, email: formData.email, city: formData.city || resolvedCountry, country: resolvedCountry, projectType: resolvedReason, timeline: '', serviceNeeded: formData.subject, preferredContact: 'phone', additionalNotes: formData.comments }
      }) });
      if (!response.ok) throw new Error('Could not send your message. Please try again.');
      setIsSubmitted(true);
    } catch (error: any) { setSubmitError(error.message || 'Could not send your message.'); }
    finally { setIsSubmitting(false); }
  };

  const activeReason = formData.reason === 'Other' ? (customReason.trim() || 'Other') : formData.reason;
  const rawPhone = (DOORHOME_CONTACT.hotlineRaw || '+9647507388748').replace('+', '');
  const whatsappDirectUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    `Hello Doorhome, my name is ${formData.firstName || 'Client'} and I would like to inquire about: ${formData.subject || activeReason || 'Architectural Systems'}.`
  )}`;

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 border-t border-slate-200 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-red-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {submitError && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{submitError}</p>}
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <MessageSquare className="w-3.5 h-3.5 text-white" />
            <span>{t('contact_badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#3E4346] tracking-tight">
            {t('contact_title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed font-medium">
            {t('contact_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-red-600">
                Inquiry &amp; Request Form
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {t('form_title')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t('form_desc')}
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-emerald-950">
                  {t('msg_sent_title')}
                </h4>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-bold">{formData.firstName} {formData.lastName}</span>. Your inquiry regarding "{formData.subject || formData.reason || 'General Request'}" has been forwarded to our engineering team.
                </p>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t('chat_whatsapp_btn')}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        firstName: '',
                        lastName: '',
                        country: 'Iraq',
                        city: '',
                        phone: '',
                        email: '',
                        reason: '',
                        subject: '',
                        comments: '',
                        acceptTerms: false
                      });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs font-bold text-slate-700">
                {/* Row 1: Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-800 uppercase text-[10px]">{t('first_name_label')}</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Mohammed"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-800 uppercase text-[10px]">{t('last_name_label')}</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Ali"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                {/* Row 2: Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-800 uppercase text-[10px]">{t('phone_label')}</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+964 750 XXX XXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-800 uppercase text-[10px]">{t('email_label')}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                {/* Row 3: Country & Contact Reason */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-800 uppercase text-[10px]">{t('country_label')}</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-semibold"
                    >
                      <option value="Iraq">Iraq</option>
                      <option value="Turkey">Turkey</option>
                      <option value="Germany">Germany</option>
                      <option value="UAE">United Arab Emirates</option>
                      <option value="Other">Other</option>
                    </select>
                    {formData.country === 'Other' && (
                      <input
                        type="text"
                        required
                        value={customCountry}
                        onChange={(e) => setCustomCountry(e.target.value)}
                        placeholder="Type your country name..."
                        className="w-full mt-2 px-3.5 py-2 rounded-xl border border-red-400 bg-red-50/40 text-slate-900 font-semibold text-xs"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-800 uppercase text-[10px]">{t('inquiry_label')}</label>
                    <select
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-semibold"
                    >
                      <option value="">Select Reason</option>
                      <option value="Quotation Request">Quotation Request</option>
                      <option value="Architectural Specification">Architectural Specification</option>
                      <option value="Showroom Visit">Showroom Visit</option>
                      <option value="Partnership / Dealer">Partnership / Dealer</option>
                      <option value="Other">Other</option>
                    </select>
                    {formData.reason === 'Other' && (
                      <input
                        type="text"
                        required
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Type your inquiry topic..."
                        className="w-full mt-2 px-3.5 py-2 rounded-xl border border-red-400 bg-red-50/40 text-slate-900 font-semibold text-xs"
                      />
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block mb-1 text-slate-800 uppercase text-[10px]">{t('message_label')}</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    placeholder="Describe your window, door, facade, or hardware requirements..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? '...' : t('send_msg_btn')}</span>
                </button>
              </form>
            )}
          </div>
          </div>

          <aside className="overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-[0_24px_65px_-32px_rgba(159,18,57,0.4)] lg:col-span-5" aria-label={t('showroom_title')}>
            <div className="bg-gradient-to-br from-[#a9162e] via-[#d31932] to-[#f04448] p-6 text-white sm:p-7">
              <h3 className="text-2xl font-black">{t('location_card_title')}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/90">{t('address_line')}</p>
            </div>
            <div className="space-y-4 p-6 sm:p-7">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div><span className="block font-extrabold text-slate-900">{t('working_hours_label')}</span><span>{workHours}</span></div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {DOORHOME_CONTACT.branches.sales.phones.map((phone, index) => (
                  <a key={phone} href={`tel:${DOORHOME_CONTACT.branches.sales.phonesRaw[index]}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-800 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"><Phone className="h-4 w-4 shrink-0 text-red-600" />{phone}</a>
                ))}
              </div>
              <div className="relative h-48 overflow-hidden rounded-2xl border border-slate-200 bg-[#e8edf0]">
                <a href={DOORHOME_CONTACT.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[linear-gradient(30deg,transparent_45%,#cbd5db_46%,#cbd5db_49%,transparent_50%),linear-gradient(120deg,transparent_42%,#cbd5db_43%,#cbd5db_46%,transparent_47%)] bg-[length:70px_70px] text-slate-700" aria-hidden={mapReady} tabIndex={mapReady ? -1 : 0}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg"><MapPin className="h-6 w-6" /></span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold shadow-sm">{t('open_maps_btn')}</span>
                </a>
                <iframe title={t('location_card_title')} src={DOORHOME_CONTACT.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" onLoad={(event) => {
                  try { setMapReady(event.currentTarget.contentDocument === null); } catch { setMapReady(true); }
                }} className={`absolute inset-0 h-full w-full border-0 transition-opacity ${mapReady ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
              </div>
              <a href={DOORHOME_CONTACT.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-extrabold text-white shadow-md shadow-red-600/15 transition-colors hover:bg-red-700">{t('open_maps_btn')}<ExternalLink className="h-4 w-4" /></a>
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
