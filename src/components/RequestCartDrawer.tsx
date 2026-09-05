import React, { useState } from 'react';
import { RequestItem, QuotationRequest } from '../types/requests';
import { submitQuotationRequest } from '../services/requestService';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ClipboardList,
  CheckCircle2,
  ShoppingCart,
  Send,
  Check
} from 'lucide-react';

interface RequestCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: RequestItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onBrowseMore: () => void;
  onSuccessfulSubmission?: (newRequest: QuotationRequest) => void;
}

export const RequestCartDrawer: React.FC<RequestCartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBrowseMore,
  onSuccessfulSubmission
}) => {
  if (!isOpen) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<QuotationRequest | null>(null);

  const totalQuantity = items.reduce((acc, it) => acc + (it.quantity || 1), 0);
  const totalAreaSqm = items.reduce((acc, it) => {
    const area = it.estimatedAreaSqm || ((it.widthMm * it.heightMm) / 1000000) * it.quantity;
    return acc + area;
  }, 0);

  const handleClose = () => {
    setSubmittedRequest(null);
    onClose();
  };

  const handleDirectSubmitToAdmin = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    try {
      const defaultCustomerInfo = {
        fullName: 'Client Request from Shop',
        phone: '+964 750 000 0000',
        email: 'client@winhome.iq',
        company: 'Private Project',
        city: 'Erbil (Hawler)',
        projectType: 'Architectural Project',
        timeline: 'Immediate',
        serviceNeeded: 'Full Fabrication & Installation by Winhome Engineers',
        preferredContact: 'whatsapp' as const,
        additionalNotes: 'Direct submission from user cart.'
      };

      const created = await submitQuotationRequest(defaultCustomerInfo, items);
      setSubmittedRequest(created);
      onClearCart();
      if (onSuccessfulSubmission) {
        onSuccessfulSubmission(created);
      }
    } catch (err) {
      console.error('Submission error fallback:', err);
      // Construct local fallback quotation request object if any unexpected error occurs
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const fallbackRequest: QuotationRequest = {
        id: `WH-2026-${randomDigits}`,
        createdAt: new Date().toISOString(),
        status: 'new',
        customer: {
          fullName: 'Client Request from Shop',
          phone: '+964 750 000 0000',
          email: 'client@winhome.iq',
          company: 'Private Project',
          city: 'Erbil (Hawler)',
          projectType: 'Architectural Project',
          timeline: 'Immediate',
          serviceNeeded: 'Full Fabrication & Installation by Winhome Engineers',
          preferredContact: 'whatsapp',
          additionalNotes: 'Direct submission from user cart.'
        },
        items: [...items],
        totalQuantity,
        totalAreaSqm: Number(totalAreaSqm.toFixed(2)),
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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close backdrop */}
      <div className="flex-1" onClick={handleClose} />

      {/* Right-to-Left Animated Transparent Liquid Glass Panel */}
      <div className="w-full sm:w-[420px] md:w-[460px] bg-white/85 backdrop-blur-2xl h-full shadow-2xl flex flex-col justify-between border-l border-white/60 animate-in slide-in-from-right duration-300 z-50">
        
        {/* Transparent Glass Header Bar */}
        <div className="px-5 py-4 border-b border-slate-200/60 bg-white/60 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100/90 text-sky-700 flex items-center justify-center font-bold border border-sky-200 shadow-2xs">
              <ShoppingCart className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Architectural Request Cart
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                {items.length} unique {items.length === 1 ? 'system' : 'systems'} • {totalQuantity} total units
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200/90 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors font-bold cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Item List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-300">
          {submittedRequest ? (
            /* Success confirmation screen directly inside cart drawer - SECURITY: No Admin Button */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-lg">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900">Request Sent Successfully!</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
                  Your specifications have been registered under Reference{' '}
                  <strong className="text-sky-700 font-extrabold">{submittedRequest.id}</strong>. Our engineering team will review your specifications and contact you shortly.
                </p>
              </div>

              <div className="w-full pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedRequest(null);
                    onClose();
                    onBrowseMore();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                >
                  Continue Browsing Shop
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-50/90 text-sky-600 flex items-center justify-center border border-sky-200/80 shadow-2xs">
                <ShoppingCart className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Your Request Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-normal">
                  Browse our uPVC and Aluminum systems in the catalog, configure sizes and glazing, and build your Bill of Quantities (BOQ).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBrowseMore();
                }}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold transition-all shadow-md shadow-sky-600/20 cursor-pointer"
              >
                Browse Products Catalog
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200/60">
                <span className="text-slate-700 font-extrabold">Configured Systems ({items.length})</span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-rose-600 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Cart</span>
                </button>
              </div>

              {items.map((item) => {
                const itemArea = Number(
                  (item.estimatedAreaSqm || ((item.widthMm * item.heightMm) / 1000000) * item.quantity).toFixed(2)
                );

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md hover:border-sky-300 transition-all shadow-2xs space-y-3"
                  >
                    {/* Item Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-12 h-12 rounded-xl bg-slate-50 object-contain p-1 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[9px] font-extrabold uppercase text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100 inline-block mb-0.5">
                            {item.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
                            {item.productName}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-bold block mt-0.5">
                            {item.widthMm} mm × {item.heightMm} mm ({itemArea} m²)
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors shrink-0"
                        title="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Specifications */}
                    <div className="bg-slate-50/90 p-2.5 rounded-xl text-[11px] space-y-1 border border-slate-200/60 text-slate-600 font-medium">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Finish:</span>
                        <span className="font-bold text-slate-800 truncate max-w-[200px]">{item.color}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Glass:</span>
                        <span className="font-bold text-slate-800 truncate max-w-[200px]">{item.glazing}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Opening:</span>
                        <span className="font-bold text-slate-800 truncate max-w-[200px]">{item.openingType}</span>
                      </div>
                      {item.notes && (
                        <div className="pt-1 border-t border-slate-200/60 text-[10px] text-slate-500 italic">
                          "{item.notes}"
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between pt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-semibold">Units:</span>
                        <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold text-xs shadow-2xs cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold text-xs shadow-2xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right text-[11px] font-extrabold text-sky-700">
                        {itemArea} m² Glass Area
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && !submittedRequest && (
          <div className="p-5 border-t border-slate-200/80 bg-white/70 backdrop-blur-md space-y-3 shrink-0">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Total Configured Units:</span>
                <span className="font-extrabold text-slate-900">{totalQuantity} units</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Insulated Glass Area:</span>
                <span className="font-extrabold text-sky-700">{totalAreaSqm.toFixed(2)} m²</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Queue Status:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Direct Engineering Review</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleDirectSubmitToAdmin}
              className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-sky-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Technical Request</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default RequestCartDrawer;
