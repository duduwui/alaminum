import React from 'react';
import { ProductItem, WINHOME_CONTACT } from '../data/winhomeData';
import { X, Check, Phone, MessageSquare, Calculator } from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onOpenQuote: (productName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onOpenQuote }) => {
  if (!product) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello Winhome, I am interested in technical specifications and pricing for: ${product.name}`
  );
  const whatsappUrl = `https://wa.me/${WINHOME_CONTACT.hotlineRaw.replace('+', '')}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-sky-700 uppercase bg-sky-100 px-2.5 py-0.5 rounded">
              {product.category.toUpperCase()} • {product.subCategory || 'Architectural System'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Image Preview */}
            <div className="relative aspect-square rounded-xl bg-slate-50 p-4 flex items-center justify-center border border-slate-100 overflow-hidden">
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
                <div className="absolute top-3 left-3 bg-white/95 border border-slate-200 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded shadow-xs">
                  Depth: {product.depth}
                </div>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {product.chambers && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Chamber Count</span>
                    <span className="text-sm font-bold text-slate-900">{product.chambers} Insulation Chambers</span>
                  </div>
                )}
                {product.depth && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Profile Depth</span>
                    <span className="text-sm font-bold text-slate-900">{product.depth}</span>
                  </div>
                )}
                {product.insulationValue && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Thermal Rating</span>
                    <span className="text-sm font-bold text-sky-700">{product.insulationValue}</span>
                  </div>
                )}
                {product.acousticValue && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Acoustic Barrier</span>
                    <span className="text-sm font-bold text-slate-900">{product.acousticValue}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Checklist */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Key Engineering Specifications & Strengths
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Specs Matrix */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Technical Data Sheet
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block">{key}</span>
                    <span className="text-xs font-semibold text-slate-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenQuote(product.name);
              }}
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculate Quote</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
