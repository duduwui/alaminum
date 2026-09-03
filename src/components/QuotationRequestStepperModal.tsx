import React, { useState } from 'react';
import Stepper, { Step } from './Stepper';
import { RequestItem, CustomerInfo, QuotationRequest } from '../types/requests';
import { submitQuotationRequest } from '../services/requestService';
import { WINHOME_CONTACT } from '../data/winhomeData';
import {
  X,
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  Wrench,
  User,
  Phone,
  Mail,
  Briefcase,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Send,
  Layers,
  ArrowRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface QuotationRequestStepperModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: RequestItem[];
  onSuccessfulSubmission: (newRequest: QuotationRequest) => void;
  onViewAdminPortal?: () => void;
}

export const QuotationRequestStepperModal: React.FC<QuotationRequestStepperModalProps> = ({
  isOpen,
  onClose,
  items,
  onSuccessfulSubmission,
  onViewAdminPortal
}) => {
  if (!isOpen) return null;

  // Form State
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    city: 'Erbil (Hawler)',
    projectType: 'Luxury Private Villa',
    timeline: '1 Month',
    serviceNeeded: 'Full Fabrication & Installation by Winhome Engineers',
    preferredContact: 'whatsapp',
    additionalNotes: ''
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRequest, setSubmittedRequest] = useState<QuotationRequest | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  const totalQuantity = items.reduce((sum, it) => sum + (it.quantity || 1), 0);
  const totalAreaSqm = items.reduce((sum, it) => {
    const area = it.estimatedAreaSqm || ((it.widthMm * it.heightMm) / 1000000) * it.quantity;
    return sum + area;
  }, 0);

  const cityOptions = [
    'Erbil (Hawler)',
    'Baghdad',
    'Sulaymaniyah',
    'Duhok',
    'Basra',
    'Kirkuk',
    'Najaf',
    'Karbala',
    'Mosul',
    'Other City in Iraq'
  ];

  const projectTypes = [
    'Luxury Private Villa',
    'Residential Multi-Story House',
    'Commercial Tower & Offices',
    'Car Showroom / Commercial Frontage',
    'Hotel & Resort Complex',
    'Renovation & Window Replacement',
    'Government / Institutional Facility'
  ];

  const timelines = [
    'Immediate (Within 1-2 Weeks)',
    '1 Month',
    '2-3 Months',
    'Architectural Tender / Planning Phase'
  ];

  const services = [
    'Full Fabrication & Installation by Winhome Engineers',
    'Fabrication & Direct Delivery to Project Site',
    'Site Measurement Visit & Technical Consultation Needed'
  ];

  const validateStep3 = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!customer.fullName.trim()) {
      errors.fullName = 'Please enter your full name or project contact person.';
    }
    if (!customer.phone.trim() || customer.phone.length < 7) {
      errors.phone = 'Please provide a valid phone or WhatsApp number.';
    }
    if (!customer.email.trim() || !customer.email.includes('@')) {
      errors.email = 'Please provide a valid email address.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep3()) {
      alert('Please complete all required contact fields in Step 3 before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await submitQuotationRequest(customer, items);
      setSubmittedRequest(created);
      onSuccessfulSubmission(created);
    } catch (err) {
      console.error('Submission error', err);
      alert('An error occurred submitting your request. Please try again or contact us directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (submittedRequest) {
      navigator.clipboard.writeText(submittedRequest.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const getWhatsAppSubmissionUrl = () => {
    if (!submittedRequest) return '#';
    const text = `Hello Winhome Company,\n\nI have just submitted a formal Architectural Request on your portal:\n• Request ID: ${submittedRequest.id}\n• Name: ${submittedRequest.customer.fullName}\n• City: ${submittedRequest.customer.city}\n• Project: ${submittedRequest.customer.projectType}\n• Total Systems: ${submittedRequest.totalQuantity} units (${submittedRequest.totalAreaSqm} m²)\n\nPlease verify receipt on the Admin desk and send the engineering bill of quantities (BOQ).`;
    return `https://wa.me/${WINHOME_CONTACT.hotlineRaw.replace('+', '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md shadow-sky-600/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-sky-700 uppercase bg-sky-100/70 border border-sky-200 px-2 py-0.5 rounded">
                  Official Request For Quotation (RFQ)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Winhome Technical Quotation Stepper
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-2 sm:p-6">
          {submittedRequest ? (
            /* Success Screen after final submission */
            <div className="p-4 sm:p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Request Dispatched to Admin!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Your customized architectural specifications have been registered in the Winhome Engineering database.
                </p>
              </div>

              {/* Request ID Badge */}
              <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
                <span className="text-xs text-slate-500 font-medium">Tracking Reference:</span>
                <span className="text-sm sm:text-base font-extrabold text-sky-700 tracking-wider">
                  {submittedRequest.id}
                </span>
                <button
                  onClick={handleCopyId}
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Copy Tracking ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Quick Summary Card */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 max-w-lg mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Client:</span>
                  <span className="font-bold text-slate-800">{submittedRequest.customer.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Project / City:</span>
                  <span className="font-bold text-slate-800">
                    {submittedRequest.customer.projectType} • {submittedRequest.customer.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Architectural Systems:</span>
                  <span className="font-bold text-sky-700">
                    {submittedRequest.totalQuantity} units ({submittedRequest.totalAreaSqm} m²)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getWhatsAppSubmissionUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify Engineer on WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Done & Return to Catalog</span>
                </button>
              </div>
            </div>
          ) : (
            /* React Bits Stepper Component Integration */
            <Stepper
              initialStep={1}
              onFinalStepCompleted={handleSubmit}
              backButtonText="Previous Step"
              nextButtonText="Continue"
            >
              {/* STEP 1: REVIEW CONFIGURED SYSTEMS */}
              <Step>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                        Step 1 of 4 • Technical Specifications
                      </span>
                      <span className="text-xs text-slate-400">
                        {items.length} Systems ({totalQuantity} Units)
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      Review Configured Fenestration Systems
                    </h3>
                    <p className="text-xs text-slate-500">
                      Verify your custom dimensions, glass, and finishes before specifying project location.
                    </p>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                    {items.map((it, idx) => (
                      <div
                        key={it.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-slate-800 block">{it.productName}</span>
                            <span className="text-[11px] text-slate-500">
                              {it.quantity} units • {it.widthMm} × {it.heightMm} mm ({it.color})
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded font-semibold text-slate-700 block">
                            {it.glazing.split('(')[0]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-200/80 flex items-center justify-between text-xs">
                    <span className="text-sky-900 font-semibold">Total Glass Area:</span>
                    <span className="text-sky-800 font-extrabold">{totalAreaSqm.toFixed(2)} m² Insulated Glazing</span>
                  </div>
                </div>
              </Step>

              {/* STEP 2: PROJECT SPECIFICATIONS */}
              <Step>
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                      Step 2 of 4 • Project Details
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      Project Location & Fabrication Scope
                    </h3>
                    <p className="text-xs text-slate-500">
                      Help Winhome engineers calculate freight, wind load pressure, and installation requirements.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Project Type */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>Project Archetype</span>
                      </label>
                      <select
                        value={customer.projectType}
                        onChange={(e) => setCustomer({ ...customer, projectType: e.target.value })}
                        className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 text-slate-800 font-medium"
                      >
                        {projectTypes.map((pt) => (
                          <option key={pt} value={pt}>
                            {pt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City / Province */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-sky-600" />
                        <span>City / Province (Iraq)</span>
                      </label>
                      <select
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 text-slate-800 font-medium"
                      >
                        {cityOptions.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        <span>Project Timeline</span>
                      </label>
                      <select
                        value={customer.timeline}
                        onChange={(e) => setCustomer({ ...customer, timeline: e.target.value })}
                        className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 text-slate-800 font-medium"
                      >
                        {timelines.map((tl) => (
                          <option key={tl} value={tl}>
                            {tl}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Required Service */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-sky-600" />
                        <span>Service Scope</span>
                      </label>
                      <select
                        value={customer.serviceNeeded}
                        onChange={(e) => setCustomer({ ...customer, serviceNeeded: e.target.value })}
                        className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 text-slate-800 font-medium truncate"
                      >
                        {services.map((sv) => (
                          <option key={sv} value={sv}>
                            {sv}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </Step>

              {/* STEP 3: PERSONAL & CONTACT INFOS */}
              <Step>
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                      Step 3 of 4 • Contact Information
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      Client / Contractor Contact Details
                    </h3>
                    <p className="text-xs text-slate-500">
                      Our Erbil engineering office will send the itemized technical quotation to these credentials.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-sky-600" />
                        <span>Full Name / Contact Person *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.fullName}
                        onChange={(e) => {
                          setCustomer({ ...customer, fullName: e.target.value });
                          if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                        }}
                        placeholder="e.g. Kak Dana Farhad / Eng. Ahmed"
                        className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border ${
                          formErrors.fullName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                        } focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900`}
                      />
                      {formErrors.fullName && (
                        <span className="text-[10px] text-rose-600 block">{formErrors.fullName}</span>
                      )}
                    </div>

                    {/* Phone / WhatsApp */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-sky-600" />
                        <span>Phone / WhatsApp Number *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) => {
                          setCustomer({ ...customer, phone: e.target.value });
                          if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                        }}
                        placeholder="e.g. +964 750 123 4567"
                        className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border ${
                          formErrors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                        } focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900`}
                      />
                      {formErrors.phone && (
                        <span className="text-[10px] text-rose-600 block">{formErrors.phone}</span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-sky-600" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={(e) => {
                          setCustomer({ ...customer, email: e.target.value });
                          if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                        }}
                        placeholder="e.g. yourname@domain.com"
                        className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border ${
                          formErrors.email ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                        } focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900`}
                      />
                      {formErrors.email && (
                        <span className="text-[10px] text-rose-600 block">{formErrors.email}</span>
                      )}
                    </div>

                    {/* Company / Architecture Firm (Optional) */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-sky-600" />
                        <span>Company / Architecture Firm (Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={customer.company || ''}
                        onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                        placeholder="e.g. Erbil Modern Contracting LLC"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Preferred Channel */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-semibold text-slate-700 block">Preferred Contact Method</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'whatsapp', label: 'WhatsApp' },
                        { id: 'phone', label: 'Direct Phone' },
                        { id: 'email', label: 'Official Email' }
                      ].map((ch) => (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => setCustomer({ ...customer, preferredContact: ch.id as any })}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                            customer.preferredContact === ch.id
                              ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {ch.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Step>

              {/* STEP 4: FINAL SUMMARY & SUBMISSION */}
              <Step>
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                      Step 4 of 4 • Final Confirmation
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      Confirm & Dispatch to Winhome Admin Desk
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your request will be delivered directly to the Winhome administration queue for engineering review.
                    </p>
                  </div>

                  {/* Review Checklist Card */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-2 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Client</span>
                        <span className="font-bold text-slate-900 truncate block">
                          {customer.fullName || 'Not provided'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Location</span>
                        <span className="font-bold text-slate-900 block">{customer.city}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Systems</span>
                        <span className="font-bold text-sky-700 block">{totalQuantity} units</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Glass Area</span>
                        <span className="font-bold text-sky-700 block">{totalAreaSqm.toFixed(2)} m²</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1">
                      <p>
                        <strong>Phone / WhatsApp:</strong> {customer.phone || '—'}
                      </p>
                      <p>
                        <strong>Scope:</strong> {customer.serviceNeeded}
                      </p>
                    </div>

                    {/* Additional Notes Field */}
                    <div className="pt-2">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Any specific architectural instructions for the Admin desk? (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={customer.additionalNotes || ''}
                        onChange={(e) => setCustomer({ ...customer, additionalNotes: e.target.value })}
                        placeholder="e.g. Please also attach thermal calculation certificate for Dream City villa tender..."
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-sky-500 text-slate-900 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Guaranteed response within 24 hours with certified technical drawings and BOQ from Winhome Erbil.
                    </span>
                  </div>
                </div>
              </Step>
            </Stepper>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotationRequestStepperModal;
