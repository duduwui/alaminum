import React from 'react';
import { ProductItem, WINHOME_CONTACT } from '../data/winhomeData';
import { GlowButton } from './GlowButton';
import { X, Check, Phone, MessageSquare, Calculator, Layers, ShieldCheck } from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onOpenQuote: (productName: string) => void;
  onConfigureProduct?: (product: ProductItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenQuote,
  onConfigureProduct
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* SEAMLESS LIGHT HEADER */}
        <div className="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shrink-0 border border-sky-200">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-sky-700 uppercase bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                {product.category.toUpperCase()} • {product.subCategory || 'Architectural System'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug truncate mt-0.5">
                {product.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shrink-0 ml-3"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-thin scrollbar-thumb-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            {/* Image Preview */}
            <div className="relative aspect-square rounded-xl bg-slate-50 p-4 flex items-center justify-center border border-slate-200 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== product.fallbackImage) {
                    target.src = product.fallbackImage;
                  }
                }}
                className="max-h-full max-w-full object-contain"
              />
              {product.depth && (
                <div className="absolute top-3 left-3 bg-white/95 border border-slate-200 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded shadow-2xs">
                  Depth: {product.depth}
                </div>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="space-y-3 text-xs text-slate-700">
              <p className="leading-relaxed">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {product.chambers && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Chamber Count</span>
                    <span className="text-xs font-bold text-slate-900">{product.chambers} Chambers</span>
                  </div>
                )}
                {product.depth && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Profile Depth</span>
                    <span className="text-xs font-bold text-slate-900">{product.depth}</span>
                  </div>
                )}
                {product.insulationValue && (
                  <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200">
                    <span className="text-[10px] text-sky-700 uppercase tracking-wider block font-semibold">Thermal Rating</span>
                    <span className="text-xs font-bold text-sky-900">{product.insulationValue}</span>
                  </div>
                )}
                {product.acousticValue && (
                  <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200">
                    <span className="text-[10px] text-indigo-700 uppercase tracking-wider block font-semibold">Acoustic Shield</span>
                    <span className="text-xs font-bold text-indigo-900">{product.acousticValue}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Key Engineering Specifications & Strengths</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FIXED FOOTER */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 z-20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors border border-slate-200"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {onConfigureProduct && (
              <GlowButton
                onClick={() => {
                  onClose();
                  onConfigureProduct(product);
                }}
                variant="primary"
                size="sm"
              >
                <span>Configure Specs</span>
              </GlowButton>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;
