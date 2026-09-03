import React from 'react';
import { RequestItem } from '../types/requests';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ClipboardList,
  Sparkles,
  Layers,
  Ruler,
  CheckCircle2
} from 'lucide-react';

interface RequestCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: RequestItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenStepperModal: () => void;
  onBrowseMore: () => void;
}

export const RequestCartDrawer: React.FC<RequestCartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenStepperModal,
  onBrowseMore
}) => {
  if (!isOpen) return null;

  const totalQuantity = items.reduce((acc, it) => acc + (it.quantity || 1), 0);
  const totalAreaSqm = items.reduce((acc, it) => {
    const area = it.estimatedAreaSqm || ((it.widthMm * it.heightMm) / 1000000) * it.quantity;
    return acc + area;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-in Panel */}
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Architectural Request Cart
              </h2>
              <p className="text-xs text-slate-500">
                {items.length} unique {items.length === 1 ? 'system' : 'systems'} • {totalQuantity} total units
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <Layers className="w-8 h-8 stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">Your Request List is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Browse our uPVC and Aluminum systems in the shop, click any product, and customize sizes and glazing to create your bill of quantities (BOQ).
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onBrowseMore();
                }}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                Browse Products Catalog
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Configured Systems ({items.length})</span>
                <button
                  onClick={onClearCart}
                  className="text-rose-600 hover:text-rose-700 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>

              {items.map((item, idx) => {
                const itemArea = Number(
                  (item.estimatedAreaSqm || ((item.widthMm * item.heightMm) / 1000000) * item.quantity).toFixed(2)
                );

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 transition-all shadow-2xs space-y-3"
                  >
                    {/* Item header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg bg-slate-50 object-contain p-1 border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="text-[9px] font-bold uppercase text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100 inline-block mb-0.5">
                            {item.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {item.productName}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {item.widthMm} mm × {item.heightMm} mm ({itemArea} m²)
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Specification badges */}
                    <div className="bg-slate-50 p-2 rounded-xl text-[11px] space-y-1 border border-slate-100 text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Finish:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[200px]">{item.color}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Glass:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[200px]">{item.glazing}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Opening:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[200px]">{item.openingType}</span>
                      </div>
                      {item.notes && (
                        <div className="pt-1 border-t border-slate-200/60 text-[10px] text-slate-500 italic">
                          "{item.notes}"
                        </div>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Units:</span>
                        <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right text-[11px] font-bold text-sky-700">
                        {itemArea} m² Glass Area
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer with Summary & Stepper Launcher */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Total Architectural Items:</span>
                <span className="font-bold text-slate-900">{totalQuantity} units</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Insulated Glass Area:</span>
                <span className="font-bold text-sky-700">{totalAreaSqm.toFixed(2)} m²</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Technical Processing:</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Direct Engineering Queue</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenStepperModal();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Proceed to Quotation Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCartDrawer;
