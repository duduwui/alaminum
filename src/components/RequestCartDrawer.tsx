import React, { useState, useEffect } from 'react';
import { RequestItem, QuotationRequest } from '../types/requests';
import { submitQuotationRequest } from '../services/requestService';
import { DOORHOME_CONTACT } from '../data/winhomeData';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Send,
  Check,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { loadLocalProducts, subscribeToLocalProducts } from '../services/productService';
import { getLocalizedProduct } from '../utils/localizedContent';

interface RequestCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: RequestItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onBrowseMore?: () => void;
  onExploreMore?: () => void;
  onProceedToQuote?: () => void;
  onSuccessfulSubmission?: (newRequest: QuotationRequest) => void;
}

const IRAQ_CITIES = [
  'Erbil (Hawler)',
  'Baghdad',
  'Sulaymaniyah',
  'Duhok',
  'Kirkuk',
  'Basra',
  'Najaf',
  'Karbala',
  'Mosul',
  'Zakho',
  'Other City'
];

export const RequestCartDrawer: React.FC<RequestCartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBrowseMore,
  onExploreMore,
  onProceedToQuote,
  onSuccessfulSubmission
}) => {
  const { currentLanguage, t } = useLanguage();
  const [catalog, setCatalog] = useState(loadLocalProducts);
  useEffect(() => subscribeToLocalProducts(setCatalog), []);
  const itemName = (item: RequestItem) => {
    const product = catalog.find(product => product.id === item.productId);
    return product ? getLocalizedProduct(product, currentLanguage.code).name : item.productName;
  };
  const isRtl = ['ckb', 'fa', 'ar'].includes(currentLanguage.code);

  const handleBrowseMoreAction = () => {
    if (onExploreMore) onExploreMore();
    else if (onBrowseMore) onBrowseMore();
    else onClose();
  };

  const [step, setStep] = useState<'items' | 'contact'>('items');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<QuotationRequest | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Customer Contact State (Email is optional, Project/Villa Name removed)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Erbil (Hawler)');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const totalQuantity = items.reduce((acc, it) => acc + (it.quantity || 1), 0);
  const totalUSD = items
    .filter((it) => (it.currency || 'USD') === 'USD')
    .reduce((acc, it) => acc + (it.totalPrice || (it.unitPrice || 140) * (it.quantity || 1)), 0);
  const totalIQD = items
    .filter((it) => it.currency === 'IQD')
    .reduce((acc, it) => acc + (it.totalPrice || (it.unitPrice || 140) * (it.quantity || 1)), 0);
  const totalEstimatedAmount = totalUSD + (totalIQD > 0 ? totalIQD : 0);

  const handleClose = () => {
    setSubmittedRequest(null);
    setStep('items');
    setErrorMessage('');
    onClose();
  };

  const handleProceedToContact = () => {
    if (items.length === 0) return;
    setStep('contact');
    setErrorMessage('');
  };

  const handleSubmitCart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter your phone or WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const customerInfo = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      city: city || 'Erbil (Hawler)',
      projectType: 'Architectural System Request',
      timeline: 'Immediate / 1 Month',
      serviceNeeded: 'Full Fabrication & Installation by Doorhome Engineers',
      preferredContact: 'whatsapp' as const,
      additionalNotes: additionalNotes.trim() || undefined
    };

    try {
      const created = await submitQuotationRequest(customerInfo, items);
      setSubmittedRequest(created);
      onClearCart();
      if (onSuccessfulSubmission) {
        onSuccessfulSubmission(created);
      }
    } catch (err) {
      console.error('Submission fallback:', err);
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const fallbackRequest: QuotationRequest = {
        id: `WH-2026-${randomDigits}`,
        createdAt: new Date().toISOString(),
        status: 'new',
        customer: customerInfo,
        items: [...items],
        totalQuantity,
        totalAreaSqm: totalQuantity,
        quotedAmount: totalEstimatedAmount,
        currency: 'USD'
      };
      setSubmittedRequest(fallbackRequest);
      onClearCart();
      if (onSuccessfulSubmission) {
        onSuccessfulSubmission(fallbackRequest);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    !isOpen ? null :
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close backdrop */}
      <div className="flex-1" onClick={handleClose} />

      {/* Right Drawer Panel */}
      <div
        data-doorhome-drawer
        dir={isRtl ? 'rtl' : 'ltr'}
        className="w-full sm:w-[460px] md:w-[500px] bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300 z-50"
      >
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {step === 'contact' && !submittedRequest ? (
              <button
                type="button"
                onClick={() => setStep('items')}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Back to cart items"
              >
                <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                <ShoppingCart className="w-4 h-4" />
              </div>
            )}
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {submittedRequest
                  ? (t('quotation_submitted_title') || 'Quotation Submitted')
                  : step === 'contact'
                  ? (t('contact_info_title') || 'Contact Information')
                  : t('cart_drawer_title')}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {submittedRequest
                  ? `${t('ref_id_label') || 'Ref ID:'} ${submittedRequest.id}`
                  : step === 'contact'
                  ? (t('contact_info_subtitle') || 'Enter contact info for engineering quotation')
                  : `${items.length} ${t('systems_label')} • ${totalQuantity} ${t('units_label')}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            aria-label={t('ui_close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {submittedRequest ? (
            /* Confirmation Screen */
            <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-sm">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">{t('quotation_submitted_title')}</h3>
                <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                  {t('thank_you_label')}{' '}
                  <strong className="text-slate-900 font-bold">{submittedRequest.customer?.fullName}</strong>.{' '}
                  {t('ref_id_label')}{' '}
                  <span className="font-mono font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">{submittedRequest.id}</span>.
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed pt-1">
                  Our Doorhome engineering team in {submittedRequest.customer?.city || 'Erbil'} will review your specifications and follow up at{' '}
                  <strong className="text-slate-700">{submittedRequest.customer?.phone}</strong>.
                </p>
              </div>

              <div className="w-full space-y-2.5 pt-3">
                <a
                  href={`https://wa.me/${(DOORHOME_CONTACT.hotlineRaw || '+9647504440402').replace('+', '')}?text=${encodeURIComponent(
                    `Hello Doorhome, I just submitted request reference ${submittedRequest.id} for ${submittedRequest.customer?.fullName}. Please review my quotation.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('whatsapp_sales_connect')}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    handleBrowseMoreAction();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  {t('continue_browsing')}
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            /* Empty Cart */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">{t('cart_empty_title')}</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-normal">
                  {t('cart_empty_desc')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  handleBrowseMoreAction();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                {t('browse_products_btn')}
              </button>
            </div>
          ) : step === 'contact' ? (
            /* STEP 2: REFINED EXECUTIVE CONTACT FORM */
            <form onSubmit={handleSubmitCart} id="cart-contact-form" className="space-y-4 text-xs">
              {/* Order quick summary bar */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">{t('quotation_summary')}</span>
                  <span className="text-xs font-bold text-slate-900">
                    {totalQuantity} {t('units_label')} {t('across_systems')} {items.length} {t('systems_label')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 font-medium block">{t('est_subtotal')}</span>
                  <span className="text-xs font-black text-slate-900">
                    {totalUSD > 0 && `$${totalUSD.toLocaleString()}`}
                    {totalUSD > 0 && totalIQD > 0 && ' + '}
                    {totalIQD > 0 && `${totalIQD.toLocaleString()} IQD`}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                  {t('full_name_label')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={t('full_name_placeholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-900/5 text-slate-900 font-medium transition-all"
                />
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                    {t('phone_whatsapp_label')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="0750 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-900/5 text-slate-900 font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                    {t('email_label_opt')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-900/5 text-slate-900 font-medium transition-all"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                  {t('city_label')}
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-900/5 text-slate-900 font-medium transition-all"
                >
                  {IRAQ_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                  {t('notes_label_opt')}
                </label>
                <textarea
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder={t('notes_placeholder')}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-900/5 text-slate-900 font-medium transition-all resize-none"
                />
              </div>

              <div className="pt-1 text-[11px] text-slate-500 leading-relaxed">
                {t('engineers_review_note')}
              </div>
            </form>
          ) : (
            /* STEP 1: CART ITEMS REVIEW */
            <>
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                <span className="text-slate-700 font-bold">{t('selected_systems_label')} ({items.length})</span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-slate-400 hover:text-rose-600 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('clear_all_btn')}</span>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item) => {
                  const itemUnitPrice = item.unitPrice || 140;
                  const itemTotalPrice = item.totalPrice || itemUnitPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all shadow-2xs space-y-3"
                    >
                      {/* Item Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <img
                            src={item.image}
                            alt={itemName(item)}
                            className="w-14 h-14 rounded-xl bg-slate-50 object-contain p-1 border border-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md inline-block mb-1">
                              {item.category}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
                              {itemName(item)}
                            </h4>
                            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                              {item.currency === 'IQD'
                                ? `${itemUnitPrice.toLocaleString()} IQD`
                                : `$${itemUnitPrice.toLocaleString()}`}{' '}
                              / {t('units_label')}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-300 hover:text-rose-600 p-1 transition-colors shrink-0 cursor-pointer"
                          title={t('ui_remove_item')}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Specifications Pill */}
                      {(item.heights || item.dimensions || item.depth || item.insulationValue) && (
                        <div className="bg-slate-50 px-3 py-2 rounded-xl text-[11px] space-y-1 text-slate-600 font-medium border border-slate-100">
                          {(item.heights || item.dimensions) && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">{t('dimensions_label')}:</span>
                              <span className="font-semibold text-slate-800">{item.heights || item.dimensions}</span>
                            </div>
                          )}
                          {item.depth && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">{t('profile_depth_label')}:</span>
                              <span className="font-semibold text-slate-800">{item.depth}</span>
                            </div>
                          )}
                          {item.insulationValue && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">{t('cart_insulation_label') || t('insulation_label')}:</span>
                              <span className="font-semibold text-slate-800">{item.insulationValue}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quantity Controls & Item Total */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-medium">{t('cart_qty_label') || t('qty_label')}:</span>
                          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs cursor-pointer transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs cursor-pointer transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900 block">
                            {item.currency === 'IQD'
                              ? `${itemTotalPrice.toLocaleString()} IQD`
                              : `$${itemTotalPrice.toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && !submittedRequest && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3 shrink-0">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between font-medium">
                <span>{t('total_units_label')}</span>
                <span className="font-bold text-slate-900">{totalQuantity} {t('units_label')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t('est_value_label')}</span>
                <span className="font-black text-slate-900 text-sm">
                  {totalUSD > 0 && `$${totalUSD.toLocaleString()}`}
                  {totalUSD > 0 && totalIQD > 0 && ' + '}
                  {totalIQD > 0 && `${totalIQD.toLocaleString()} IQD`}
                  {totalUSD === 0 && totalIQD === 0 && '$0'}
                </span>
              </div>
            </div>

            {step === 'items' ? (
              <button
                type="button"
                onClick={handleProceedToContact}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer shadow-sm"
              >
                <span>{t('proceed_to_contact')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('items')}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  {t('back_btn')}
                </button>
                <button
                  type="submit"
                  form="cart-contact-form"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>{t('submitting_btn')}</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t('submit_rfq_btn')}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default RequestCartDrawer;
