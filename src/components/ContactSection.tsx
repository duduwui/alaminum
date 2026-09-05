import React, { useState } from 'react';
import Stepper, { Step } from './Stepper';
import { WINHOME_CONTACT } from '../data/winhomeData';
import { Phone, MapPin, Clock, Send, MessageSquare, CheckCircle2, Building2, Home, Layers, ShieldCheck } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    projectType: 'Luxury Villa',
    location: 'Erbil',
    systemCategory: 'uPVC Systems',
    projectStage: 'Architectural Drawings Ready',
    name: '',
    phone: '',
    email: '',
    branch: 'sales',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleFinalSubmit = () => {
    setSubmitted(true);
  };

  const whatsappDirectUrl = `https://wa.me/${WINHOME_CONTACT.hotlineRaw.replace('+', '')}?text=${encodeURIComponent(
    `Hello Winhome, I am inquiring about ${formData.systemCategory} for my ${formData.projectType} project in ${formData.location}. Name: ${formData.name}, Phone: ${formData.phone}.`
  )}`;

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 border-b border-slate-200 relative overflow-hidden">
      {/* Subtle Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Get In Touch with <span className="text-blue-600">Winhome Erbil</span>
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed font-medium">
            Answer a few quick questions to guide our architectural sales and engineering teams in providing exact specifications for your villa or commercial project.
          </p>
        </div>

        {/* 2-Column Side-by-Side Executive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Multi-Step Stepper Wizard */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-lg text-center space-y-6 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Inquiry Received Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900 font-bold">{formData.name || 'Valued Client'}</strong>. A certified Winhome project engineer will contact you shortly regarding your <span className="text-blue-600 font-semibold">{formData.systemCategory}</span> inquiry.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Connect Immediately on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <Stepper
                initialStep={1}
                onFinalStepCompleted={handleFinalSubmit}
                backButtonText="Back"
                nextButtonText="Continue"
              >
                {/* Step 1: Project Type & Location */}
                <Step>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                        Step 1 of 3 • Project Scope
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">
                        What type of building are you developing?
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'Luxury Villa', label: 'Luxury Villa / Mansion', icon: Home },
                        { id: 'Commercial High-Rise', label: 'Commercial High-Rise', icon: Building2 },
                        { id: 'Residential Apartment', label: 'Residential Compound', icon: Layers },
                        { id: 'Renovation', label: 'Window Replacement', icon: ShieldCheck }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, projectType: item.id })}
                          className={`p-3.5 rounded-xl border text-left flex flex-col items-start gap-2 transition-all ${
                            formData.projectType === item.id
                              ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-medium'
                          }`}
                        >
                          <item.icon className={`w-5 h-5 ${formData.projectType === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="text-xs">{item.label}</span>
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Project Location City
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white"
                      >
                        <option value="Erbil">Erbil (Capital Hub)</option>
                        <option value="Sulaymaniyah">Sulaymaniyah</option>
                        <option value="Duhok">Duhok</option>
                        <option value="Baghdad">Baghdad / Federal Iraq</option>
                      </select>
                    </div>
                  </div>
                </Step>

                {/* Step 2: System Interest */}
                <Step>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                        Step 2 of 3 • Technical Interest
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">
                        Which fenestration profile do you require?
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'uPVC Systems', label: 'uPVC Windows & Sliding (Winsa)', sub: 'Acoustic & thermal insulation' },
                        { id: 'Aluminum Systems', label: 'Thermal Break Aluminum (Lorenzoline)', sub: 'Panoramic doors & curtain wall' },
                        { id: 'Curtain Wall 50F', label: 'Curtain Wall 50F Façades', sub: 'Structural glass mullion towers' },
                        { id: 'Hardware & BOQ', label: 'Hardware & Complete BOQ', sub: 'Master Italy hardware packages' }
                      ].map((sys) => (
                        <button
                          key={sys.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, systemCategory: sys.id })}
                          className={`p-3.5 rounded-xl border text-left transition-all ${
                            formData.systemCategory === sys.id
                              ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-medium'
                          }`}
                        >
                          <span className="text-xs block font-bold">{sys.label}</span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">{sys.sub}</span>
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Optional Project Notes / Estimated Window Count
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Mention approximate window count, desired color finishes (e.g. Anthracite, Golden Oak), or specific thermal requirements..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                      ></textarea>
                    </div>
                  </div>
                </Step>

                {/* Step 3: Client Contact Info */}
                <Step>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                        Step 3 of 3 • Contact Details
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">
                        Where should our engineer send your proposal?
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Barzan Mohammed"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Phone Number (WhatsApp) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+964 750 XXX XXXX"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Branch Destination
                        </label>
                        <select
                          value={formData.branch}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white"
                        >
                          <option value="sales">Sales & Showroom Branch</option>
                          <option value="manufacturing">Erbil Manufacturing Plant</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Step>
              </Stepper>
            )}
          </div>

          {/* Right Column: Direct Hotlines & Erbil Location Map */}
          <div className="lg:col-span-5 space-y-5">
            {/* Sales & Factory Direct Contact Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  Direct Line & Consultations
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Winhome Erbil Headquarters
                </h3>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Factory & Showroom Address:</span>
                    <span className="text-slate-600">{WINHOME_CONTACT.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Working Hours:</span>
                    <span className="text-slate-600">{WINHOME_CONTACT.workHours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {WINHOME_CONTACT.branches.sales.phones.map((phone, i) => (
                  <a
                    key={i}
                    href={`tel:${WINHOME_CONTACT.branches.sales.phonesRaw[i]}`}
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs font-bold text-slate-900 hover:text-blue-700 flex items-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>{phone}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Embedded Erbil Factory Map Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Erbil Factory & Showroom Location</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Kurdistan Region</span>
              </div>
              <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
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
