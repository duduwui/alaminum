import React, { useState } from 'react';
import { DOORHOME_CONTACT } from '../data/winhomeData';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare,
  Building,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface AlumilContactPageProps {
  onBackToHome: () => void;
  onOpenQuoteModal?: () => void;
}

export const AlumilContactPage: React.FC<AlumilContactPageProps> = ({
  onBackToHome,
  onOpenQuoteModal
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const resolvedCountry = formData.country === 'Other' ? (customCountry.trim() || 'Other') : formData.country;
    const resolvedReason = formData.reason === 'Other' ? (customReason.trim() || 'Other') : formData.reason;

    // Store in localStorage inquiry inquiries queue
    setTimeout(() => {
      const existingInquiries = JSON.parse(localStorage.getItem('winhome_inquiries') || '[]');
      const newInquiry = {
        id: `inq-${Date.now()}`,
        ...formData,
        country: resolvedCountry,
        reason: resolvedReason,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem('winhome_inquiries', JSON.stringify([newInquiry, ...existingInquiries]));
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const activeReason = formData.reason === 'Other' ? (customReason.trim() || 'Other') : formData.reason;
  const rawPhone = (DOORHOME_CONTACT.hotlineRaw || '+9647504440402').replace('+', '');
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    `Hello Doorhome Erbil, my name is ${formData.firstName || 'Client'} and I would like to inquire regarding: ${formData.subject || activeReason || 'Architectural Systems'}.`
  )}`;

  return (
    <div className="bg-white min-h-screen text-[#3E4346] pt-4 pb-20">
      {/* 1. Breadcrumbs Header (Alumil style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-100">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <button
            onClick={onBackToHome}
            className="hover:text-red-600 transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-bold">Contact Us</span>
        </nav>
      </div>

      {/* 2. Main Title & Share Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#3E4346] tracking-tight">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl font-normal leading-relaxed">
              We are at your disposal for any question, architectural consultation, or quotation regarding Doorhome certified uPVC & Aluminum solutions in Iraq.
            </p>
          </div>

          {/* Social Share Buttons (Alumil exact) */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Share:
            </span>
            <a
              href="https://www.facebook.com/sharer.php"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-600 hover:text-white text-slate-600 flex items-center justify-center transition-all cursor-pointer"
              title="Share on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com/share"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 flex items-center justify-center transition-all cursor-pointer"
              title="Share on Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/shareArticle"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-700 hover:text-white text-slate-600 flex items-center justify-center transition-all cursor-pointer"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Main Form & Showroom Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Alumil Exact Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-red-600">
                Inquiry Form
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#3E4346] mt-1">
                Send Us a Direct Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Please complete all required fields (*) and our technical consultants will respond within 24 hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-emerald-950">
                  Message Sent Successfully!
                </h3>
                <p className="text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-bold">{formData.firstName} {formData.lastName}</span>. Your inquiry regarding "{formData.subject || formData.reason || 'General Request'}" has been forwarded to our Erbil engineering desk.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp Instantly</span>
                  </a>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        firstName: '',
                        lastName: '',
                        country: '',
                        city: '',
                        phone: '',
                        email: '',
                        reason: '',
                        subject: '',
                        comments: '',
                        acceptTerms: false
                      });
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="First Name"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Last Name"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Row 2: Country & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      Country *
                    </label>
                    <select
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-white text-slate-900 text-sm outline-none transition-all"
                    >
                      <option value="">Select Country</option>
                      <option value="Iraq">Iraq</option>
                      <option value="Turkey">Turkey</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Jordan">Jordan</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Germany">Germany</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Other">Other Region</option>
                    </select>

                    {formData.country === 'Other' && (
                      <div className="mt-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        <label className="block text-[11px] font-bold text-red-600 mb-1">
                          Specify Your Country / Region *
                        </label>
                        <input
                          type="text"
                          required
                          value={customCountry}
                          onChange={(e) => setCustomCountry(e.target.value)}
                          placeholder="Type your country or territory name..."
                          className="w-full px-3.5 py-2 rounded-lg border-2 border-red-400 focus:border-red-600 bg-red-50/40 text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all font-semibold"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      City / Governorate *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City / Governorate"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Row 3: Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email Address"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      Phone / Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone Number"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Row 4: Contact Reason (Alumil exact dropdown) */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Contact Reason *
                  </label>
                  <select
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-white text-slate-900 text-sm outline-none transition-all"
                  >
                    <option value="">Select a reason</option>
                    <option value="Get a Quote">Get a Quote</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="General Question">General Question</option>
                    <option value="Showroom Consultation">Showroom Consultation (Erbil)</option>
                    <option value="Architectural Specifications & CAD">Architectural Specifications & CAD</option>
                    <option value="Update your business details">Update your business details</option>
                    <option value="Other">Other</option>
                  </select>

                  {formData.reason === 'Other' && (
                    <div className="mt-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <label className="block text-[11px] font-bold text-red-600 mb-1">
                        Specify Your Reason / Topic *
                      </label>
                      <input
                        type="text"
                        required
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Type your inquiry topic or custom reason..."
                        className="w-full px-3.5 py-2 rounded-lg border-2 border-red-400 focus:border-red-600 bg-red-50/40 text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all font-semibold"
                      />
                    </div>
                  )}
                </div>

                {/* Row 5: Subject */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Subject"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>

                {/* Row 6: Comments / Message */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Comments / Project Specifications *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    placeholder="Your message or project specifications..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all resize-y"
                  />
                </div>

                {/* Row 7: Accept Terms Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 mt-0.5"
                    />
                    <span className="text-xs text-slate-600 leading-normal">
                      I have read and accept the <span className="text-red-600 font-bold underline">Terms of Use</span> and consent to Doorhome processing my details for this inquiry.
                    </span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Prefer direct WhatsApp? Chat now</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Showroom Headquarters, Plant, & Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headquarters Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-600">
                <Building className="w-4 h-4" />
                <span>Doorhome Location</span>
              </div>
              
              <h3 className="text-xl font-black text-slate-900">
                Doorhome Company by Nafza Almanzl
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 block">Address:</span>
                    <span className="text-slate-600 block">{DOORHOME_CONTACT.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Working Hours:</span>
                    <span className="text-slate-600">{DOORHOME_CONTACT.workHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Sales Hotline:</span>
                    <a href={`tel:${DOORHOME_CONTACT.hotlineRaw}`} className="text-red-600 font-bold hover:underline">
                      {DOORHOME_CONTACT.hotline}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Email Inquiries:</span>
                    <a href={`mailto:${DOORHOME_CONTACT.email}`} className="text-red-600 font-bold hover:underline">
                      {DOORHOME_CONTACT.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Plant & Regional Hubs Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Regional Hubs in Kurdistan
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block">Sulaymaniyah Hub</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">Commercial & Villa Projects</span>
                  <span className="text-red-600 font-semibold block mt-1">+964 750 555 0402</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block">Duhok Hub</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">Architectural Deliveries</span>
                  <span className="text-red-600 font-semibold block mt-1">+964 750 333 0402</span>
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-red-600" />
                  <span>Doorhome GPS Navigation</span>
                </span>
                <a
                  href={DOORHOME_CONTACT.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-600 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <iframe
                title="Doorhome Location Map"
                src={DOORHOME_CONTACT.mapEmbedUrl}
                className="w-full h-[220px] border-0"
                loading="lazy"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
