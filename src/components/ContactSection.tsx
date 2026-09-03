import React, { useState } from 'react';
import { WINHOME_CONTACT } from '../data/winhomeData';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    branch: 'sales',
    interest: 'uPVC Systems',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        branch: 'sales',
        interest: 'uPVC Systems',
        message: ''
      });
    }, 5000);
  };

  const whatsappDirectUrl = `https://wa.me/${WINHOME_CONTACT.hotlineRaw.replace('+', '')}?text=${encodeURIComponent(
    `Hello Winhome, I would like to inquire about architectural profiles and project pricing.`
  )}`;

  return (
    <section id="contact" className="py-20 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Direct Client Support</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get In Touch with Winhome Erbil
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            Whether you need architectural consultations for a luxury villa or high-volume profile supply for a major residential development, our sales and engineering teams are ready to assist.
          </p>
        </div>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Branch Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Sales Branch */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider block">
                  Showroom & Consultations
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {WINHOME_CONTACT.branches.sales.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {WINHOME_CONTACT.branches.sales.description}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">Direct Lines:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WINHOME_CONTACT.branches.sales.phones.map((phone, i) => (
                    <a
                      key={i}
                      href={`tel:${WINHOME_CONTACT.branches.sales.phonesRaw[i]}`}
                      className="p-2.5 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs font-bold text-slate-900 hover:text-sky-700 flex items-center gap-2 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-sky-600" />
                      <span>{phone}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Factory Branch */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider block">
                  Industrial Production
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {WINHOME_CONTACT.branches.manufacturing.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {WINHOME_CONTACT.branches.manufacturing.description}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">Dispatch Lines:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WINHOME_CONTACT.branches.manufacturing.phones.map((phone, i) => (
                    <a
                      key={i}
                      href={`tel:${WINHOME_CONTACT.branches.manufacturing.phonesRaw[i]}`}
                      className="p-2.5 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs font-bold text-slate-900 hover:text-sky-700 flex items-center gap-2 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-sky-600" />
                      <span>{phone}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Location & Hours Card */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3.5 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Headquarters & Factory Address:</span>
                  <span className="text-slate-600">{WINHOME_CONTACT.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Working Hours:</span>
                  <span className="text-slate-600">{WINHOME_CONTACT.workHours}</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start WhatsApp Chat with Engineer</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation Request Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              Request Project Consultation & Pricing
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-6">
              Our architectural team will review your bill of quantities (BOQ) or floor plan measurements and respond within 24 business hours.
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in duration-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">
                  Consultation Request Received
                </h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Thank you! An authorized Winhome project engineer will contact you via phone or WhatsApp shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Eng. Barzan Mohammed"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-sky-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+964 750 XXX XXXX"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-sky-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-sky-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Branch Destination
                    </label>
                    <select
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-sky-600 focus:bg-white"
                    >
                      <option value="sales">Sales & Showroom Branch</option>
                      <option value="manufacturing">Manufacturing Plant</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    System of Interest
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-sky-600 focus:bg-white"
                  >
                    <option value="uPVC Systems">European uPVC Windows & Sliding Doors</option>
                    <option value="Aluminum Systems">Thermal Break Aluminum & Lift-and-Slide</option>
                    <option value="Curtain Wall">Commercial Façade 50F Curtain Wall</option>
                    <option value="Hardware">Master Italy Hardware & Mechanics</option>
                    <option value="General BOQ">Complete Building Fenestration BOQ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Project Details / Estimated Dimensions
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your villa or commercial project (location, approximate window count, desired profile series or colors)..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-sky-600 focus:bg-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry to Winhome Engineers</span>
                </button>
              </form>
            )}

            {/* Embedded Google Map */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-slate-900">Erbil Factory & Showroom Coordinates:</span>
                <span className="text-slate-500">Old Kirkuk Road, Erbil</span>
              </div>
              <div className="w-full h-52 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <iframe
                  title="Winhome Erbil Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102987.52731804791!2d43.9288764!3d36.1911135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x400722fe134333a3%3A0x6a0a0be094e432a6!2sErbil%2C%20Kurdistan%20Region%2C%20Iraq!5e0!3m2!1sen!2siq!4v1700000000000!5m2!1sen!2siq"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
