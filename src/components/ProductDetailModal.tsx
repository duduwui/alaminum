import React from 'react';
import { X } from 'lucide-react';
import { ProductItem } from '../data/winhomeData';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduct } from '../utils/localizedContent';

interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen?: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen = true, onClose }) => {
  const { currentLanguage } = useLanguage();
  if (!product || !isOpen) return null;
  const localizedProduct = getLocalizedProduct(product, currentLanguage.code);
  const isVid = /\.(mp4|webm|mov)(\?|#|$)/i.test(localizedProduct.videoUrl || '') || /\.(mp4|webm|mov)(\?|#|$)/i.test(localizedProduct.image || '') || /\.(mp4|webm|mov)(\?|#|$)/i.test(localizedProduct.fallbackImage || '');
  const mediaSrc = (isVid && localizedProduct.videoUrl) ? localizedProduct.videoUrl : (localizedProduct.image || localizedProduct.fallbackImage);
  const posterUrl = isVid
    ? (localizedProduct.fallbackImage && !/\.(mp4|webm|mov)(\?|#|$)/i.test(localizedProduct.fallbackImage)
        ? localizedProduct.fallbackImage
        : (localizedProduct.image && !/\.(mp4|webm|mov)(\?|#|$)/i.test(localizedProduct.image)
            ? localizedProduct.image
            : mediaSrc?.replace(/\.(mp4|webm|mov)(\?|#|$)/i, '.poster.jpg$1')))
    : mediaSrc;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={localizedProduct.name} className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"><X className="h-4 w-4" /></button>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex min-h-64 items-center justify-center rounded-2xl bg-slate-900/5 p-4 overflow-hidden">
            {isVid ? (
              <video
                src={mediaSrc}
                poster={posterUrl}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="max-h-80 w-full rounded-xl object-contain bg-black"
              />
            ) : (
              <img
                src={mediaSrc}
                alt={localizedProduct.name}
                className="max-h-80 w-full object-contain"
                onError={(e) => {
                  if (localizedProduct.fallbackImage && e.currentTarget.src !== localizedProduct.fallbackImage) {
                    e.currentTarget.src = localizedProduct.fallbackImage;
                  }
                }}
              />
            )}
          </div>
          <div className="flex flex-col justify-center gap-4">
            <h2 className="pr-7 text-2xl font-black text-slate-900">{localizedProduct.name}</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{localizedProduct.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
